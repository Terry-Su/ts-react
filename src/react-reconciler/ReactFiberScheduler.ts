import Fiber, { FiberStateNode, createWorkInProgress } from "./ReactFiber"
import { Sync, ExpirationTime } from "./ReactFiberExpirationTime"
import FiberRoot from "./ReactFiberRoot"
import { beginWork } from "./ReactFiberBeginWork"
import { isNil, notNil } from "../util/lodash"
import { Incomplete, NoEffect } from "../shared/ReactSideEffectTags"
import { completeWork } from "./ReactFiberCompleteWork"

let nextUnitOfWork: Fiber
let nextRoot: FiberRoot

let nextFlushedRoot: FiberRoot

let firstScheduledRoot: FiberRoot
let lastScheduledRoot: FiberRoot

export function scheduleWorkToRoot( fiber: Fiber ) {
  const root = fiber.stateNode
  return root
}

function completeUnitOfWork( workInProgress: Fiber ) {
  while( true ) {
    const {
      alternate: current
    } = workInProgress

    const returnFiber = workInProgress.return
    const siblingFiber = workInProgress.sibling
    let next

    if ( ( workInProgress.effectTag & Incomplete ) === NoEffect ) {
      nextUnitOfWork = completeWork( current, workInProgress )
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
  while( notNil( nextUnitOfWork ) ) {
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


export function performWorkOnRoot( root: FiberRoot ) {
  renderRoot( root )
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
  if (  isNil( root.nextScheduledRoot ) ) {
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