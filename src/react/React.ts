import ReactNoopUpdateQueue from "./ReactNoopUpdateQueue"

export abstract class Component {
  props

  updater

  isReactComponent

  state

  constructor( props: any, updater ) {
    this.props = props
    this.updater = updater || ReactNoopUpdateQueue
  }

  setState = ( partialState: any, callback?: Function ) => {
    this.updater.enqueueSetState( this, partialState, callback, 'setState' )
  }

  abstract render()

  componentDidMount () {
    
  }

  
}

Component.prototype.isReactComponent = {}

const React = {
  Component
}

export default React