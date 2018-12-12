import Fiber, { createFiberFromElement } from "./ReactFiber"
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "../shared/ReactSymbols"
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

    if ( element.type === REACT_FRAGMENT_TYPE ) {

    } else {
      const created = createFiberFromElement( element )
    created.return = returnFiber
    return created
    }
    
  }


  function deleteRemainingChildren( returnFiber, currentFirstChild ) {
    if ( ! shouldTrackSideEffects ) {
      // Noop
      return null
    }
  }

  // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.
  //
  // This function is not recursive
  //
  // If the top level item is an array, we treat it as a set of children,
  // not as a fragment. Nested arrays on the other hand will be treated as
  // fragment nodes. Recursion happens at the normal flow.
  function reconcileChildFibers( returnFiber: Fiber, currentFirstChild: Fiber, newChild: any ) {
    const isObject = typeof newChild === 'object' && newChild !== null
    const isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null


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
    
    // Remaining cases are all treated as empty.
    return deleteRemainingChildren( returnFiber, currentFirstChild )
  }
  return reconcileChildFibers
}

export const reconcileChildFibers: Function = ChildReconciler( true )
export const mountChildFibers: Function = ChildReconciler( false )