

import ReactRoot from "./ReactRoot"
import { React$Element, DOMContainer, React$Component, ReactNodeList } from "./__typings__/index.spec"
import * as DOMRenderer from './ReactFiberReconciler'
import { unbatchedUpdates } from "./ReactFiberScheduler"
import { notNil, isNil } from "./util/js"
import { DOCUMENT_NODE, ELEMENT_NODE } from "./constant/HTMLNodeType"
import { ROOT_ATTRIBUTE_NAME } from "./module/DOMProperty"



const ReactDOM = {
  render( element: React$Element, container: DOMContainer ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      [ element ],
      container,
      false,
    )
  }
}


function legacyRenderSubtreeIntoContainer(
  parentComponent: React$Component,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydarate: boolean
) {
  const { _reactRootContainer: root } = container
  if ( !root ) {
    const isConcurrent = false
    const root = legacyCreateRootFromDOMContainer( container, forceHydarate )
    container._reactRootContainer = root


    unbatchedUpdates( () => {
      if ( notNil( parentComponent ) ) {
        root.legacy_renderSubtreeIntoContainer( parentComponent, children )
      }

      if ( isNil( parentComponent ) ) {
        root.render( children )
      }
    } )

  }

}


function legacyCreateRootFromDOMContainer( container: DOMContainer, forceHydrate: boolean ) {
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic( container )

  // First clear any existing content
  if ( ! shouldHydrate ) {
    while( container.lastChild ) {
      container.removeChild( container.lastChild )
    }
  }

  // Legacy roots are not async by default
  const isConcurrent = false
  return new ReactRoot( container, isConcurrent, shouldHydrate )
}


function getReactRootElementInContainer( container: any ) {
  if ( isNil( container ) ) {
    return null
  }

  if ( container.nodeType === DOCUMENT_NODE ) {
    return container.docuemntElement
  } else {
    return container.firstChild
  }
}

function shouldHydrateDueToLegacyHeuristic( container: DOMContainer ) {
  const rootElement = getReactRootElementInContainer( container )
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&
    rootElement.hasAttribute( ROOT_ATTRIBUTE_NAME )
  )
}





export default ReactDOM