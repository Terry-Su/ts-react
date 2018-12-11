import Fiber, { FiberStateNode, createWorkInProgress } from "./ReactFiber"
import { Sync, ExpirationTime } from "./ReactFiberExpirationTime"
import FiberRoot from "./ReactFiberRoot"
import { beginWork } from "./ReactFiberBeginWork"
import { isNil, notNil } from "../util/lodash"

let nextUnitOfWork: Fiber
let nextRoot: FiberRoot

let nextFlushedRoot: FiberRoot

let firstScheduledRoot: FiberRoot
let lastScheduledRoot: FiberRoot

export function scheduleWorkToRoot( fiber: Fiber ) {
  const root = fiber.stateNode
  return root
}

export function performUnitOfWork( workInProgress: Fiber ) {
  let next = beginWork( workInProgress.alternate, workInProgress )
  workInProgress.memoizedProps = workInProgress.pendingProps
  return next
}

export function workLoop() {
  nextUnitOfWork = performUnitOfWork( nextUnitOfWork )
}

export function renderRoot( root: FiberRoot ) {
  nextUnitOfWork = createWorkInProgress( root.current, null )

  workLoop()
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