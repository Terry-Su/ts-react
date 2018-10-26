
const { createElement: h } = React
class App extends React.Component {
  render() {
    return h( 'div', { class: 'test1' }, h( 'div', { class: 'test2' } ) )
  }
}

ReactDOM.render( h( App ), document.getElementById( "app" ) )


// class App extends React.Component {
//   constructor( props ) {
//     super( props )

//     this.state = {
//       count: 0
//     }
//   }

//   componentDidMount() {
//     this.setState( { count: 1 } )
//   }

//   render() {
//     return <h1>Count: { this.state.count }</h1>
//   }
// }
// ReactDOM.render(
//   <App />,
//   document.getElementById('container')
// );