/**
 * User defined components:
 * 1. user-defined class
 * 2. user-defined function(type name: ReactUserDefinedFuncComponent)
 */



import { CHILDREN } from "../constant/name"
import { ReactUserDefinedComponentProps, ReactElement } from "../__typings__/Core"




export default class ReactUserDefinedClassComponent {
  props: ReactUserDefinedComponentProps = {}

  constructor( props = {} ) {
    this.props = props
  }
  render(): ReactElement {
    return
  }
}