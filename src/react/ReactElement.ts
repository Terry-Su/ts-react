import { Type } from "../__typings__/index"
import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols"

export class ReactElement {
  type: Type
  props: any
  key: any

  // Identify this as a React Element
  $$typeof: any = REACT_ELEMENT_TYPE

  constructor( type: Type, props: any ) {
    this.type = type
    this.props = props
  }
}

export function createElement( type: Type, props: any ) {
  return new ReactElement( type, props )
}