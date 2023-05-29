import { diff } from 'json-diff'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { emit } from './auditlog.router'

export const gatekeepers = router({
  get: publicProcedure.query((opts) => {
    const gatekeepers = opts.ctx.lowdb.data.gatekeepers

    return {
      gatekeepers,
    }
  }),
  update: publicProcedure.input(z.object({ fullname: z.string(), isActive: z.boolean() })).mutation(async (opts) => {
    const {
      input: { fullname, isActive },
    } = opts
    const db = opts.ctx.lowdb.data

    const gatekeeper = db.gatekeepers.find((user) => user.fullname === fullname)

    // if no gatekeeper, create it
    if (gatekeeper) {
      gatekeeper.isActive = isActive
    } else {
      db.gatekeepers.push({
        fullname,
        isActive,
      })
    }

    emit(db, {
      operationId: 'update-gatekeeper-isActive',
      jsondiff: diff(gatekeeper, { isActive }),
      timestamp: new Date(),
    })

    await opts.ctx.lowdb.write()

    return {
      gatekeeper,
    }
  }),
})
