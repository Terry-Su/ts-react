import ReactUserDefinedClassComponent from "./ReactUserDefinedClassComponent"
import {
  ReactElementType,
  ReactElement,
  ReactUserDefinedComponentProps,
  ReactElementChildren
} from "../__typings__/Core"
import { notNil } from "../util/lodash"
import { createElement } from "./ReactElement"

export default class React {
  static Component = ReactUserDefinedClassComponent
  static createElement = createElement
}
