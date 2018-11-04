import Fiber from "./ReactFiber"

let index = -1
let valueStack: any[] = [] 

export type StackCursor<T> = {
  current: T
}


export function createCursor<T>( defaultValue: T ): StackCursor<T> {
  return {
    current: defaultValue
  }
}

export function pop<T>( cursor: StackCursor<T>, fiber: Fiber ) {
  if ( index < 0 ) {
    return
  }

  cursor.current = valueStack[ index ]

  valueStack[ index ] = null

  index = index - 1
}