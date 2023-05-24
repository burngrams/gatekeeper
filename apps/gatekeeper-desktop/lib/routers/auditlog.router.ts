import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'
import { OperationLogModel } from '../models'
import { publicProcedure, router } from '../trpc'

export const auditlogEventEmitter = new EventEmitter()

export const auditlog = router({
  // get procedure that returns all auditlog entries
  get: publicProcedure.query((opts) => {
    const auditlog = opts.ctx.lowdb.data.auditlog

    return {
      auditlog,
    }
  }),
  onAdd: publicProcedure.subscription(() => {
    // return an `observable` with a callback which is triggered immediately
    return observable<OperationLogModel>((emit) => {
      const onAdd = (data: OperationLogModel) => {
        // emit data to client
        emit.next(data)
      }
      // trigger `onAdd()` when `add` is triggered in our event emitter
      auditlogEventEmitter.on('add', onAdd)
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        auditlogEventEmitter.off('add', onAdd)
      }
    })
  }),
})
