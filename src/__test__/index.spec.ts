import { JSDOM } from 'jsdom'
import ReactDOM from '../react-dom/ReactDOM'
import { createElement as h } from '../react/ReactElement'
import React from '../react/React'

function getWindow() {
  const dom = new JSDOM( `` )
  return dom.window
}

describe( 'Test', () => {
  it( 'test', () => {
    const { document } = getWindow()
    global[ 'document' ] = document
    const container = document.createElement( 'div' )

    class App extends React.Component {
      state = {
        count: 1
      }

      componentDidMount() {
        this.setState( {
          count: 2
        } )
      }

      render() {
        return h( 'h1', {
          children: [ `Count:`, this.state.count ]
        } )
      }
    }

    ReactDOM.render( h( App, {
      style: "background: blue;"
    } ), container )
  } )
} )