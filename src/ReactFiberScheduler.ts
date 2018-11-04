import { ExpirationTime } from "./__typings__/index.spec"
import { now } from "./ReactHostConfig"
import {
  msToExpirationTime,
  NoWork,
  Never,
  Sync,
  computeInteractiveExpiration,
  computeAsyncExpiration
} from "./ReactFiberExpirationTime"
import Fiber from "./ReactFiber"
import { ConcurrentMode } from "./constant/ReactTypeOfMode"
import { notNil, isNil } from "./util/js"
import FiberRoot from "./ReactFiberRoot"
import { HostRoot } from "./constant/ReactWorkTags"
import { ENABLE_SCHEDULER_TRACING } from "./constant/ReactFeatureFlags"
import { unwindInterruptedWork } from "./ReactFiberUnwindWork"
import { markPendingPriorityLevel } from "./ReactFiberPendingPriority"

let isBatchingUpdates: boolean = false
let isUnbatchingUpdates: boolean = false
let isBatchingInteractiveUpdates: boolean = false

let isRendering: boolean = false

let originalStartTimeMs: number = now()
let currentRendererTime: ExpirationTime = msToExpirationTime(
  originalStartTimeMs
)
let currentSchedulerTime: ExpirationTime = currentRendererTime

let lastScheduleRoot: FiberRoot = null

let nextFlushedRoot: FiberRoot = null
let nextFlushedExpirationTime: ExpirationTime = NoWork
let lowestPriorityPendingInteractiveExpirationTime: ExpirationTime = NoWork

// Represent the expiration time that incoming updates should use
//
// If this is NoWork, use the default stategy: async updates in
// async mode, sync updates in sync mode.
let expirationContext: ExpirationTime = NoWork

let isWorking: boolean = false

let isCommitting: boolean = false

// The next work in progress fiber that we're currently working on
let nextUnitOfWork: Fiber = null
let nextRoot: FiberRoot = null
// The time at which we're currently rendering work
let nextRenderExpirationTime: ExpirationTime = NoWork
let nextLatestAbsoluteTimeoutMs: number = -1
let nextRenderDidError: boolean = false

// Used for performance tracking
let interruptedBy: Fiber = null

// Use these to prevent an infinite loop of nested updates
const NESTED_UPDATE_LIMIT = 50
let nestedUpdateCount: number = 0


// Linked-list of roots
let firstScheduledRoot: FiberRoot = null
let lastScheduledRoot: FiberRoot = null

export function unbatchedUpdates( fn: Function, params?: any ) {
  if ( isBatchingUpdates && !isUnbatchingUpdates ) {
    isUnbatchingUpdates = true
  }
  return fn( params )
}

/**
 * For computing an expiration time
 *
 *
 */
export function requestCurrentTime() {
  if ( isRendering ) {
    return currentSchedulerTime
  }

  // Check if there's pending work
  findHighestPriorityRoot()
  if (
    nextFlushedExpirationTime === NoWork ||
    nextFlushedExpirationTime === Never
  ) {
    // If there's no pending work, or the pending
    // owrk is offscreen, we can read the current
    // time without risk of tearing
    recomputeCurrentRendererTime()
    currentSchedulerTime = currentRendererTime
    return currentSchedulerTime
  }

  // There's already pending work.
  return currentSchedulerTime
}

function findHighestPriorityRoot() {
  let highestPriorityWork = NoWork
  let highestPriorityRoot = null
  if ( lastScheduleRoot != null ) {
    // ...
  }

  nextFlushedRoot = highestPriorityRoot
  nextFlushedExpirationTime = highestPriorityWork
}

function recomputeCurrentRendererTime() {
  const currentTimeMs = now() - originalStartTimeMs
  currentRendererTime = msToExpirationTime( currentTimeMs )
}

export function computeExpirationForFiber(
  currentTime: ExpirationTime,
  fiber: Fiber
) {
  let expirationTime

  if ( expirationContext !== NoWork ) {
    // An explicit expiration context was set
    expirationTime = expirationContext
  }
  if ( expirationContext === NoWork ) {
    if ( isWorking ) {
      if ( isCommitting ) {
        // Updates that occur during the commit phase should have sync priority by default
        expirationTime = Sync
      }
      if ( !isCommitting ) {
        // Updates during the render phase should expire at the same time as the work that is being rendered
        expirationTime = nextRenderExpirationTime
      }
    }

    if ( !isWorking ) {
      // No explicit expiration context was set, and we're not
      // currently performing work. Calculate a new expiration time.
      const isConcurrentMode = fiber.mode & ConcurrentMode
      if ( isConcurrentMode ) {
        if ( isBatchingInteractiveUpdates ) {
          // This is an interactive update
          expirationTime = computeInteractiveExpiration( currentTime )
        }
        if ( !isBatchingInteractiveUpdates ) {
          // This is an async update
          expirationTime = computeAsyncExpiration( currentTime )
        }

        // If we're in the middle of rendering a tree, do not update at the
        // same expiration time that is already rendering
        if ( notNil( nextRoot ) && expirationTime === nextRenderExpirationTime ) {
          expirationTime = expirationTime + 1
        }
      }

      if ( !isConcurrentMode ) {
        // This is a sync update
        expirationTime = Sync
      }
    }
  }

  if ( isBatchingInteractiveUpdates ) {
    // This is an interactive update.
    // Keep track of the lowest pending interactive expiration time.
    // This allows us to synchronously flush all interactive updates when needed
    if ( expirationTime > lowestPriorityPendingInteractiveExpirationTime ) {
      lowestPriorityPendingInteractiveExpirationTime = expirationTime
    }
  }

  return expirationTime
}

