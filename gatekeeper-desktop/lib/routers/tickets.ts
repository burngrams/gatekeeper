import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

const tickets = router({
  updateStatus: publicProcedure
    .input(
      z.object({
        ticketId: z.string(),
        isInside: z.boolean(),
      })
    )
    .mutation((opts) => {
      const {
        input: { isInside, ticketId },
      } = opts

      const ticket = opts.ctx.lowdb.data.tickets.find((ticket) => ticket.ticketId === ticketId)

      if (!ticket) {
        throw new Error('Ticket not found')
      }

      ticket.isInside = isInside

      opts.ctx.lowdb.write()

      return {
        ticket,
      }
    }),
})

export const ticketsRouter = tickets
