import { DOM_TEXT_TYPE } from "../../constant/type"

export function getReactTextElement( text ) {
  return { type: DOM_TEXT_TYPE, props: { data: text } }
}