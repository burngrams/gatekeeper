import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

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

      const ticket = opts.ctx.lowdb.data.tickets.find((ticket) => ticket.ticketId === ticketId)

      if (!ticket) {
        throw new Error('Ticket not found')
      }

      ticket.isInside = isInside
      ticket.hasBeenScanned = true

      await opts.ctx.lowdb.write()

      return {
        ticket,
      }
    }),
})
