import FiberRoot from "./ReactFiberRoot"
import { ExpirationTime } from "./__typings__/index.spec"
import { NoWork } from "./ReactFiberExpirationTime"

export function markPendingPriorityLevel(
  root: FiberRoot,
  expirationTime: ExpirationTime
) {
  // If there's a gap between completing a failded root and retrying it,
  // additional updates may be scheduled. Clear `didError`, in case the 
  // update is sufficient to fix the error
  root.didError = false

  // Update the latest and earliest pending times
  const earliestPendingTime = root.earliestPendingTime
  if ( earliestPendingTime === NoWork ) {
    // No other pending updates
    root.latestPendindTime = expirationTime
    root.earliestPendingTime = root.latestPendindTime
  }
  if ( earliestPendingTime !== NoWork ) {
    if ( earliestPendingTime > expirationTime ) {
        // This is the earliest pending update
        root.earliestPendingTime = expirationTime
    } else {
      const { latestPendindTime } = root
      if ( latestPendindTime < expirationTime ) {
        // This is the latest pending update
        root.latestPendindTime = expirationTime
      }
    }
  }
  findNextExpirationTimeToWorkOn( expirationTime, root )
}

function findNextExpirationTimeToWorkOn( completedExpirationTime, root ) {
  const {
    earliestSuspendedTime,
    latestSuspendedTime,
    earliestPendingTime,
    latestPingedTime,
  } = root

  // Work on the earliest pending time. Failing that, work on the latest
  // pinged time.
  let nextExpirationTimeToWorkOn =
    earliestPendingTime !== NoWork ? earliestPendingTime : latestPingedTime

  // If there is no pending or pinged work, check if there's suspended work
  // that's lower priority than what we just completed.
  if (
    nextExpirationTimeToWorkOn === NoWork &&
    ( completedExpirationTime === NoWork ||
      latestSuspendedTime > completedExpirationTime )
  ) {
    // The lowest priority suspended work is the work most likely to be
    // committed next. Let's start rendering it again, so that if it times out,
    // it's ready to commit.
    nextExpirationTimeToWorkOn = latestSuspendedTime
  }

  let expirationTime = nextExpirationTimeToWorkOn
  if (
    expirationTime !== NoWork &&
    earliestSuspendedTime !== NoWork &&
    earliestSuspendedTime < expirationTime
  ) {
    // Expire using the earliest known expiration time.
    expirationTime = earliestSuspendedTime
  }

  root.nextExpirationTimeToWorkOn = nextExpirationTimeToWorkOn
  root.expirationTime = expirationTime
}