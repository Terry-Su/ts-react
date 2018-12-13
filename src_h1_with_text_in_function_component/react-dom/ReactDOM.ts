import { REACT_HTML_ELEMENT } from "../__typings__/index"
import { isNil } from "../util/lodash"
import FiberRoot from "../react-reconciler/ReactFiberRoot"
import { createContainer, updateContainer } from "../react-reconciler/ReactFiberReconciler"
import { setHostContainer } from "../tmp/hostContainer"


export class ReactRoot {
  _internalRoot: FiberRoot
  constructor( containerInfo: REACT_HTML_ELEMENT ) {
    this._internalRoot = createContainer( containerInfo )
  }

  render( element: any ) {
    updateContainer( element, this._internalRoot )
  }

  unmount() {

  }
}


const ReactDOM = {
  render( element: any, containerInfo: REACT_HTML_ELEMENT ) {

    // tmp
    setHostContainer( containerInfo )

    if ( isNil( containerInfo._reactRootContainer ) ) {
      containerInfo._reactRootContainer = new ReactRoot( containerInfo )
    }

    containerInfo._reactRootContainer.render( element )
  }
}

export default ReactDOM