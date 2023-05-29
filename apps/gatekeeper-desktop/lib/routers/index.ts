import { t } from '../trpc/t'
import { tickets } from './tickets.router'
import { auditlog } from './auditlog.router'
import { gatekeepers } from './gatekeepers.router'

export const appRouter = t.router({ tickets, auditlog, gatekeepers })

export type AppRouter = typeof appRouter
