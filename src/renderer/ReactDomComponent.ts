import { ReactDOMElement } from "../__typings__/Core"
import { CHILDREN } from "../constant/name"
import { instantiateComponent } from "../util/core/index"
import { ModifiedNode } from "../__typings__/index"
import { notNil, isArray, isNil, isString } from "../util/lodash"
import { DOM_OPERATION_QUEUE_TYPES, DOM_TEXT_TYPE } from "../constant/type"

export default class ReactDOMComponent {
  currentElement: ReactDOMElement

  // children components
  renderedChildren = []

  node: ModifiedNode

  constructor( element: ReactDOMElement ) {
    this.currentElement = element
  }

  getPublicInstance() {
    // For DOM components, only expose the DOM node
    return this.node
  }

  getHostNode() {
    return this.node
  }

  mount(): ModifiedNode {
    const { currentElement: element } = this
    const { type, props } = element
    let { children = [] } = props

    children = isArray( children ) ? children : [ children ]

    // Create and save node
    const node = type !== DOM_TEXT_TYPE ? <ModifiedNode>document.createElement( type ) : document.createTextNode( props.$value )
    this.node = node

    // Set attribtues to node
    if ( type !== DOM_TEXT_TYPE ) {
      for ( let key in props ) {
        if ( key !== CHILDREN ) {
          node.setAttribute( key, props[ key ] )
        }
      }
    }
    

    const renderedChildren = children.map( child => {
      child =  ! isString( child ) ? child : { type: DOM_TEXT_TYPE, props: { $value: child } }
      return instantiateComponent( child )
    } )
    this.renderedChildren = renderedChildren

    const childNodes = renderedChildren.map( child => child.mount() )
    childNodes.forEach( childNode => node.appendChild( childNode ) )

    return node
  }

  unmount() {
    const { renderedChildren } = this
    renderedChildren.forEach( child => child.unmount() )
  }

  receive( nextElement: ReactDOMElement ) {
    const { node, currentElement: prevElement } = this
    const { props: prevProps } = prevElement
    const { props: nextProps } = nextElement

    this.currentElement = nextElement

    // Remove old attributes
    for ( let key in prevProps ) {
      if ( key !== CHILDREN && !( <Object>prevProps ).hasOwnProperty( key ) ) {
        node.removeAttribute( key )
      }
    }

    // Set next attribtues
    for ( let key in nextProps ) {
      if ( key !== CHILDREN ) {
        const value = nextProps[ key ]
        node.setAttribute( key, value )
      }
    }

    // update the children of host components(DOM elements)
    let { children: prevChildren = [] } = prevProps
    prevChildren = isArray( prevChildren ) ? prevChildren : [ prevChildren ]

    let { children: nextChildren = [] } = nextProps
    nextChildren = isArray( nextChildren ) ? nextChildren : [ nextChildren ]

    const { renderedChildren: prevRenderedChildren } = this
    let nextRenderedChildren = []

    // Add DOM operations
    const operationQueue = []

    // The following is extremely simplified
    for ( let i = 0; i < nextChildren.length; i++ ) {
      const prevChild = prevRenderedChildren[ i ]

      if ( isNil( prevChild ) ) {
        const nextChild = instantiateComponent( nextChildren[ i ] )
        const node = nextChild.mount()

        nextRenderedChildren.push( nextChild )

        // Record that the node should be added
        operationQueue.push( { type: DOM_OPERATION_QUEUE_TYPES.ADD, node } )
      }

      if ( notNil( prevChild ) ) {
        const canUpdate = prevChildren[ i ].type === nextChildren[ i ].type
        if ( !canUpdate ) {
          const prevNode = prevChild.getHostNode()
          prevChild.unmount()

          const nextChild = instantiateComponent( nextChildren[ i ] )
          const nextNode = nextChild.getHostNode()

          nextRenderedChildren.push( nextChild )

          // Record that the nodes should be swapped
          operationQueue.push( {
            type: DOM_OPERATION_QUEUE_TYPES.REPLACE,
            prevNode,
            nextNode
          } )
        }

        if ( canUpdate ) {
          prevChild.receive( nextChildren[ i ] )
          nextRenderedChildren.push( prevChild )
        }
      }
    }

    // Unmont the children that don't exist
    for ( let i = nextChildren.length, j = prevChildren.length; i < j; i++ ) {
      const prevChild = prevRenderedChildren[ i ]
      const node = prevChild.getHostNode()

      // Record that the node should be removed
      operationQueue.push( { type: DOM_OPERATION_QUEUE_TYPES.REMOVE, node } )
    }

    this.renderedChildren = nextRenderedChildren

    // Execute the DOM operations
    operationQueue.forEach( ( { node, prevNode, nextNode, type } ) => {
      const { ADD, REPLACE, REMOVE } = DOM_OPERATION_QUEUE_TYPES
      switch( type ) {
        case ADD: 
          this.node.appendChild( node )
          break
        case REPLACE:
          this.node.replaceChild( nextNode, prevNode )
          break
        case REMOVE:
          this.node.removeChild( node )
          break
      }
    } )
  }
}
