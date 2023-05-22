import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from './context'
import path from 'path'

export const t = initTRPC.context<Context>().create({
  isServer: true,
  transformer: superjson,
  defaultMeta: {
    lowDbUrl: path.join(__dirname, '..', '..', 'fixtures'),
  },
})
