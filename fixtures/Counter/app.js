
const { createElement: h } = React
class App1 extends React.Component {
  render() {
    return h( 'div', { class: 'test1' }, h( 'div', { class: 'test2' } ) )
  }
}

class App2 extends React.Component {
  render() {
    return h( 'div', { class: 'test3' }, h( 'div', { class: 'test4' } ) )
  }
}


ReactDOM.render( h( App1 ), document.getElementById( "app" ) )
ReactDOM.render( h( App2 ), document.getElementById( "app" ) )


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