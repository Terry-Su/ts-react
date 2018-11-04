import FiberRoot, { createFiberRoot } from "./ReactFiberRoot"
import { ReactNodeList, React$Component, DOMContainer, ExpirationTime } from "./__typings__/index.spec"
import { requestCurrentTime, computeExpirationForFiber, scheduleWork } from "./ReactFiberScheduler"
import { isNil, notNil } from "./util/js"
import { ClassComponent, HostRoot } from "./constant/ReactWorkTags"
import { emptyContextObject, isContextProvider as isLegacyContextProvider , findCurrentUnmaskedContext, processChildContext } from "./ReactFiberContext"
import * as ReactInstanceMap from './module/ReactInstanceMap'
import Fiber from "./ReactFiber"
import { createUpdate, enqueueUpdate } from "./ReactUpdateQueue"

type OpaqueRoot = FiberRoot

export function createContainer( 
  container: DOMContainer,
  isConcurrent: boolean,
  hydrate: boolean  
): OpaqueRoot {
  return createFiberRoot( container, isConcurrent, hydrate )  
}


export function updateContainer( elements: ReactNodeList, container: OpaqueRoot, parentComponent: React$Component ){
  const { current } = container
  const currentTime = requestCurrentTime()
  const expirationTime = computeExpirationForFiber( currentTime, current )
  return updateContainerAtExpirationTime(
    elements,
    container,
    parentComponent,
    expirationTime
  )
}


export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: React$Component,
  expirationTime: ExpirationTime
) {
  const { current } = container

  const context = getContextForSubtree( parentComponent )

  if ( isNil( container.context ) ) {
    container.context = context
  }
  if ( notNil( container.context ) ) {
    container.pendingContext = context
  }

  return scheduleRootUpdate( current, element, expirationTime )
}


function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime
) {
  const update = createUpdate( expirationTime )

  // Caution: React DevTools currently depends on this property
  // being called "element"
  update.payload = { element }

  enqueueUpdate( current, update )

  scheduleWork( current, expirationTime )
  return expirationTime
}



function getContextForSubtree( parentComponent: React$Component ) {
  if ( isNil( parentComponent ) ) {
    return emptyContextObject
  }

  const fiber = ReactInstanceMap.get( parentComponent )
  const parentContext = findCurrentUnmaskedContext( fiber )

  if ( fiber.tag === ClassComponent ) {
    const Component = fiber.type
    if ( isLegacyContextProvider( Component ) ) {
      return processChildContext( fiber, Component, parentContext )
    }
  }
}