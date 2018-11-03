import { ReactContext } from "./__typings__/ReactTypes"

export type ContextDependency<T> = {
  context: ReactContext<T>
  observedBits: number
  next: ContextDependency<any>
}