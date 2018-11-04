import { JSDOM } from "jsdom"

const { window } = new JSDOM()
const { document } = window
global[ 'window' ] = window
global[ 'document' ] = window

import ReactDOM from "../ReactDOM"
import h from "./__util__/index"



const container = document.createElement( "div" )
container.setAttribute( "id", "container" )
document.body.appendChild( container )

describe( "Test", () => {
  it( "", () => {
    const app = h( "div", null )
    const container = document.getElementById( "container" )
    ReactDOM.render( app, container )
  } )
} )
