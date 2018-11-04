export function now() { return Date.now() }


type TimeoutID = number
export type TimeoutHandle = TimeoutID
export type NoTimeout = -1
export const noTimeout = -1


type HostContextDev = {
  namespace: string,
  ancestorInfo: any
}
type HostContextProd = string
export type HostContext = HostContextDev | HostContextProd


export type Container = Element | Document

export const isPrimaryRenderer = true