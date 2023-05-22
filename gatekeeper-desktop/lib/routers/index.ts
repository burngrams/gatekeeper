import { helloWorldRouter } from './hello-world'
import { tickets } from './tickets.router'
import { t } from '../trpc/t'
import { publicProcedure } from '../trpc'

export const appRouter = t.router({ tickets, ping: publicProcedure.query(() => 'pong' as const) })

export type AppRouter = typeof appRouter
