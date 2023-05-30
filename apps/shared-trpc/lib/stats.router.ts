import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from './trpc'
import { kv } from '@vercel/kv'

export interface MirrorModel {
  sumIsInside: number
  sumHasBeenScanned: number
  sumTotalTickets: number
  sumCarIsInside: number
  sumCarTotalTickets: number
}

const key = '/'

export const statsRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return await kv.hmget(
      key,
      'sumIsInside',
      'sumHasBeenScanned',
      'sumTotalTickets',
      'sumCarIsInside',
      'sumCarTotalTickets'
    )
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
