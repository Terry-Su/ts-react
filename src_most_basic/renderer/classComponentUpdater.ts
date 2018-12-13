import ReactUserDefinedClassComponent from "../core/ReactUserDefinedClassComponent"
import { ReactState } from "../__typings__/Core"

const classComponentUpdater = {
  isMounted( component ) {

  },

  enqueueSetState( component: ReactUserDefinedClassComponent, partialState: ReactState ) {
    let { state = {} } = component
    state = {
      ...state,
      ...partialState
    }
    component.state = state
    
    const { _reactCompositeComponent: compositeComponent  } = component

    compositeComponent.refresh()
  },


}

export default classComponentUpdater