import { Type, REACT_HTML_ELEMENT } from "../__typings__/index"
import { createElement, setInitialProperties } from "./ReactDOMComponent"
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


export function shouldSetTextContent( type, props ) {
  return type === 'textarea' || type === 'option' || type === 'noscript' || typeof props.children === 'string' || typeof props.children === 'number' || typeof props.dangerouslySetInnerHTML === 'object' && props.dangerouslySetInnerHTML !== null && props.dangerouslySetInnerHTML.__html != null
}

export function shouldAutoFocusHostComponent( type, props ) {
  switch ( type ) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus
  }
  return false
}

export function finalizeInitialChildren( domElement: REACT_HTML_ELEMENT, type: string, props: any, rootContainerInstance: REACT_HTML_ELEMENT ) {
  setInitialProperties( domElement, type, props, rootContainerInstance )
  return shouldAutoFocusHostComponent( type, props )
}