import Fiber from "./ReactFiber"
import { HostComponent } from "../shared/ReactWorkTags"
import { createInstance } from "../react-dom/ReactDOMHostConfig"
import { getHostContainer } from "../tmp/hostContainer"
import { REACT_HTML_ELEMENT } from "../__typings__/index"

export function appendAllChildren( parent: REACT_HTML_ELEMENT, workInProgress: Fiber ) {

}

export function completeWork( current: Fiber, workInProgress: Fiber ) {
  const { pendingProps: newProps } = workInProgress
  switch ( workInProgress.tag ) {
    case HostComponent: {
      const { type } = workInProgress
      var rootContainerInstance = getHostContainer()

      const instance = createInstance(
        type,
        newProps,
        rootContainerInstance,
        workInProgress
      )

      appendAllChildren( instance, workInProgress )

      workInProgress.stateNode = instance
    }
  }
  return null
}
