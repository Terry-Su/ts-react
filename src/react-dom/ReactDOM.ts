import { REACT_HTML_ELEMENT } from "../__typings__/index"
import { isNil } from "../util/lodash"
import FiberRoot from "../react-reconciler/ReactFiberRoot"
import { createContainer, updateContainer } from "../react-reconciler/ReactFiberReconciler"


export class ReactRoot {
  _internalRoot: FiberRoot
  constructor( container: REACT_HTML_ELEMENT ) {
    this._internalRoot = createContainer( container )
  }

  render( element: any ) {
    updateContainer( element, this._internalRoot )
  }

  unmount() {

  }
}


const ReactDOM = {
  render( element: any, container: REACT_HTML_ELEMENT ) {
    if ( isNil( container._reactRootContainer ) ) {
      container._reactRootContainer = new ReactRoot( container )
    }

    container._reactRootContainer.render( element )
  }
}

export default ReactDOM