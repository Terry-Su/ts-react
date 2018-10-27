const { createElement: h, Component } = React

class App extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      count     : 0,
      showingBox: true
    }
  }

  componentDidMount() {
    setInterval( () => {
      this.setState( { 
        count     : ++this.state.count,
        showingBox: ! this.state.showingBox
       } )

    }, 1000 )
  }

  render() {
    // return <h1>Count: { this.state.count }</h1>
    return h(
      Container,
      null,
      [
        h( "h1", null, [ h( "div", { class: "test" } ), `Count: ${this.state.count}` ] ),
        this.state.showingBox ? h( Box ) : h( 'span' )
      ]
    )
  }
}

class Container extends Component {
  render() {
    return h(
      "div",
      {
        style: `
      display: grid;
      place-items: center;
      width:300p; 
      height: 300px;
      background: deepskyblue;
      color: white;
      `
      },
      this.props.children
    )
  }
}

class Box extends Component {
  render() {
    return h( 'div', {
      style: `
      width: 100px;
      height: 100px;
      background: red;
      `
    } )
  }
}

ReactDOM.render( h( App ), document.getElementById( "app" ) )
