import Fiber from "./ReactFiber"
import { notNil, isFunction, isNil } from "../util/lodash"
import {
  HostRoot,
  IndeterminateComponent,
  ClassComponent,
  FunctionComponent,
  HostComponent
} from "../shared/ReactWorkTags"
import { processUpdateQueue } from "./ReactUpdateQueue"
import { reconcileChildFibers, mountChildFibers } from "./ReactChildFiber"
import { Placement, ContentReset } from "../shared/ReactSideEffectTags"
import { shouldSetTextContent } from "../react-dom/ReactDOMHostConfig"

export function reconcileChildren(
  current: Fiber,
  workInProgress: Fiber,
  nextChildren: any
) {
  if ( isNil( current ) ) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers( workInProgress, null, nextChildren )
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    )
  }
}

export function mountIndeterminateComponent(
  current: Fiber,
  workInProgress: Fiber,
  Component: any
) {
  const { pendingProps: props } = workInProgress
  let value
  value = Component( props )

  if (
    typeof value === "object" &&
    notNil( value ) &&
    isFunction( value.render ) &&
    isNil( value.$$typeof )
  ) {
  } else {
    // proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent

    reconcileChildren( null, workInProgress, value )
    return workInProgress.child
  }
}

export function updateHostComponent( current: Fiber, workInProgress: Fiber ) {
  const { type, pendingProps: nextProps } = workInProgress
  let { children: nextChildren } = nextProps

  const isDirectTextChild = shouldSetTextContent( type, nextProps )
  const prevProps = notNil( current ) ? current.memoizedProps : null

  if ( isDirectTextChild ) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also have access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null
  } else if ( notNil( prevProps ) && shouldSetTextContent( type, prevProps ) ){
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.effectTag |= ContentReset
  }

  reconcileChildren( current, workInProgress, nextChildren )
  return workInProgress.child
}

export function updateHostRoot( current: Fiber, workInProgress: Fiber ) {
  const { updateQueue, pendingProps: nextProps } = workInProgress
  processUpdateQueue( workInProgress, updateQueue, nextProps, null )
  const { memoizedState: nextState } = workInProgress
  const { element: nextChildren } = nextState
  reconcileChildren( current, workInProgress, nextChildren )
  return workInProgress.child
}

export function beginWork( current: Fiber, workInProgress: Fiber ): Fiber {
  switch ( workInProgress.tag ) {
    case HostRoot:
      return updateHostRoot( current, workInProgress )
    case IndeterminateComponent:
      const { elementType } = workInProgress
      return mountIndeterminateComponent( current, workInProgress, elementType )
    case HostComponent:
      return updateHostComponent( current, workInProgress )
  }
}
