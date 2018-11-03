import { ExpirationTime } from "./__typings__/index.spec"
import { now } from "./ReactHostConfig"
import { msToExpirationTime, NoWork, Never, Sync, computeInteractiveExpiration, computeAsyncExpiration } from "./ReactFiberExpirationTime"
import Fiber from "./ReactFiber"
import { ConcurrentMode } from "./constant/ReactTypeOfMode"
import { notNil } from "./util/js"

let isBatchingUpdates: boolean = false
let isUnbatchingUpdates: boolean = false
let isBatchingInteractiveUpdates: boolean = false


let isRendering: boolean = false

let originalStartTimeMs: number = now()
let currentRendererTime: ExpirationTime = msToExpirationTime( originalStartTimeMs )
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


// The time at which we're currently rendering work
let nextRenderExpirationTime: ExpirationTime = NoWork

let nextRoot: FiberRoot = null



export function unbatchedUpdates( fn: Function, params?: any ) {
  if ( isBatchingUpdates && !isUnbatchingUpdates  ) {
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

export function computeExpirationForFiber( currentTime: ExpirationTime, fiber: Fiber ) {
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
      if ( ! isCommitting ) {
        // Updates during the render phase should expire at the same time as the work that is being rendered
        expirationTime = nextRenderExpirationTime
      }
    }

    if ( ! isWorking ) {
      // No explicit expiration context was set, and we're not
      // currently performing work. Calculate a new expiration time.
      const isConcurrentMode = fiber.mode & ConcurrentMode
      if ( isConcurrentMode ) {
        if ( isBatchingInteractiveUpdates ) {
          // This is an interactive update
          expirationTime = computeInteractiveExpiration( currentTime )
        }
        if ( ! isBatchingInteractiveUpdates ) {
          // This is an async update
          expirationTime = computeAsyncExpiration( currentTime )
        }

        // If we're in the middle of rendering a tree, do not update at the
        // same expiration time that is already rendering
        if ( notNil( nextRoot ) && expirationTime === nextRenderExpirationTime ) {
          expirationTime = expirationTime + 1
        }
      }

      if ( ! isConcurrentMode ) {
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