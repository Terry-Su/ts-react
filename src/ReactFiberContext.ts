import { notNil } from "./util/js"
import { HostRoot, ClassComponent } from "./constant/ReactWorkTags"
import Fiber from "./ReactFiber"
import { StackCursor, createCursor, pop } from "./ReactFiberStack"

export const emptyContextObject = {}


// A cursor to the current merged context object on the stack
let contextStackCursor: StackCursor<Object> = createCursor( emptyContextObject )
// A cursor to a boolean indicating whether the context has changed
let didPerformWorkStackCursor: StackCursor<boolean> = createCursor( false )






export function isContextProvider( type: Function ): boolean {
  return notNil( ( <any>type ).childContextTypes )
}

export function isLegacyContextProvider() {

}


export function findCurrentUnmaskedContext( fiber: Fiber ): Object {
  let node = fiber
  do {
     switch( node.tag ) {
      case HostRoot:
        return node.stateNode.context
      case ClassComponent:
        const Component = node.type
        if ( isContextProvider( Component ) ) {
          return node.stateNode.__reactInternalMemoizedMergedChildContext
        }
        break
     }
     node = node.return
  } while ( notNil( node ) )
}

export function processChildContext(
  fiber: Fiber,
  type: any,
  parentContext: Object
): Object {
  const instance = fiber.stateNode
  const childContextTypes = type.childContextTypes
  // ...
  return
}


export function popContext( fiber: Fiber ) {
  pop( didPerformWorkStackCursor, fiber )
  pop( contextStackCursor, fiber )
}


export function popTopLevelContextObject( fiber: Fiber ) {
  pop(  didPerformWorkStackCursor, fiber )
  pop(  contextStackCursor, fiber )
}