import Fiber from "./ReactFiber"
import { Component } from "../react/React"
import { set } from "../shared/ReactInstanceMap"

export function adoptClassInstance( workInProgress: Fiber, instance: Component ) {
  workInProgress.stateNode = instance
  // The instance needs access to the fiber so that it can schedule updates
  set( instance, workInProgress )
}

export function constructClassInstance(
  workInProgress: Fiber,
  ctor: any,
  props: any
) {
  const instance = new ctor( props )
  adoptClassInstance( workInProgress, instance )
  return instance
}

// Invokes the mount life-cycles on a previously never rendered instance.
export function mountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any
) {
  const instance = <Component>workInProgress.stateNode
  instance.props = newProps
}
