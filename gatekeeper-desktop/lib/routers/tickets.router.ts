import { diff } from 'json-diff'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { auditlogEventEmitter } from './auditlog.router'

export const tickets = router({
  get: publicProcedure.input(z.object({ ticketId: z.string() })).query((opts) => {
    const {
      input: { ticketId },
    } = opts

    const ticket = opts.ctx.lowdb.data.tickets.find((ticket) => ticket.ticketId === ticketId)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    return {
      ticket,
    }
  }),

  updateStatus: publicProcedure
    .input(
      z.object({
        ticketId: z.string(),
        isInside: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const {
        input: { isInside, ticketId },
      } = opts
      const db = opts.ctx.lowdb.data

      const ticket = db.tickets.find((ticket) => ticket.ticketId === ticketId)

      if (!ticket) {
        throw new Error('Ticket not found')
      }

      ticket.isInside = isInside
      ticket.hasBeenScanned = true

      const operation = {
        operationId: 'ticket-update-status',
        gatekeeperId: '123456789',
        timestamp: new Date(),
        jsondiff: diff({ ticketId: '123', isInside: true }, { ticketId: '123', isInside: false }, { full: true }),
      }
      db.auditlog.push(operation)
      auditlogEventEmitter.emit('add', operation)

      await opts.ctx.lowdb.write()

      return {
        ticket,
      }
    }),
})
