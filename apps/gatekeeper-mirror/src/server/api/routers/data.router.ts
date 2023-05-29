import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { kv } from '@vercel/kv'

export interface MirrorModel {
  sumIsInside: number
  sumHasBeenScanned: number
  sumTotalTickets: number
  sumCarIsInside: number
  sumCarTotalTickets: number
}
const key = '/'

export const dataRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return await kv.get<MirrorModel[]>(key)
  }),
  set: publicProcedure
    .input(
      z.object({
        sumIsInside: z.number(),
        sumHasBeenScanned: z.number(),
        sumTotalTickets: z.number(),
        sumCarIsInside: z.number(),
        sumCarTotalTickets: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input: mirrorModel } = opts

      await kv.hset(key, mirrorModel)
    }),
})
