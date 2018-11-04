import { pop, StackCursor, createCursor } from "./ReactFiberStack"
import Fiber from "./ReactFiber"
import { HostContext, Container } from "./ReactHostConfig"
declare class NoContextT {}
const NO_CONTEXT: NoContextT = {}


let contextFiberStackCursor: StackCursor<Fiber | NoContextT> = createCursor( NO_CONTEXT )

let contextStackCursor: StackCursor<HostContext | NoContextT> = createCursor( NO_CONTEXT )

let rootInstanceStackCursor: StackCursor<Container | NoContextT> = createCursor( NO_CONTEXT )

export function popHostContainer( fiber: Fiber ) {
  pop( contextStackCursor, fiber )
  pop( contextFiberStackCursor, fiber )
  pop( rootInstanceStackCursor, fiber )
}


export function popHostContext( fiber: Fiber ) {
  // Do not pop unless this Fiber provided the current context
  // pushHostContext() only pushes Fibers that provide unique contexts
  if ( contextFiberStackCursor.current !== fiber ) {
    return
  }

  pop( contextStackCursor, fiber )
  pop( contextFiberStackCursor, fiber )
}