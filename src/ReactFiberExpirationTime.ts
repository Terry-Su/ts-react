import { ExpirationTime } from "./__typings__/index.spec"
import { __DEV__ } from "./constant/DEV_MODE"

export const NoWork = 0
export const Sync = 1

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// // Math.pow(2, 30) - 1
const MAX_SIGNED_31_BIT_INT = 1073741823
export const Never = MAX_SIGNED_31_BIT_INT


const UNIT_SIZE = 10
const MAGIC_NUMBER_OFFSET = 2

export function msToExpirationTime( ms: number ): ExpirationTime {
  return ( ( ms / UNIT_SIZE ) | 0 ) + MAGIC_NUMBER_OFFSET
}


// If **the main thread is being blockd so long** that you hit the expiration,
// it's a problem that could be solved with better scheduling
//
// React intentionally set a higher expiration time for interactive updates
// in dev than in production
//
// In development people will be more likely to notice this and fix it with
// the long expiration time in development
//
// In production we opt for **better UX** at the risk of masking scheduling
// problems, by expiring fast.

export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150
export const HIGH_PRIORITY_BATCH_SIZE = 100

export function computeInteractiveExpiration( currentTime: ExpirationTime ) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE
  )
}


export const LOW_PRIORITY_EXPIRATION = 5000
export const LOW_PRIORITY_BATCH_SIZE = 250
export function computeAsyncExpiration( currentTime: ExpirationTime ): ExpirationTime {
  return computeExpirationBucket(
    currentTime, 
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE
  )
}


function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET +
    ceiling(
      currentTime - MAGIC_NUMBER_OFFSET + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE
    )
  )

  function ceiling( num: number, precision: number ) {
    return (
      (
        ( num / precision ) | 0
      ) + 1
    ) * precision
  }
}
