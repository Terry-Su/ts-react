import { notNil } from "../../util/js"

export default function h( type: any, props: any = {}, children?: any[] ) {
  props = notNil( props ) ? props : {}
  children = notNil( children ) ? children : []
  children = notNil( props.children ) ? props.children : children
  
  return {
    type,
    props: {
      ...props,
      ...children
    }
  }
}