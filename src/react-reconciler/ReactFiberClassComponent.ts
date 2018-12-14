import Fiber from "./ReactFiber"
import { Component } from "../react/React"
import { set, get } from "../shared/ReactInstanceMap"
import {
  createUpdate,
  enqueueUpdate,
  processUpdateQueue
} from "./ReactUpdateQueue"
import { notNil } from "../util/lodash"
import { scheduleWork } from "./ReactFiberScheduler"
import { Update } from "../shared/ReactSideEffectTags"

class ClassComponentUpdater {
  enqueueSetState = ( inst: Component, payload: any, callback: Function ) => {
    const fiber = get( inst )

    
    const update = createUpdate()

    update.payload = payload

    if ( notNil( callback ) ) {
      update.callback = callback
    }

    enqueueUpdate( fiber, update )
    scheduleWork( fiber )
  }
}

export function adoptClassInstance( workInProgress: Fiber, instance: Component ) {
  instance.updater = new ClassComponentUpdater()
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

  if ( typeof instance.componentDidMount === "function" ) {
    workInProgress.effectTag |= Update
  }
}

export function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  ctor: any,
  newProps: any
) {
  const { memoizedProps: oldProps } = workInProgress

  const instance = <Component>workInProgress.stateNode

  const { updateQueue, memoizedState: oldState } = workInProgress

  let newState = ( instance.state = oldState )

  if ( notNil( updateQueue ) ) {
    processUpdateQueue( workInProgress, updateQueue, newProps, instance )
    newState = workInProgress.memoizedState
  }

  var shouldUpdate = true

  if ( shouldUpdate ) {
  }

  instance.props = newProps
  instance.state = newState

  return shouldUpdate
}
