import { Type, REACT_HTML_ELEMENT } from "../__typings__/index"
import { createElement } from "./ReactDOMComponent"
import { precacheFiberNode, updateFiberProps } from "./ReactDOMComponentTree"
import { COMMENT_NODE } from "../shared/HTMLNodeType"

export function createInstance( type: Type, props: any, rootContainerInstance: REACT_HTML_ELEMENT, internalInstanceHandle: any ) {
  var domElement = createElement( type, props, rootContainerInstance )
  precacheFiberNode( internalInstanceHandle, domElement )
  updateFiberProps( domElement, props )
  return domElement
}

let eventsEnabled
let selectionInformation


export function prepareForCommit( containerInfo: REACT_HTML_ELEMENT ) {
  // eventsEnabled = isEnabled();
  // selectionInformation = getSelectionInformation();
  // setEnabled(false);
}


export function appendChildToContainer( container, child ) {
  let parentNode
  if ( container.nodeType === COMMENT_NODE ) {
    parentNode = container.parentNode
    parentNode.insertBefore( child, container )
  } else {
    parentNode = container
    parentNode.appendChild( child )
  }
}