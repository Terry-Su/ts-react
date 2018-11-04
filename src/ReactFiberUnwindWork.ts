import Fiber from "./ReactFiber"
import { ClassComponent, HostRoot, HostComponent, HostPortal, ContextProvider } from "./constant/ReactWorkTags"
import { notNil } from "./util/js"
import { 
  popContext as popLegacyContext,
  popTopLevelContextObject as popTopLevelLegacyContextObject
} from "./ReactFiberContext"
import { popHostContainer, popHostContext } from "./ReactFiberHostContext"
import { popProvider } from "./ReactFiberNewContext"

export function unwindInterruptedWork( interruptedWork: Fiber ) {
  switch( interruptedWork.tag ) {
    case ClassComponent: {
      const { childContextTypes } = interruptedWork.type
      if ( notNil( childContextTypes ) ) {
        popLegacyContext( interruptedWork )
      }
      break
    }
    case HostRoot: {
      popHostContainer( interruptedWork )
      popTopLevelLegacyContextObject( interruptedWork )
      break
    }
    case HostComponent: {
      popHostContext( interruptedWork )
      break
    }
    case HostPortal:
      popHostContainer( interruptedWork )
    case ContextProvider:
      popProvider( interruptedWork )
      break
    default:
      break
  }
}