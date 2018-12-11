import { Type } from "../__typings__/index"
import { Component } from "../react/React"
import { HostRoot, WorkTag, IndeterminateComponent, ClassComponent, HostComponent } from "../shared/ReactWorkTags"
import { isNil, isFunction, isString } from "../util/lodash"
import FiberRoot from "./ReactFiberRoot"
import UpdateQueue from "./ReactUpdateQueue"
import { ReactElement } from "../react/ReactElement"
import { SideEffectTag } from "../shared/ReactSideEffectTags"

export type FiberStateNode = HTMLElement | Component | FiberRoot 

export default class Fiber {
  tag: WorkTag
  type: Type
  elementType: Type
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

  // (still confusing)The local state associated with this fiber
  stateNode: FiberStateNode

  effectTag: SideEffectTag

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
  workInProgress.updateQueue = current.updateQueue


  return workInProgress
  
}


export function shouldConstruct( Component ) {
  const { prototype } = Component
  return !!( prototype && prototype.isReactComponent )
}

export function createFiberFromTypeAndProps( type: Type, key: any, pendingProps: any ) {
  let fiberTag:WorkTag = IndeterminateComponent

  // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
  let resolvedType = type

  if ( isFunction( type ) ) {
    if ( shouldConstruct( type ) ) {
      fiberTag = ClassComponent
    }
  } else if ( isString( type ) ) {
    fiberTag = HostComponent
  } else {}

  const fiber = createFiber( fiberTag, pendingProps, key )
  fiber.elementType = type
  fiber.type = resolvedType
  return fiber
}


export function createFiberFromElement( element: ReactElement ) {
  const { type, key, props: pendingProps  } = element
  const fiber = createFiberFromTypeAndProps( type, key, pendingProps )
  return fiber
}