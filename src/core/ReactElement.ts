import {
  ReactElementType,
  ReactUserDefinedComponentProps,
  ReactElementChildren,
  ReactElement
} from "../__typings__/Core"
import { notNil } from "../util/lodash"

export function createElement(
  type: ReactElementType,
  props: ReactUserDefinedComponentProps,
  children: ReactElementChildren
): ReactElement {
  props = notNil( props ) ? props : {}
  if ( notNil( children ) ) {
    props.children = children
  }
  return {
    type,
    props
  }
}
