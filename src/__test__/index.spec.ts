import { CLASS } from "../constant/name"
import React from "../core/React"
import { equalJsonString } from "../util/test"

describe( "Core", () => {
  it( "User-defined class", () => {
    class App extends React.Component {
      render(): any {
        return {
          type     : "div",
          [ CLASS ]: this.props[ CLASS ]
        }
      }
    }

    const app = new App( { [ CLASS ]: "app" } )
    const renderedElement = app.render()
    expect(
      equalJsonString( renderedElement, { type: "div", class: "app" } )
    ).toBe( true )
  } )

  it( "User-defined function", () => {
    function App( props ) {
      return {
        type     : "div",
        [ CLASS ]: props[ CLASS ]
      }
    }

    const renderedElement = App( { [ CLASS ]: "app" } )
    expect(
      equalJsonString( renderedElement, { type: "div", class: "app" } )
    ).toBe( true )
  } )
} )
