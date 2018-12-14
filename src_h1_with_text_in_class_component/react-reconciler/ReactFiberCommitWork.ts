import Fiber from "./ReactFiber"
import { HostComponent, HostText, HostRoot, HostPortal } from "../shared/ReactWorkTags"
import { notNil, isNil } from "../util/lodash"
import { appendChildToContainer } from "../react-dom/ReactDOMHostConfig"
import FiberRoot from "./ReactFiberRoot"

export function getHostSibling( finishedWork: Fiber ) {
  return null
}

function isHostParent( fiber ) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal
}

export function getHostParentFiber( fiber: Fiber ) {
  var parent = fiber.return
  while ( parent !== null ) {
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

  switch( parentFiber.tag ) {
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