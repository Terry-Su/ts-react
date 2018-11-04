import { DOMContainer, ExpirationTime, Batch } from "./__typings__/index.spec"
import Fiber, { createHostRootFiber } from "./ReactFiber"
import { ENABLE_SCHEDULER_TRACING } from "./constant/ReactFeatureFlags"
import { NoWork } from "./ReactFiberExpirationTime"
import { TimeoutHandle, NoTimeout, noTimeout } from "./ReactHostConfig"
import { Interaction, unstable_getThreadID } from "./scheduler/Tracing"


type PendingInteractionMap = Map<ExpirationTime, Set<Interaction>>

interface BaseFiberRootProperties {
  // Any additional information from the host associated with this root
  containerInfo: any
  // Used only by persistent updates
  pendingChildren: any
  // The currently active root fiber. This is the mutable root of the tree
  current: Fiber


  // The following priority levels are used to distinguish between
  // 1) uncommitted work
  // 2) uncommitted work that is suspended
  // 3) uncommitted work that may be unsuspended
  // We choose not to track each individual pending level,
  // trading granularity for performance
  //
  // The earliest and latest priority levels that are suspended from committing
  earliestSuspendedTime: ExpirationTime
  latestSuspendedTime: ExpirationTime
  // The earliest and latest priority levels that are not known to be suspended
  earliestPendingTime: ExpirationTime
  latestPendindTime: ExpirationTime
  // The latest priority level that was pinged by a resolved promise and 
  // can be retried
  latestPingedTime: ExpirationTime
  // A finished work-in-progress HostRoot that is ready to be committed
  pendingCommitExpirationTime: ExpirationTime
  finishedWork: Fiber
  // Tiemout handle returned by setTimeout.
  // Used to cancel a pending timeout, if it's superseded by a new one
  timeoutHandle: TimeoutHandle | NoTimeout
  // Top context object, used by renderSubtreeIntoContainer
  context: Object
  pendingContext: Object
  // Determines if we should attempt to hydrate on the initial mount
  hydrate: boolean
  // Remaining expiration time on this root
  nextExpirationTimeToWorkOn: ExpirationTime
  expirationTime: ExpirationTime
  // List of top-level batches.
  // This list indicates whether a commit should be deferred. 
  // Also contains completion callbacks
  firstBatch: Batch
  // Linked-list of roots
  nextScheduledRoot: FiberRoot

  // If an error is thrown, and there are no more updates in the queue,
  // we try rendering from the root one more time, synchronously, before
  // handling the error
  didError: boolean
}


// The following attributes are only used by interaction tracing builds.
// They enable interactions to be associated with their **async work**,
// and expose interaction metadata to the React DevTools Profiler plugin.
// Note that these attributes are only defined when the enableSchedulerTracing flag is enabled
interface ProfilingOnlyFiberRootProperties {
  interactionThreadID: number,
  memoizedInteractions: Interaction[]
  pendingInteractionMap: PendingInteractionMap
}

type FiberRoot = BaseFiberRootProperties & ProfilingOnlyFiberRootProperties


export default FiberRoot


export function createFiberRoot(
  containerInfo: any,
  isConcurrent: boolean,
  hydrate: boolean
): FiberRoot {

  // Cyclic construction.
  // This cheats the type system right now because statNode is any
  const uninitializedFiber = createHostRootFiber( isConcurrent )

  let root

  if ( ENABLE_SCHEDULER_TRACING ) {
    root = {
      current        : uninitializedFiber,
      containerInfo,
      pendingChildren: null,

      earliestPendingTime  : NoWork,
      latestPendingTime    : NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime  : NoWork,
      latestPingedTime     : NoWork,

      pendingCommitExpirationTime: NoWork,
      finishedWork               : null,
      timeoutHandle              : noTimeout,
      context                    : null,
      pendingContext             : null,
      hydrate,
      nextExpirationTimeToWorkOn : NoWork,
      expirationTime             : NoWork,
      firstBatch                 : null,
      nextScheduledRoot          : null,

      interactionThreadID  : unstable_getThreadID(),
      momizedInteractions  : new Set(),
      pendingInteractionMap: new Map(),

      didError: false,
    }
  }

  if ( !ENABLE_SCHEDULER_TRACING ) {
    root = {
      current        : uninitializedFiber,
      containerInfo,
      pendingChildren: null,

      earliestPendingTime  : NoWork,
      latestPendingTime    : NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime  : NoWork,
      latestPingedTime     : NoWork,

      pendingCommitExpirationTime: NoWork,
      finishedWork               : null,
      timeoutHandle              : noTimeout,
      context                    : null,
      pendingContext             : null,
      hydrate,
      nextExpirationTimeToWorkOn : NoWork,
      expirationTime             : NoWork,
      firstBatch                 : null,
      nextScheduledRoot          : null,

      didError: false,
    }
  }

  uninitializedFiber.stateNode = root

  return root
}