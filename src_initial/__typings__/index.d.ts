import { _INTERNAL_INSTANCE } from "../constant/name"
import ReactCompositeComponent from "../core/ReactCompositeComponent"
import ReactDOMComponent from "../renderer/ReactDOMComponent"

interface ModifiedNode extends HTMLElement {
  [ _INTERNAL_INSTANCE ] ?: ReactCompositeComponent | ReactDOMComponent
}