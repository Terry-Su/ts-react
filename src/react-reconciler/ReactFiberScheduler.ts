import Fiber, { FiberStateNode, createWorkInProgress } from "./ReactFiber"
import { Sync, ExpirationTime } from "./ReactFiberExpirationTime"
import FiberRoot from "./ReactFiberRoot"
import { beginWork } from "./ReactFiberBeginWork"

let nextUnitOfWork: Fiber
let nextRoot: FiberRoot

let nextFlushedRoot: FiberRoot

let firstScheduledRoot: FiberRoot
let lastScheduleRoot: FiberRoot

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
  // To be continue
  nextFlushedRoot = highestPriorityRoot
}

export function performWork() {
  findHighestPriorityRoot()
  performWorkOnRoot( nextFlushedRoot )
}

export function performSyncWork() {
  performWork()
}

export function requestWork( root: FiberStateNode ) {
  performSyncWork()
}

export function scheduleWork( fiber: Fiber ) {
  const root = scheduleWorkToRoot( fiber )
  requestWork( root )
}