import { _INTERNAL_INSTANCE } from "../constant/name";
import ReactCompositeComponent from "../core/ReactCompositeComponent";
import ReactDomComponent from "../renderer/ReactDomComponent";

interface ModifiedNode extends HTMLElement {
  [ _INTERNAL_INSTANCE ] ?: ReactCompositeComponent | ReactDomComponent
}