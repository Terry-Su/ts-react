import ReactUserDefinedClassComponent from "./ReactUserDefinedClassComponent"
import ReactDOMComponent from "../renderer/ReactDOMComponent"
import { isClass, isFunctionNotClass } from "../util/js"
import { ReactUserDefinedElement, ReactElement, ReactUserDefinedClassComponentClassType, ReactUserDefinedFuncComponent, ReactDOMElement } from "../__typings__/Core"
import { instantiateComponent } from "../util/core/index"
import { ModifiedNode } from "../__typings__/index"

export default class ReactCompositeComponent {
  // The instance of the use-defined class component
  publicInstance: ReactUserDefinedClassComponent

  currentElement: ReactUserDefinedElement

  // Child component
  renderedComponent: ReactCompositeComponent | ReactDOMComponent

  constructor( element: ReactUserDefinedElement ) {
    this.currentElement = element  
  }

  getPublicInstance() {
    return this.publicInstance
  }

  getHostNode(): ModifiedNode {
    return this.renderedComponent.getHostNode()
  }

  mount(): ModifiedNode {
    const { currentElement: element } = this
    const { type, props } = element
    let publicInstance: ReactUserDefinedClassComponent
    let renderedElement: ReactElement

    if ( isClass( type ) ) {
      publicInstance = new ( <ReactUserDefinedClassComponentClassType>type )( props )
      publicInstance._reactCompositeComponent = this
      renderedElement = publicInstance.render()
    }

    if ( isFunctionNotClass( type ) ) {
      publicInstance = null
      renderedElement = ( <ReactUserDefinedFuncComponent>type )( props )
    }

    this.publicInstance = publicInstance

    // Instantiate children element
    const renderedComponent = instantiateComponent( renderedElement )
    this.renderedComponent = renderedComponent

    const node = renderedComponent.mount()
    
    if ( isClass( type ) && ! publicInstance.isMounted ) {
      publicInstance.isMounted = true
      publicInstance.componentDidMount()
    }
    return node
  }

  unmount() {
    const { renderedComponent } = this
    renderedComponent.unmount()
  }

  receive( nextElement: ReactUserDefinedElement ) {
    const {
      publicInstance,
      renderedComponent: prevRenderedComponent
    } = this
    const { props: prevProps } = this.currentElement
    const { currentElement: prevRenderedElement } = prevRenderedComponent

    // update own element
    this.currentElement = nextElement

    const { type, props: nextProps } = nextElement
    let nextRenderedElement: ReactElement

    if ( isClass( type ) ) {
      publicInstance.props = nextProps
      nextRenderedElement = publicInstance.render()
    }

    if ( isFunctionNotClass( type ) ) {
      nextRenderedElement = ( <ReactUserDefinedFuncComponent>type )( nextProps )
    }

    
    const { type: prevRenderedType } = prevRenderedElement
    const { type: nextRenderedType } = nextRenderedElement

    if ( prevRenderedType === nextRenderedType ) {
      ( <any>prevRenderedComponent ).receive( nextRenderedElement )
      return
    }

    if ( prevRenderedType !== nextRenderedType ) {
      const prevNode = prevRenderedComponent.getHostNode()

      prevRenderedComponent.unmount()

      const nextRenderedComponent = instantiateComponent( nextRenderedElement )
      this.renderedComponent = nextRenderedComponent

      const nextNode = nextRenderedComponent.mount()
      prevNode.parentNode.replaceChild( nextNode, prevNode )
    }

  }

  refresh() {
    // this.receive( <any>( <any>( this.renderedComponent ).currentElement ) )
    // console.log( this.currentElement )
    this.receive( this.currentElement )
  }
}