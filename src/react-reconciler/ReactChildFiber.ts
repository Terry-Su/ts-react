import Fiber, { createFiberFromElement, createFiberFromText, createWorkInProgress } from "./ReactFiber"
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "../shared/ReactSymbols"
import { ReactElement } from "../react/ReactElement"
import { isNil, isString, isNumber, isArray } from "../util/lodash"
import { Placement, Deletion } from "../shared/ReactSideEffectTags"
import { HostText } from "../shared/ReactWorkTags"



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

  function deleteChild( returnFiber, childToDelete ) {
    if ( !shouldTrackSideEffects ) {
      // Noop.
      return
    }
    // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.
    var last = returnFiber.lastEffect
    if ( last !== null ) {
      last.nextEffect = childToDelete
      returnFiber.lastEffect = childToDelete
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete
    }
    childToDelete.nextEffect = null
    childToDelete.effectTag = Deletion
  }

  function deleteRemainingChildren( returnFiber, currentFirstChild ) {
    if ( ! shouldTrackSideEffects ) {
      // Noop
      return null
    }
    // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.
    var childToDelete = currentFirstChild
    while ( childToDelete !== null ) {
      deleteChild( returnFiber, childToDelete )
      childToDelete = childToDelete.sibling
    }
    return null
  }

  function useFiber( fiber, pendingProps ) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    var clone = createWorkInProgress( fiber, pendingProps )
    clone.index = 0
    clone.sibling = null
    return clone
  }

  function reconcileSingleTextNode( returnFiber: Fiber, currentFirstChild: Fiber, textContent: string ) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if ( currentFirstChild !== null && currentFirstChild.tag === HostText ) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren( returnFiber, currentFirstChild.sibling )
      var existing = useFiber( currentFirstChild, textContent  )
      existing.return = returnFiber
      return existing
    }
    // The existing first child is not a text node so we need to create one
    // and delete the existing ones.
    deleteRemainingChildren( returnFiber, currentFirstChild )
    var created = createFiberFromText( textContent )
    created.return = returnFiber
    return created
  }

  function reconcileChildrenArray( returnFiber: Fiber, currentFirstChild: Fiber, newChildren: any  ) {
    // This algorithm can't optimize by searching from boths ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.

    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.

    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.

    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.


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

    if ( typeof newChild === 'string' || typeof newChild === 'number' ) {
      return placeSingleChild( reconcileSingleTextNode( returnFiber, currentFirstChild, '' + newChild ) )
    }

    if ( isArray( newChild ) ) {
      return reconcileChildrenArray( returnFiber, currentFirstChild, newChild )
    }
    
    // Remaining cases are all treated as empty.
    return deleteRemainingChildren( returnFiber, currentFirstChild )
  }
  return reconcileChildFibers
}

export const reconcileChildFibers: Function = ChildReconciler( true )
export const mountChildFibers: Function = ChildReconciler( false )