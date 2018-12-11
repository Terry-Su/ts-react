import Fiber, { createHostRootFiber } from "./ReactFiber"
import { REACT_HTML_ELEMENT } from "../__typings__/index"

class FiberRoot {
  current: Fiber
  container: REACT_HTML_ELEMENT

  nextScheduledRoot: FiberRoot

  constructor( container: REACT_HTML_ELEMENT ) {
    const uninitializedFiber: Fiber = createHostRootFiber()
    this.container = container
    this.current = uninitializedFiber
    
    uninitializedFiber.stateNode = this
  }
}


export function createFiberRoot( container: REACT_HTML_ELEMENT ) {
  return new FiberRoot( container )
}

export default FiberRoot