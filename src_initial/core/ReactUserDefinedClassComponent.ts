/**
 * User defined components:
 * 1. user-defined class
 * 2. user-defined function(type name: ReactUserDefinedFuncComponent)
 */



import { CHILDREN } from "../constant/name"
import { ReactUserDefinedComponentProps, ReactElement, ReactState } from "../__typings__/Core"
import classComponentUpdater from "../renderer/ClassComponentUpdater"




export default class ReactUserDefinedClassComponent {
  props: ReactUserDefinedComponentProps = {}


  updater = classComponentUpdater

  state: ReactState

  isMounted: boolean = false

  _reactCompositeComponent

  constructor( props = {} ) {
    this.props = props
  }

  render(): ReactElement {
    return
  }

  setState( partialState: ReactState ) {
    this.updater.enqueueSetState( this, partialState )
  }

  componentDidMount() {

  }
}