export function scheduleWork( fiber: Fiber, expirationTime: ExpirationTime ) {
  const root = scheduleWorkToRoot( fiber, expirationTime )
  if ( isNil( root ) ) {
    return
  }

  if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime < nextRenderExpirationTime
  ) {
    interruptedBy = fiber
    resetStack()
  }

  markPendingPriorityLevel( root, expirationTime )

  if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit
    !isWorking ||
    isCommitting ||
    // ...unless this is a different root than the one we're rendering
    nextRoot !== root
  ) {
    const rootExpirationTime = root.expirationTime
    requestWork( root, rootExpirationTime )
  }

  if ( nestedUpdateCount > NESTED_UPDATE_LIMIT ) {
    // Rest this back to zero so subsequent update don't throw
    nestedUpdateCount = 0
  }
}

export function requestWork( root: FiberRoot, expirationTime: ExpirationTime ) {
  addRootToSchedule( root, expirationTime )

  if ( isRendering ) {
    return
  }

  if ( isBatchingUpdates ) {
    // Flush work at the end of the batch
    if ( isUnbatchingUpdates ) {
      // ...unless we're inside unbatchedUpdates, in which casse we should flush it now
      nextFlushedRoot = root
      nextFlushedExpirationTime = Sync
      performWorkOnRoot( root, Sync, true )
    }
  }
  return
}

function performWorkOnRoot(
  root: FiberRoot,
  expirationTime: ExpirationTime,
  isExpired: boolean
) {
  isRendering = true

  
}


function addRootToSchedule( root: FiberRoot, expirationTime: ExpirationTime ) {
  // Add the root to the schedule.
  // Check if this root is already part of the schedule.
  if ( root.nextScheduledRoot === null ) {
    // This root is not already scheduled. Add it.
    root.expirationTime = expirationTime
    if ( lastScheduledRoot === null ) {
      firstScheduledRoot = lastScheduledRoot = root
      root.nextScheduledRoot = root
    } else {
      lastScheduledRoot.nextScheduledRoot = root
      lastScheduledRoot = root
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot
    }
  } else {
    // This root is already scheduled, but its priority may have increased.
    const remainingExpirationTime = root.expirationTime
    if (
      remainingExpirationTime === NoWork ||
      expirationTime < remainingExpirationTime
    ) {
      // Update the priority.
      root.expirationTime = expirationTime
    }
  }
}

function scheduleWorkToRoot(
  fiber: Fiber,
  expirationTime: ExpirationTime
): FiberRoot {
  // Update the source fiber's expiration time
  if (
    fiber.expirationTime === NoWork ||
    fiber.expirationTime > expirationTime
  ) {
    fiber.expirationTime = expirationTime
  }
  let alternate = fiber.alternate
  if (
    notNil( alternate ) &&
    ( alternate.expirationTime === NoWork ||
      alternate.expirationTime > expirationTime )
  ) {
    alternate.expirationTime = expirationTime
  }
  // Walk the parent path to the root and update the child expiration time
  let node = fiber.return
  let root = null
  if ( isNil( node ) && fiber.tag === HostRoot ) {
    root = fiber.stateNode
  } else {
    while ( notNil( node ) ) {
      alternate = node.alternate
      if (
        node.childExpirationTime === NoWork ||
        node.childExpirationTime > expirationTime
      ) {
        node.childExpirationTime = expirationTime
        if (
          alternate !== null &&
          ( alternate.childExpirationTime === NoWork ||
            alternate.childExpirationTime > expirationTime )
        ) {
          alternate.childExpirationTime = expirationTime
        }
      } else if (
        alternate !== null &&
        ( alternate.childExpirationTime === NoWork ||
          alternate.childExpirationTime > expirationTime )
      ) {
        alternate.childExpirationTime = expirationTime
      }
      if ( node.return === null && node.tag === HostRoot ) {
        root = node.stateNode
        break
      }
      node = node.return
    }
  }

  if ( isNil( root ) ) {
    return null
  }

  if ( ENABLE_SCHEDULER_TRACING ) {
    // ...
  }

  return root
}

function resetStack() {
  if ( notNil( nextUnitOfWork ) ) {
    let interruptedWork = nextUnitOfWork.return
    while ( notNil( interruptedWork ) ) {
      unwindInterruptedWork( interruptedWork )
      interruptedWork = interruptedWork.return
    }
  }

  nextRoot = null
  nextRenderExpirationTime = NoWork
  nextLatestAbsoluteTimeoutMs = -1
  nextRenderDidError = false
  nextUnitOfWork = null
}
