// UpdateQueue is a linked list of prioritized updates.
//
// Like fibers, update queues come in pairs: a current queue, which represents
// the visible state of the screen, and a work-in-progress queue, which is
// can be mutated and processed asynchronously before it is committed — a form
// of double buffering. If a work-in-progress render is discarded before
// finishing, we create a new work-in-progress by cloning the current queue.
//
// Both queues share a persistent, singly-linked list structure. To schedule an
// update, we append it to the end of both queues. Each queue maintains a
// pointer to first update in the persistent list that hasn't been processed.
// The work-in-progress pointer always has a position equal to or greater than
// the current queue, since we always work on that one. The current queue's
// pointer is only updated during the commit phase, when we swap in the
// work-in-progress.
//
// For example:
//
//   Current pointer:           A - B - C - D - E - F
//   Work-in-progress pointer:              D - E - F
//                                          ^
//                                          The work-in-progress queue has
//                                          processed more updates than current.
//
// The reason we append to both queues is because otherwise we might drop
// updates without ever processing them. For example, if we only add updates to
// the work-in-progress queue, some updates could be lost whenever a work-in
// -progress render restarts by cloning from current. Similarly, if we only add
// updates to the current queue, the updates will be lost whenever an already
// in-progress queue commits and swaps with the current queue. However, by
// adding to both queues, we guarantee that the update will be part of the next
// work-in-progress. (And because the work-in-progress queue becomes the
// current queue once it commits, there's no danger of applying the same
// update twice.)
//
// Prioritization
// --------------
//
// Updates are not sorted by priority, but by insertion; new updates are always
// appended to the end of the list.
//
// The priority is still important, though. When processing the update queue
// during the render phase, only the updates with sufficient priority are
// included in the result. If we skip an update because it has insufficient
// priority, it remains in the queue to be processed later, during a lower
// priority render. Crucially, all updates subsequent to a skipped update also
// remain in the queue *regardless of their priority*. That means high priority
// updates are sometimes processed twice, at two separate priorities. We also
// keep track of a base state, that represents the state before the first
// update in the queue is applied.
//
// For example:
//
//   Given a base state of '', and the following queue of updates
//
//     A1 - B2 - C1 - D2
//
//   where the number indicates the priority, and the update is applied to the
//   previous state by appending a letter, React will process these updates as
//   two separate renders, one per distinct priority level:
//
//   First render, at priority 1:
//     Base state: ''
//     Updates: [A1, C1]
//     Result state: 'AC'
//
//   Second render, at priority 2:
//     Base state: 'A'            <-  The base state does not include C1,
//                                    because B2 was skipped.
//     Updates: [B2, C1, D2]      <-  C1 was rebased on top of B2
//     Result state: 'ABCD'
//
// Because we process updates in insertion order, and rebase high priority
// updates when preceding updates are skipped, the final result is deterministic
// regardless of priority. Intermediate state may vary according to system
// resources, but the final state is always the same.

import Fiber from "./ReactFiber"
import { isNil, notNil, isFunction } from "../util/lodash"
import { Component } from "../react/React"

export const UpdateState = 0
export const ReplaceState = 1
export const ForceUpdate = 2
export const CaptureUpdate = 3

export class Update {
  tag: 0 | 1 | 2 | 3 = UpdateState
  payload: any

  next: Update
  nextEffect: Update

  callback?: Function
}

export default class UpdateQueue {
  baseState

  firstUpdate: Update
  lastUpdate: Update

  firstCapturedUpdate: Update
  lastCapturedUpdate: Update

  firstEffect: Update
  lastEffect: Update

  firstCapturedEffect: Update
  lastCapturedEffect: Update

  constructor( baseState ) {
    this.baseState = baseState
  }
}

export function createUpdate() {
  return new Update()
}

export function createUpdateQueue( baseState ): UpdateQueue {
  return new UpdateQueue( baseState )
}

export function cloneUpdateQueue( currentQueue: UpdateQueue ) {
  const {
    baseState,

    firstUpdate,
    lastUpdate
  } = currentQueue
  return {
    baseState,

    firstUpdate,
    lastUpdate,

    firstCapturedUpdate: null,
    lastCapturedUpdate : null,

    firstEffect: null,
    lastEffect : null,

    firstCapturedEffect: null,
    lastCapturedEffect : null
  }
}

export function appendUpdateToQueue( queue: UpdateQueue, update: Update ) {
  // Append the udpate to the end of the list
  if ( isNil( queue.lastUpdate ) ) {
    // queue is empty
    queue.firstUpdate = queue.lastUpdate = update
  } else {
    queue.lastUpdate.next = update
    queue.lastUpdate = update
  }
}

