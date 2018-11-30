import Fiber from "./ReactFiber"
import { notNil, isFunction, isNil } from "../util/lodash"
import { HostRoot, IndeterminateComponent, ClassComponent, FunctionComponent } from "../shared/ReactWorkTags"
import { processUpdateQueue } from "./ReactUpdateQueue"
import { reconcileChildFibers } from "./ReactChildFiber"
import { Placement } from "../shared/ReactSideEffectTags"



export function reconcileChildren( current: Fiber, workInProgress: Fiber, nextChildren: any ) {
  workInProgress.child = reconcileChildFibers( workInProgress, current.child, nextChildren )
}

export function mountIndeterminateComponent( current: Fiber, workInProgress: Fiber, Component: any ) {
  const { pendingProps: props } = workInProgress
  // const unmaskedContext = getUnmaskedContext( workInProgress, Component, false )
  // tsnote: temporarily set context as an empty object
  const context = {}

  let value

  if ( Component && isFunction( Component.prototype.render ) ) {
    value = Component( props, context )
  }

  if ( typeof value === 'object' && notNil( value ) && isFunction( value.render  ) && isNil( value.$$typeof ) ) {
  } else {
    // proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent

    reconcileChildren( null, workInProgress, value )
    return workInProgress.child
  }
}

export function updateHostRoot( current: Fiber, workInProgress: Fiber ) {
  const { 
    updateQueue,
    pendingProps: nextProps,
   } = workInProgress
  processUpdateQueue( workInProgress, updateQueue, nextProps, null )
  const {
    memoizedState: nextState,
  } = workInProgress
  const { element: nextChildren } = nextState
  reconcileChildren( current, workInProgress, nextChildren )
}


export function beginWork( current: Fiber, workInProgress: Fiber ): Fiber {
  switch( workInProgress.tag ) {
    case HostRoot:
      return updateHostRoot( current, workInProgress )
    case IndeterminateComponent:
      const { elementType } = workInProgress
      return mountIndeterminateComponent( current, workInProgress, elementType )
  }
  
}