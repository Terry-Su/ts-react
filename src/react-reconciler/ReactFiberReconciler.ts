import { REACT_HTML_ELEMENT } from "../__typings__/index"
import FiberRoot, { createFiberRoot } from "./ReactFiberRoot"
import Fiber, { createWorkInProgress } from "./ReactFiber"
import { beginWork } from "./ReactFiberBeginWork"
import { createUpdate, enqueueUpdate } from "./ReactUpdateQueue"

export function createContainer( container: REACT_HTML_ELEMENT ) {
  return createFiberRoot( container )
}

export function updateContainer( element: any, root: FiberRoot ) {
  const { current } = root

  const update = createUpdate()
  update.payload = { element }

  enqueueUpdate( current, update )

  const nextUnitOfWork: Fiber = createWorkInProgress( current, null )
  beginWork( current, nextUnitOfWork )
}