export function enqueueUpdate( fiber: Fiber, update: Update ) {
  const { alternate } = fiber
  let queue1
  let queue2

  if ( isNil( alternate ) ) {
    // there's only one fiber: fiber
    queue1 = fiber.updateQueue
    queue2 = null
    if ( isNil( queue1 ) ) {
      queue1 = fiber.updateQueue = createUpdateQueue( fiber.memoizedState )
    }
  } else {
    // there're two fiber: fiber and alternate
    queue1 = fiber.updateQueue
    queue2 = alternate.updateQueue

    if ( isNil( queue1 ) ) {
      if ( isNil( queue2 ) ) {
        // Neither fiber has an update queue. Create new ones
        queue1 = fiber.updateQueue = createUpdateQueue( fiber.memoizedState )
        queue2 = alternate.updateQueue = createUpdateQueue(
          alternate.memoizedState
        )
      } else {
        // Only alternate has an update queue. clone to create a new one for fiber
        queue1 = fiber.updateQueue = cloneUpdateQueue( queue2 )
      }
    } else {
      if ( isNil( queue2 ) ) {
        // Only fiber has an update queue. clone to create a new one for alternate
        queue2 = alternate.updateQueue = cloneUpdateQueue( queue1 )
      } else {
        // Both fiber and alternate has an update queue
      }
    }
  }


  if ( isNil( queue2 ) || queue1 === queue2  ) {
    // there's only a single queue
    appendUpdateToQueue( queue1, update )
  } else {
    // There are two queues. We need to append the update to both queues,
    // while accounting for the persistent structure of the list — we don't
    // want the same update to be added multiple times.
    if ( isNil( queue1.lastUpdate ) || isNil( queue2.lastUpdate ) ) {
      // One of the queues is not empty. We must add the update to both queues.
      appendUpdateToQueue( queue1, update )
      appendUpdateToQueue( queue2, update )
    } else {
      // Both queues are non-empty. The last update is the same in both lists,
      // because of structural sharing. So, only append to one of the lists.
      appendUpdateToQueue( queue1, update )
      // But we still need to update the `lastUpdate` pointer of queue2.
      queue2.lastUpdate = update
    }
  }
}

export function ensureWorkInProgressQueueIsAClone( workInProgress: Fiber, queue: UpdateQueue ) {
  const { alternate: current } = workInProgress
  if ( notNil( current ) ) {
    if ( queue === current.updateQueue ) {
      queue = workInProgress.updateQueue = cloneUpdateQueue( queue )
    }
  }
  return queue
}

export function getStateFromUpdate( workInProgress: Fiber, queue: UpdateQueue, update: Update, prevState: any, nextProps: any, instance: any ) {
  switch( update.tag ) {
    case UpdateState: {
      let partialState
      const { payload } = update
      
      if ( isFunction( payload ) ) {
        // updater is function
        partialState = payload.call( instance, prevState, nextProps )
      } else {
        // updater is object
        partialState = payload
      }
      
      if ( isNil( partialState ) ) {
        return prevState
      }

      return {
        ...prevState,
        ...partialState
      }
    }
  }
}

export function processUpdateQueue( workInProgress: Fiber, queue: UpdateQueue, props: any, instance: any ) {
  queue = ensureWorkInProgressQueueIsAClone( workInProgress, queue )

  let { baseState: newBaseState } = queue
  let newFirstUpdate

  // Iterate through the list of updates to compute the result
  let { firstUpdate: update } = queue
  let resultState = newBaseState
  while ( notNil( update ) ) {
    resultState = getStateFromUpdate( workInProgress, queue, update, resultState, props, instance ) 
    
    // continue to the next update
    update = update.next

    // if ( queue.lastEffect === null ) {
    //   queue.firstEffect = queue.lastEffect = update
    // } else {
    //   queue.lastEffect.nextEffect = update
    //   queue.lastEffect = update
    // }
  }

  if ( isNil( newFirstUpdate ) ) {
    queue.lastUpdate = null
  }

  if ( isNil( newFirstUpdate ) ) {
    newBaseState = resultState
  }

  queue.baseState = newBaseState
  queue.firstUpdate = newFirstUpdate

  workInProgress.memoizedState = resultState
}



export function commitUpdateQueue( finishedWork: Fiber, finishedQueue: UpdateQueue, instance: Component ) {

}