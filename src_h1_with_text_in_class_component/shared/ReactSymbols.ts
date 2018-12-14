// The Symbol used to tag the ReactElement-like types. 

const hasSymbol = typeof Symbol === 'function' && Symbol.for

export const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for( 'react.element' ) : 0xeac7
export const REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for( 'react.fragment' ) : 0xeacb
