import { instantiateComponent } from "../util/core/index"
import { ReactElement } from "../__typings__/Core"
import { _INTERNAL_INSTANCE } from "../constant/name"
import { ModifiedNode } from "../__typings__/index"
import { notNil, isNil } from "../util/lodash"

export default class ReactDOM {
  static render( element: ReactElement, containerNode: HTMLElement ) {
    return mountTree( element, containerNode )
  }
}

export function mountTree( element: ReactElement, containerNode: HTMLElement ) {
  const { firstChild } = containerNode
  if ( notNil( firstChild ) ) {
    const { firstChild: prevNode } = containerNode
    const { [ _INTERNAL_INSTANCE ]: prevRootComponent } = <ModifiedNode>prevNode
    const { currentElement: prevElement } = prevRootComponent

    const { type } = element
    const { type: prevType } = prevElement
    if ( type === prevType ) {
      ( <any>prevRootComponent ).receive( element )
    }
    if ( type !== prevType ) {
      unmountTree( containerNode )
    }
  }

  if ( isNil( firstChild ) ) {
    const rootComponent = instantiateComponent( element )

    const node = rootComponent.mount()
    containerNode.appendChild( node )

    // Set internal instance to node
    node[ _INTERNAL_INSTANCE ] = rootComponent
  }
}

export function unmountTree( containerNode: HTMLElement ) {
  const { firstChild: node } = containerNode
  const { [ _INTERNAL_INSTANCE ]: rootComponent } = <ModifiedNode>node

  rootComponent.unmount()
  containerNode.innerHTML = ""
}
