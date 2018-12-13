import { REACT_HTML_ELEMENT } from "../__typings__/index"

let container: REACT_HTML_ELEMENT

export function setHostContainer( theContainer: REACT_HTML_ELEMENT ) {
  container = theContainer
}

export function getHostContainer() {
  return container
}