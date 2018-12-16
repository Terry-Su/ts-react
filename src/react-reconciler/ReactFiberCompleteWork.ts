import Fiber from "./ReactFiber"
import { HostComponent, HostText } from "../shared/ReactWorkTags"
import { createInstance, finalizeInitialChildren, createTextInstance, appendInitialChild } from "../react-dom/ReactDOMHostConfig"
import { getHostContainer } from "../tmp/hostContainer"
import { REACT_HTML_ELEMENT } from "../__typings__/index"
import { notNil, isNil } from "../util/lodash"
import { isString } from "util"

export function appendAllChildren( parent: REACT_HTML_ELEMENT, workInProgress: Fiber ) {
  let { child: node } = workInProgress
  while ( notNil( node ) ) {
    if ( node.tag === HostComponent || node.tag === HostText ) {
      appendInitialChild( parent, <REACT_HTML_ELEMENT>node.stateNode )
    } else if ( notNil( node.child ) ) {
      node.child.return = node
      node = node.child
      continue
    }
    if ( node === workInProgress ) {
      return
    }
    while ( isNil( node.sibling ) ) {
      if ( isNil( node.return ) || node.return === workInProgress ) {
        return
      }
      node = node.return
    }

    // tmp
    if ( node.sibling ) {
      node.sibling.return = node.return
    }
    node = node.sibling
  }
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

      // !! Set inner text from here
      if ( finalizeInitialChildren( instance,  <string>type, newProps, rootContainerInstance ) ) {
        // ...
      }

      workInProgress.stateNode = instance
    }
    break
    case HostText: {
      const newText = newProps
      
      if ( current && notNil( workInProgress.stateNode ) ) {
      } else {
        const rootContainerInstance = getHostContainer()
        workInProgress.stateNode = createTextInstance( newText, rootContainerInstance, workInProgress )
      }
    }
    break
  }
  return null
}
