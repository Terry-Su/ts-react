export function isClass( v ) {
  return typeof v === 'function' && /^class .*/.test( v.toString() )
}

export function isFunctionNotClass( v ) {
  return typeof v === 'function' && ! /^class .*/.test( v.toString() )
}

export const foundIndex = ( index: number ) => index !== -1

export const notFoundIndex = ( index: number ) => foundIndex( index )