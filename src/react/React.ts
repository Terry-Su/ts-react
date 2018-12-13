export abstract class Component {
  props: any

  isReactComponent: any

  constructor( props: any ) {
    this.props = props
  }

  abstract render(): any
}

Component.prototype.isReactComponent = {}

const React = {
  Component
}

export default React