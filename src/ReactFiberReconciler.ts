import FiberRoot, { createFiberRoot } from "./ReactFiberRoot"
import { ReactNodeList, React$Component, DOMContainer } from "./__typings__/index.spec"
import { requestCurrentTime, computeExpirationForFiber } from "./ReactFiberScheduler"

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
  // return updateContainerAtExpirationTime(
  //   elements,
  //   container,
  //   parentComponent,
  //   expirationTime
  // )
}
