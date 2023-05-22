import { helloWorldRouter } from './hello-world'
import { ticketsRouter } from './tickets'
import { t } from '../trpc/t'

export const appRouter = t.mergeRouters(helloWorldRouter, ticketsRouter)

export type AppRouter = typeof appRouter
