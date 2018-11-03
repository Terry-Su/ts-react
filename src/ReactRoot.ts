import { ReactNodeList, Batch, React$Component, Work, DOMContainer } from "./__typings__/index.spec"
import * as DOMRenderer from './ReactFiberReconciler'
import ReactWork from "./util/ReactWork"
import FiberRoot from "./ReactFiberRoot"

type __ReactRoot__ = {
  render: ( children: ReactNodeList, callback: Function ) => Work 
  unmount: ( callback: Function ) => Work
  createBatch(): Batch
  legacy_renderSubtreeIntoContainer: (
    parentComponent: React$Component,
    children: ReactNodeList,
    callback: Function
  ) => Work
  _internalRoot: FiberRoot
}


export default class ReactRoot {
  _internalRoot: any

  constructor( container: DOMContainer, isConcurrent: boolean, hydrate: boolean ) {
    const root = DOMRenderer.createContainer( container, isConcurrent, hydrate )
    this._internalRoot = root
  }

  legacy_renderSubtreeIntoContainer( parentComponent: React$Component, children: ReactNodeList ) {
    const { _internalRoot: root } = this
    DOMRenderer.updateContainer( children, root, parentComponent )
  }

  render( children: ReactNodeList ) {
    const { _internalRoot: root } = this
    const work = new ReactWork()

    DOMRenderer.updateContainer( children, root, null )
  }
}