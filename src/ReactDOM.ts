

import ReactRoot from "./ReactRoot"
import { React$Element, DOMContainer, React$Component, ReactNodeList } from "./__typings__/index.spec"
import * as DOMRenderer from './ReactFiberReconciler'
import { unbatchedUpdates } from "./ReactFiberScheduler"
import { notNil, isNil } from "./util/js"



const ReactDOM = {
  render( element: React$Element, container: DOMContainer ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      [ element ],
      container
    )
  }
}


function legacyRenderSubtreeIntoContainer(
  parentComponent: React$Component,
  children: ReactNodeList,
  container: DOMContainer,
) {
  const { _reactRootContainer } = container
  if ( !_reactRootContainer ) {
    const root = new ReactRoot( container )
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

export default ReactDOM