import Fiber from "./ReactFiber"
import { notNil } from "../util/lodash"
import { HostRoot } from "../shared/ReactWorkTags"


function updateHostRoot( current: Fiber, workInProgress: Fiber ) {
  const { 
    memoizedState: nextState,
    updateQueue,
    pendingProps: nextProps,
   } = workInProgress
  const nextChildren = nextState.element
  processUpdateQueue( workInProgress, updateQueue, nextProps )
  reconcileChildren( current, workInProgress, nextChildren )
}


export function beginWork( current: Fiber, workInProgress: Fiber ) {
  switch( workInProgress.tag ) {
    case HostRoot:
      return updateHostRoot( current, workInProgress )
  }
}