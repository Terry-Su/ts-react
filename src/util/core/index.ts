import ReactCompositeComponent from "../../core/ReactCompositeComponent"
import ReactDOMComponent from "../../renderer/ReactDOMComponent"
import { isClass, isFunctionNotClass } from "../js"
import { ReactElement, ReactUserDefinedElement, ReactDOMElement } from "../../__typings__/Core"
import { isString } from "../lodash"
import { getReactTextElement } from "../renderer/index"

export function instantiateComponent( element: ReactElement ) : ReactCompositeComponent | ReactDOMComponent {

  if ( isString( element ) ) {
    element = getReactTextElement( element )
  }
  
  const { type } = element

  // For a user-defiend component(a class or a function)
  if ( isClass ( type ) || isFunctionNotClass( type ) ) {
    return new ReactCompositeComponent( <ReactUserDefinedElement>element )
  }

  // For a DOM component
  if ( isString( type ) ) {
    return new ReactDOMComponent( <ReactDOMElement>element )
  }
}