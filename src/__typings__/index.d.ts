import FiberRoot from "../react-reconciler/ReactFiberRoot"
import { ReactRoot } from "../react-dom/ReactDOM"

export type Type = string | Function

export interface REACT_HTML_ELEMENT extends HTMLElement {
  _reactRootContainer?: ReactRoot
}