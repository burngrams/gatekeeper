import { createTRPCRouter, statsRouter } from './lib'

export * from './lib'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  data: statsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
