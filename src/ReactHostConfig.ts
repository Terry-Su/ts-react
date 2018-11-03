export function now() { return Date.now() }


type TimeoutID = number
export type TimeoutHandle = TimeoutID
export type NoTimeout = -1
export const noTimeout = -1