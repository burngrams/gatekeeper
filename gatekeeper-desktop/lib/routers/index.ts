import { helloWorldRouter } from './hello-world'
import { tickets } from './tickets.router'
import { t } from '../trpc/t'

export const appRouter = t.router({ tickets })

export type AppRouter = typeof appRouter
