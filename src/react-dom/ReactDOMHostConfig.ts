import { Type, REACT_HTML_ELEMENT } from "../__typings__/index"
import { createElement } from "./ReactDOMComponent"
import { precacheFiberNode, updateFiberProps } from "./ReactDOMComponentTree"

export function createInstance( type: Type, props: any, rootContainerInstance: REACT_HTML_ELEMENT, internalInstanceHandle: any ) {
  var domElement = createElement( type, props, rootContainerInstance )
  precacheFiberNode( internalInstanceHandle, domElement )
  updateFiberProps( domElement, props )
  return domElement
}

