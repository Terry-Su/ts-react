import ReactCompositeComponent from "../../core/ReactCompositeComponent";
import ReactDomComponent from "../../renderer/ReactDomComponent";
import isString = require("lodash/isString");
import { isClass, isFunctionNotClass } from "../js";
import { ReactElement, ReactUserDefinedElement, ReactDomElement } from "../../__typings__/Core";

export function instantiateComponent( element: ReactElement ) : ReactCompositeComponent | ReactDomComponent {
  const { type } = element

  // For a user-defiend component(a class or a function)
  if ( isClass ( type ) || isFunctionNotClass( type ) ) {
    return new ReactCompositeComponent( <ReactUserDefinedElement>element )
  }

  // For a DOM component
  if ( isString( type ) ) {
    return new ReactDomComponent( <ReactDomElement>element )
  }
}