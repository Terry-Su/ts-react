import { Type, REACT_HTML_ELEMENT } from "../__typings__/index"

export function createElement( type: Type, props: any, rootContainerElement: REACT_HTML_ELEMENT ) {
  let domElement
  const ownerDocument = document
  if ( type === 'script' ) {

  } else if ( typeof props.is === 'string' ) {

  } else {
    domElement = ownerDocument.createElement( <string>type )
  }
  return domElement
}

