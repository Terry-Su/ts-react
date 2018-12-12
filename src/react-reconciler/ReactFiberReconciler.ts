import { REACT_HTML_ELEMENT } from "../__typings__/index"
import FiberRoot, { createFiberRoot } from "./ReactFiberRoot"
import Fiber, { createWorkInProgress } from "./ReactFiber"
import { createUpdate, enqueueUpdate } from "./ReactUpdateQueue"
import { scheduleWork } from "./ReactFiberScheduler"

export function createContainer( container: REACT_HTML_ELEMENT ) {
  return createFiberRoot( container )
}


export function scheduleRootUpdate( current: Fiber, element: any ) {
  const update = createUpdate()
  update.payload = { element }

  enqueueUpdate( current, update )

  scheduleWork( current )
}

export function updateContainerAtExpirationTime( element: any, root: FiberRoot ) {
  const { current } = root
  return scheduleRootUpdate( current, element )
}

export function updateContainer( element: any, root: FiberRoot ) {
  updateContainerAtExpirationTime( element, root )
} 