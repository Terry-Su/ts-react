import { ReactContext } from "./__typings__/ReactTypes"
import { pop, createCursor, StackCursor } from "./ReactFiberStack"
import { isPrimaryRenderer } from "./ReactHostConfig"
import Fiber from "./ReactFiber"

const valueCursor: StackCursor<any> = createCursor( null )

export type ContextDependency<T> = {
  context: ReactContext<T>
  observedBits: number
  next: ContextDependency<any>
}

export function popProvider( providerFiber: Fiber ) {
  const currentValue = valueCursor.current

  pop( valueCursor, providerFiber )

  const context: ReactContext<any> = providerFiber.type._context
  if ( isPrimaryRenderer ) {
    context._currentValue = currentValue
  } else {
    context._currentValue2 = currentValue
  }
}