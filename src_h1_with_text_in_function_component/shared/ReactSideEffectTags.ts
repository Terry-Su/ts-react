export type SideEffectTag = number

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = 0
export const PerformedWork = 1


// You can change the rest (and add more).
export const Placement = 2
export const Update = 4
export const Deletion = 8
export const ContentReset = 16

export const Incomplete = 512

