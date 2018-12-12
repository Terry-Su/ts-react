import Fiber, { createHostRootFiber } from "./ReactFiber"
import { REACT_HTML_ELEMENT } from "../__typings__/index"

class FiberRoot {
  current: Fiber
  containerInfo: REACT_HTML_ELEMENT

  nextScheduledRoot: FiberRoot

  finishedWork: Fiber

  constructor( containerInfo: REACT_HTML_ELEMENT ) {
    const uninitializedFiber: Fiber = createHostRootFiber()
    this.containerInfo = containerInfo
    this.current = uninitializedFiber
    
    uninitializedFiber.stateNode = this
  }
}


export function createFiberRoot( containerInfo: REACT_HTML_ELEMENT ) {
  return new FiberRoot( containerInfo )
}

export default FiberRoot