import isString = require("lodash/isString");
import isPlainObject = require("lodash/isPlainObject");

export const equalJsonString = (a, b) => {
  a = isString( a ) ? a : JSON.stringify( a )
  b = isString( b ) ? b: JSON.stringify( b )
  return a === b
}  