import { Type, REACT_HTML_ELEMENT } from "../__typings__/index"
import { stringify } from "querystring"
import setTextContent from "./setTextContent"

const CHILDREN = 'children'

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


export function setInitialDOMProperties( tag: string, domElement: REACT_HTML_ELEMENT, rootContainerElement: REACT_HTML_ELEMENT, nextProps: any ) {
  for ( let propKey in nextProps ) {
    const nextProp = nextProps[ propKey ]

    if ( propKey === CHILDREN ){
      if ( typeof nextProp === 'string' ) {
        const canSetTextContent = tag !== 'textarea' || nextProp !== ''
        if ( canSetTextContent ) {
          setTextContent( domElement, nextProp )
        }
      }
    }
  }
}


export function setInitialProperties( domElement: REACT_HTML_ELEMENT, tag: string, rawProps: any, rootContainerElement: REACT_HTML_ELEMENT ) {
  let props = rawProps

  setInitialDOMProperties( tag, domElement, rootContainerElement, props )
}