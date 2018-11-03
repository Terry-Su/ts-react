import { notNil } from "../util/js"

export const isDevToolsPresent = notNil(
  window[ "__REACT_DEVTOOLS_GLOBAL_HOOK__" ]
)
