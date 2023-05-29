import { TRPCError } from '@trpc/server'
import { diff } from 'json-diff'
import { z } from 'zod'
import { OperationLogModel } from '../models'
import { ticketToCommunity } from '../repository/community'
import { runningInAllocationsMode } from '../settings'
import { publicProcedure, router } from '../trpc'
import { emit } from './auditlog.router'

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

      // if runningInAllocationsMode,
      if (runningInAllocationsMode) {
        // check whether the community is full
        const community = ticketToCommunity(opts.ctx.lowdb, ticket)
        const participantWantsInside = !ticket.isInside

        if (participantWantsInside && community.currentlyInside >= community.maxAllowedInside) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'הקאמפ הגיע למקסימום הקצאות, אין אפשרות להכניס משתתף!',
            cause: new Error(),
          })
        }

        community.currentlyInside += participantWantsInside ? 1 : -1
      }

      ticket.isInside = isInside
      ticket.hasBeenScanned = true

      const operation: OperationLogModel = {
        operationId: 'ticket-update-status',
        // TODO gatekeeperId task
        // gatekeeperId: '123456789',
        timestamp: new Date(),
        jsondiff: diff({ ticketId: '123', isInside: true }, { ticketId: '123', isInside: false }, { full: true }),
      }
      emit(db, operation)

      // after two changes, we'll write to disk
      await opts.ctx.lowdb.write()

      return {
        ticket,
      }
    }),
})
