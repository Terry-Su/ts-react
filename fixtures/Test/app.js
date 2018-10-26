
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
