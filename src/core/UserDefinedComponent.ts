/**
 * User defined components:
 * 1. user-defined class
 * 2. user-defined function(type name: UserDefinedFuncComponent)
 */



import { CHILDREN } from "../constant/name";




export class UserDefinedClassComponent {
  props: UserDefinedComponentProps = {}
  constructor( props = {} ) {
    this.props = props
  }
  render() {}
}