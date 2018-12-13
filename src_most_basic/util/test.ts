import { isString } from "./lodash"

// import isString = require( "lodash/isString" );

// function isString( value ) {
//   return typeof value === 'string' 
// }

export const equalJsonString = ( a, b ) => {
  a = isString( a ) ? a : JSON.stringify( a )
  b = isString( b ) ? b : JSON.stringify( b )
  return a === b
}  