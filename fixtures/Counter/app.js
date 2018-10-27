const { createElement: h } = React


class App extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    this.setState( { count: 1 } )
    setTimeout( this.setState( { count: 2 } ), 0 )
  }

  render() {
    // return <h1>Count: { this.state.count }</h1>
    return h( 'h1', null, [
      h( 'div', { class: 'test' } ),
      `Count: ${ this.state.count }`
    ] )
  }
}
ReactDOM.render(
  h( App ),
  document.getElementById( 'app' )
)