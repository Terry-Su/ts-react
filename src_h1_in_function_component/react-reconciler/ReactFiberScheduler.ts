import Fiber, { FiberStateNode, createWorkInProgress } from "./ReactFiber"
import { Sync, ExpirationTime } from "./ReactFiberExpirationTime"
import FiberRoot from "./ReactFiberRoot"
import { beginWork } from "./ReactFiberBeginWork"
import { isNil, notNil } from "../util/lodash"
import { Incomplete, NoEffect, Placement, Update, Deletion, PerformedWork } from "../shared/ReactSideEffectTags"
import { completeWork } from "./ReactFiberCompleteWork"
import { prepareForCommit } from "../react-dom/ReactDOMHostConfig"
import { commitPlacement } from "./ReactFiberCommitWork"

let nextUnitOfWork: Fiber
let nextRoot: FiberRoot

let nextFlushedRoot: FiberRoot

let firstScheduledRoot: FiberRoot
let lastScheduledRoot: FiberRoot

let nextEffect

export function scheduleWorkToRoot( fiber: Fiber ) {
  const root = fiber.stateNode
  return root
}

function completeUnitOfWork( workInProgress: Fiber ) {
  while ( true ) {
    const { alternate: current } = workInProgress

    const returnFiber = workInProgress.return
    const siblingFiber = workInProgress.sibling
    let next


    if ( ( workInProgress.effectTag & Incomplete ) === NoEffect ) {
      // This fiber completed.

      nextUnitOfWork = completeWork( current, workInProgress )


      if ( notNil( returnFiber ) &&
        // Do not append effects to parents if a sibling failed to complete
        ( returnFiber.effectTag & Incomplete ) === NoEffect ) {
          // Append all the effects of the subtree and this fiber onto the effect
          // list of the parent. The completion order of the children affects the
          // side-effect order.
          if ( isNil( returnFiber.firstEffect ) ) {
            returnFiber.firstEffect = workInProgress.firstEffect
          }
          if ( notNil( workInProgress.lastEffect ) ) {
            if ( notNil( returnFiber.lastEffect ) ) {
              returnFiber.lastEffect.nextEffect = workInProgress.firstEffect
            }
            returnFiber.lastEffect = workInProgress.lastEffect
          }
  
          // If this fiber had side-effects, we append it AFTER the children's
          // side-effects. We can perform certain side-effects earlier if
          // needed, by doing multiple passes over the effect list. We don't want
          // to schedule our own side-effect on our own list because if end up
          // reusing children we'll schedule this effect onto itself since we're
          // at the end.
          var effectTag = workInProgress.effectTag
          // Skip both NoWork and PerformedWork tags when creating the effect list.
          // PerformedWork effect is read by React DevTools but shouldn't be committed.
          if ( effectTag > PerformedWork ) {
            if ( notNil( returnFiber.lastEffect ) ) {
              returnFiber.lastEffect.nextEffect = workInProgress
            } else {
              returnFiber.firstEffect = workInProgress
            }
            returnFiber.lastEffect = workInProgress
          }
        }
    }

    if ( notNil( siblingFiber ) ) {
      // If there is more work to do in this returnFiber, do that next.
      return siblingFiber
    } else if ( notNil( returnFiber ) ) {
      // If there's no more work in this returnFiber. Complete the returnFiber.
      workInProgress = returnFiber
      continue
    } else {
      // We've reached the root.
      return null
    }
  }
}

export function performUnitOfWork( workInProgress: Fiber ) {
  let next: Fiber = beginWork( workInProgress.alternate, workInProgress )
  workInProgress.memoizedProps = workInProgress.pendingProps

  if ( isNil( next ) ) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork( workInProgress )
  }

  return next
}

export function workLoop() {
  while ( notNil( nextUnitOfWork ) ) {
    nextUnitOfWork = performUnitOfWork( nextUnitOfWork )
  }
}

export function onComplete( root: FiberRoot, finishedWork: Fiber ) {
  root.finishedWork = finishedWork
}

export function renderRoot( root: FiberRoot ) {
  nextUnitOfWork = createWorkInProgress( root.current, null )

  workLoop()

  const rootWorkInProgress = root.current.alternate

  // Ready to commit
  onComplete( root, rootWorkInProgress )
}

export function onCommit( root: FiberRoot ) {
  root.finishedWork = null
}


export function commitAllHostEffects() {
  while( notNil( nextEffect ) ) {
    const { effectTag } = nextEffect

    const primaryEffectTag = effectTag & ( Placement | Update | Deletion )
    switch( primaryEffectTag ) {
      case Placement: {
        commitPlacement( nextEffect )
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted
        // does and isMounted is deprecated anyway so we should be able
        // to kill this.
        nextEffect.effectTag &= ~Placement
      }

    }
  }
}


export function commitRoot( root: FiberRoot, finishedWork: Fiber ) {
  let firstEffect
  finishedWork.lastEffect.nextEffect = finishedWork
  firstEffect = finishedWork.firstEffect

  nextEffect = firstEffect

  // prepareForCommit( root.containerInfo )
  // resetAfterCommit( root.containerInfo )
  root.current = finishedWork
  // onCommitRoot( finishedWork.stateNode )
  // onCommit( root )
  commitAllHostEffects()

  nextEffect = firstEffect
}

export function completeRoot( root: FiberRoot, finishedWork: Fiber ) {
  // Commit the root.
  root.finishedWork = null

  commitRoot( root, finishedWork )
}

export function performWorkOnRoot( root: FiberRoot ) {
  let { finishedWork } = root

  if ( notNil( finishedWork ) ) {
    completeRoot( root, finishedWork )
  } else {
    root.finishedWork = null
    renderRoot( root )
    finishedWork = root.finishedWork
    if ( notNil( finishedWork ) ) {
      // We've completed the root. Commit it.
      completeRoot( root, finishedWork )
    }
  }
}

export function findHighestPriorityRoot() {
  let highestPriorityRoot

  if ( notNil( lastScheduledRoot ) ) {
    let root = firstScheduledRoot

    highestPriorityRoot = lastScheduledRoot
  }

  nextFlushedRoot = highestPriorityRoot
}

export function addRootToSchedule( root: FiberRoot ) {
  if ( isNil( root.nextScheduledRoot ) ) {
    if ( isNil( lastScheduledRoot ) ) {
      firstScheduledRoot = lastScheduledRoot = root
    }
  }
}

export function performWork() {
  findHighestPriorityRoot()
  performWorkOnRoot( nextFlushedRoot )
}

export function performSyncWork() {
  performWork()
}

export function requestWork( root: FiberStateNode ) {
  addRootToSchedule( <FiberRoot>root )
  performSyncWork()
}

export function scheduleWork( fiber: Fiber ) {
  const root = scheduleWorkToRoot( fiber )
  requestWork( root )
}