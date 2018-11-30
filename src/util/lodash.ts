// import isNil from "lodash/isNil"
// import isUndefined from "lodash/isUndefined"
// import isNull from "lodash/isNull"
// import isUndefined from "lodash/isUndefined"
// import isArray from "lodash/isArray"
// import isObject from "lodash/isObject"
// import cloneDeep from "lodash/cloneDeep"
// import includes from "lodash/includes"
// import uniq from "lodash/uniq"
// import uniqWith from "lodash/uniqWith"
// import intersection from "lodash/intersection"
// import mapValues from "lodash/mapValues"
// import values from "lodash/values"
// import isPlainObject from "lodash/isPlainObject"
import isNumber from "lodash/isNumber"
// import isBoolean from "lodash/isBoolean"
// import isString from "lodash/isString"
// import isDate from "lodash/isDate"
// import find from "lodash/find"
// import isFunction from "lodash/isFunction"

export const isNil = value => value == null
export const notNil = value => !isNil( value )
export const isArray = Array.isArray



export const isString = ( value ) => typeof value === 'string'  
export const isFunction = ( value ) => typeof value === 'function'  


export {
  isNumber
}

