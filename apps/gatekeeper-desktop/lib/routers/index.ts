import { t } from '../trpc/t'
import { tickets } from './tickets.router'
import { auditlog } from './auditlog.router'

export const appRouter = t.router({ tickets, auditlog })

export type AppRouter = typeof appRouter
