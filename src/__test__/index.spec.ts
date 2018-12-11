import { JSDOM } from 'jsdom'
import ReactDOM from '../react-dom/ReactDOM'
import { createElement as h } from '../react/ReactElement'

function getWindow() {
  const dom = new JSDOM( `` )
  return dom.window
}

describe( 'Test', () => {
  it( 'test', () => {
    const { document } = getWindow()
    const container = document.createElement( 'div' )
    ReactDOM.render( h( 'h1', {
      style: "background: blue;"
    } ), container )
  } )
} )