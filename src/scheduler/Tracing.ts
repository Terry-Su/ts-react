let threadIDCounter: number = 0

export interface Interaction {
  __count: number
  id: number
  name: string
  timestamp: number
}

export function unstable_getThreadID(): number {
  const prevThreadIdCounter = threadIDCounter
  threadIDCounter = threadIDCounter + 1
  return prevThreadIdCounter
}