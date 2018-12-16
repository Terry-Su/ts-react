import Fiber from "./ReactFiber"
import {
  HostComponent,
  HostText,
  HostRoot,
  HostPortal,
  ClassComponent
} from "../shared/ReactWorkTags"
import { notNil, isNil } from "../util/lodash"
import { appendChildToContainer } from "../react-dom/ReactDOMHostConfig"
import FiberRoot from "./ReactFiberRoot"
import { Update } from "../shared/ReactSideEffectTags"
import { Component } from "../react/React"
import { commitUpdateQueue } from "./ReactUpdateQueue"

export function getHostSibling( finishedWork: Fiber ) {
  return null
}

function isHostParent( fiber ) {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot ||
    fiber.tag === HostPortal
  )
}

export function getHostParentFiber( fiber: Fiber ) {
  var parent = fiber.return
  while ( notNil( parent ) ) {
    if ( isHostParent( parent ) ) {
      return parent
    }
    parent = parent.return
  }
}

export function commitPlacement( finishedWork: Fiber ) {
  // Recursively insert all host nodes into the parent.
  var parentFiber = getHostParentFiber( finishedWork )

  let parent
  let isContainer

  switch ( parentFiber.tag ) {
    case HostComponent:
      parent = parentFiber.stateNode
      isContainer = false
    case HostRoot:
      parent = ( <FiberRoot>parentFiber.stateNode ).containerInfo
      isContainer = true
      break
  }

  let node = finishedWork
  const before = getHostSibling( finishedWork )
  while ( true ) {
    if ( node.tag === HostComponent || node.tag === HostText ) {
      if ( before ) {
      } else {
        if ( isContainer ) {
          appendChildToContainer( parent, node.stateNode )
        } else {
        }
      }
    } else if ( node.tag === HostPortal ) {
    } else if ( notNil( node.child ) ) {
      node.child.return = node
      node = node.child
      continue
    }

    if ( node === finishedWork ) {
      return
    }

    while ( isNil( node.sibling ) ) {
      if ( isNil( node.return ) || node.return === finishedWork ) {
        return
      }
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}

export function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber,
  finishedWork: Fiber
) {
  switch ( finishedWork.tag ) {
    case ClassComponent: {
      const instance = <Component>finishedWork.stateNode
      if ( finishedWork.effectTag & Update ) {
        if ( isNil( current ) ) {
          instance.props = finishedWork.memoizedProps
          instance.state = finishedWork.memoizedState
          instance.componentDidMount()
        }
      }
      const { updateQueue } = finishedWork
      if ( notNil( updateQueue ) ) {
        instance.props = finishedWork.memoizedProps
        instance.state = finishedWork.memoizedState
        commitUpdateQueue( finishedWork, updateQueue, instance )
      }
    }
  }
}
