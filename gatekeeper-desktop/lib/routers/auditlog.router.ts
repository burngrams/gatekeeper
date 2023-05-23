import { diffString, diff } from 'json-diff'
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const auditlog = router({
  // get procedure that returns all auditlog entries
  get: publicProcedure.query((opts) => {
    const auditlog = opts.ctx.lowdb.data.auditlog

    console.log('auditlog', auditlog)

    return {
      auditlog,
    }
  }),
})
