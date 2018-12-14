export type SideEffectTag = number

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = 0b00000000000
export const PerformedWork = 0b00000000001


// You can change the rest (and add more).
export const Placement = 0b00000000010
export const Update = 0b00000000100
export const PlacementAndUpdate = 0b00000000110
export const Deletion = 0b00000001000
export const ContentReset = 0b00000010000
export const Callback = 0b00000100000


export const Incomplete = 0b01000000000

