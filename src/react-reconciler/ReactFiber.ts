import { Type } from "../__typings__/index"
import { Component } from "../react/React"
import { HostRoot, WorkTag } from "../shared/ReactWorkTags"
import { isNil } from "../util/lodash"
import FiberRoot from "./ReactFiberRoot"
import UpdateQueue from "./ReactUpdateQueue"

export default class Fiber {
  tag: WorkTag
  type: Type
  key: any
  
  child: Fiber
  sibling: Fiber
  return: Fiber

  pendingProps: any
  memoizedProps: any

  updateQueue: UpdateQueue
  memoizedState: any

  // flushing or work-in-progress
  alternate: Fiber

  stateNode: HTMLElement | Component | FiberRoot 

  constructor( tag: WorkTag, pendingProps: any, key: any ) {
    this.tag = tag
    this.pendingProps = pendingProps
  }
}

export function createFiber( tag, pendingProps, key ) {
  return new Fiber( tag, pendingProps, key )
};

export function createHostRootFiber() {
  return createFiber( HostRoot, null, null )
}

export function createWorkInProgress( current: Fiber, pendingProps: any ) {
  let workInProgress = current.alternate
  if ( isNil( workInProgress ) ) {
    workInProgress = createFiber( current.tag, pendingProps, current.key )
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode

    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
  }

  workInProgress.child = current.child
  workInProgress.sibling = current.sibling
  workInProgress.memoizedProps = current.child

  return workInProgress
  
}
