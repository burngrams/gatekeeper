import { TRPCError } from '@trpc/server'
import { diff } from 'json-diff'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

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

    if (!gatekeeper) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'השומר לא נמצא',
        cause: new Error(),
      })
    }

    gatekeeper.isActive = isActive

    db.auditlog.push({
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
