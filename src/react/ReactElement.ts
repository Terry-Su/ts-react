import { Type } from "../__typings__/index"
import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols"
import { notNil } from "../util/lodash"

export class ReactElement {
  type: Type
  props: any
  children: any
  key: any

  // Identify this as a React Element
  $$typeof: any = REACT_ELEMENT_TYPE

  constructor( type: Type, config: any, children: any = null ) {
    this.type = type
    this.children = notNil( config.children ) ? config.children : children
    this.props = config
  }
}

export function createElement( type: Type, config: any = {}, children: any = null ) {
  return new ReactElement( type, config, children )
}