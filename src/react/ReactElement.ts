import { Type } from "../__typings__/index"

export class ReactElement {
  type: Type
  props: any

  constructor( type: Type, props: any ) {
    this.type = type
    this.props = props
  }
}

export function createElement( type: Type, props: any ) {
  return new ReactElement( type, props )
}