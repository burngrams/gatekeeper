import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'gatekeeper-desktop/lib'
import superjson from 'superjson'

export const trpcReact = createTRPCReact<AppRouter>()

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://10.101.93.176:3000',
    }),
  ],
})
