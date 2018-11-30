import Fiber, { createFiberFromElement } from "./ReactFiber"
import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols"
import { ReactElement } from "../react/ReactElement"
import { isNil, isString, isNumber } from "../util/lodash"
import { Placement } from "../shared/ReactSideEffectTags"



function ChildReconciler( shouldTrackSideEffects: boolean ) {

  function placeSingleChild( newFiber: Fiber ) {
    if ( shouldTrackSideEffects && isNil( newFiber.alternate ) ) {
      newFiber.effectTag = Placement
    }
    return newFiber
  }
    

  function reconcileSingleElement( returnFiber: Fiber, currentFirstChild: Fiber, element: ReactElement ) {
    const { key } = element
    const child = currentFirstChild

    const created = createFiberFromElement( element )
    created.return = returnFiber
    return created
  }

  // This function is not recursive
  function reconcileChildFibers( returnFiber: Fiber, currentFirstChild: Fiber, newChild: any ) {
    const isObject = typeof newChild === 'object' && newChild !== null

    if ( isObject ) {
      switch ( newChild.$$typeof ) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild
            )
          )
      }
    }
  }
  return reconcileChildFibers
}

export const reconcileChildFibers: Function = ChildReconciler( true )