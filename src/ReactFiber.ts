import { TypeOfMode, ConcurrentMode, StrictMode, NoContext, ProfileMode } from "./constant/ReactTypeOfMode"
import { createFiberRoot } from "./ReactFiberRoot"
import { ExpirationTime } from "./__typings__/index.spec"
import { WorkTag, HostRoot } from "./constant/ReactWorkTags"
import { UpdateQueue } from "./UpdateQueue"
import { ContextDependency } from "./ReactFiberNewContext"
import { SideEffectTag } from "./constant/ReactSideEffectTags"
import { RefObject } from "./__typings__/ReactTypes"
import { Source } from "./__typings__/ReactElementType"
import { ENABLE_PROFILER_TIMER } from "./constant/ReactFeatureFlags"
import { isDevToolsPresent } from "./devTools/ReactFiberDevToolsHook"


// A Fiber is work on a Component that needs to be done or was done.
// There can be more than one per component
export default interface Fiber {
  // These first fields are conceptually members of an Instance.
  // This used to be split into a separate type and intersected with
  // other Fiber fields, but until Flow fixes its intersection bugs,
  // react's merged them into a single type

  // An instance is shared between all versions of a component.
  // We can easily break this out into a separate object to avoid copying
  // so much to the alternate versions of the tree.
  // We put this on a singl object for now to minimize the number of objects
  // created during the initial render.

  // Tag ientifying the type of fiber
  tag: WorkTag

  // Unique identifier of this child
  key: string

  // The value of element.type which is used to preserve the identity during 
  // reconciliation of this child
  elementType: any


  // The resolved function/class/ associated with this fiber
  type: any

  // The local state associated with this fiber
  stateNode: any


  // Conceptual aliases
  // parent: Instance -> return The parent happens to be the same as the return fiber
  // since we've merged the fiber and instance

  // Remaining fields belong to Fiber
  
  // The fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents(two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  return: Fiber
  
  // Singly Linked List Tree Structure
  child: Fiber
  sibling: Fiber
  index: number
  
  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps: any // this type will be more specific once we overload the tag
  memoizedProps: any //the props used to create the output 
  
  // A queue of state updates and callbacks
  updateQueue: UpdateQueue<any>
  
  // The state used to create the output
  memoizedState: any
  
  // A linked-list of contexts taht this fiber depends on
  firstContextDependency: ContextDependency<any>

  // Bitfield that describes properties about the fiber and its subtree.
  // E.g. the ConcurrentMode flag indicates whether the subtree should be
  // async-by-default. When a fiber is created, it inherits the mode of its 
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created
  mode: TypeOfMode

  // Effect
  effectTag: SideEffectTag

  // Singly linked list fast path to the next fiber with side-effects
  nextEffect: Fiber

  // The first and last fiber with side-effect within the subtree.
  // This allows us to reuse a slice of the linked list when we reuse the 
  // work done within this fiber.
  firstEffect: Fiber
  lastEffect: Fiber

  // Represents a time in the future by which **this work should be completed**.
  // Does not include work found in its subtree
  expirationTime: ExpirationTime

  // This is used to quickly determine if a subtree has no pending changes
  childExpirationTime: ExpirationTime

  // This is a pooled version of a Fiber. 
  // Every fiber that gets updated will eventually have a pair.
  // There are cases when we can clean up pairs to save memory if we need to
  alternate: Fiber


  // The ref last used to attach this node
  // I'll avoid adding an owner field for prod and model that as functons
  ref: Function | RefObject


  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number

  // If the Fiber is currently active in the "render" phase
  // This marks the time at which the work began
  // This field is only set when the enableProfilerTimer flag is enabled
  actualStartTime?: number

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the en enableProfilerTimer flag is enabled
  selfBaseDuration?: number

  // Sum of base times for all descedents of this Fiber
  // This valu bubbles up during the "complete" phase
  // This field is only set when the enableProfilerTimer flag is enable
  treeBaseDuration?: number

  // Conceptual aliases
  // workInProgress: Fiber -> alternate The alternate used for reuse
  // happens to be the same as work in progress
  // __DEV__ only
  _debugID?: number
  _debugSource?: Source
  _debugOwner: Fiber
  _debugIsCurrentlyTiming?: boolean
}


class FiberNode {
  // Instance
  tag: WorkTag
  key: string
  elementType: any
  type: any
  stateNode: any

  // Fiber
  return: Fiber
  child: Fiber
  sibling: Fiber
  index: number = 0

  pendingProps: any
  memoizedProps: any
  updateQueue: UpdateQueue<any>
  memoizedState: any
  firstContextDependency: ContextDependency<any>

  mode: TypeOfMode

  ref: Function | RefObject


  constructor( tag: WorkTag, pendingProps: any, key: string, mode: TypeOfMode ) {
    // Instance
    this.tag = tag
    this.key = key

    // FIiber
    this.pendingProps = pendingProps
    this.mode = mode
  }
}



// This is a constructor function, rather than a POJO constructor,
// still please ensure we do the following:
// 1) Nobody should add any instance methods on this. Instance methods can
//    be more difficult to predict when they get optimized and the are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment
// 4) We can easily go from a constructor to a createFiber object literal if that
//    is fater
// 5) It should be easy to port this to a C struct and keep a C implementation compatible
export function createFiber(
  tag: WorkTag,
  pendingProps: any,
  key: string,
  mode: TypeOfMode
): Fiber {
  return <Fiber>new FiberNode( tag, pendingProps, key, mode )
}



export function createHostRootFiber( isConcurrent: boolean ): Fiber {
  let mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext
  
  if ( ENABLE_PROFILER_TIMER && isDevToolsPresent ) {
    // Always collect profile timinngs when DevTools are present
    // This enables DevTools to start capturing timeing at any point
    // without some nodes in the tree having base times.
    mode |= ProfileMode
  }

  return createFiber( HostRoot, null, null, mode ) 
}