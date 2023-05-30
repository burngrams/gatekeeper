import { createNextApiHandler } from '@trpc/server/adapters/next'
import { env } from '~/env.mjs'
import { type AppRouter, appRouter, createTRPCContext } from '../../../../../shared-trpc/vercel.trpc'

// export API handler
export default createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
        }
      : undefined,
})
