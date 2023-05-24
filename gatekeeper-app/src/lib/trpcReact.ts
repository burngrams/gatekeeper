import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'gatekeeper-desktop/lib'
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import superjson from 'superjson'

const client = createWSClient({
  url: `ws://10.0.0.15:3000`,
})
export const wsClient = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client,
    }),
  ],
  transformer: superjson,
})

export const trpcReact = createTRPCReact<AppRouter>()
