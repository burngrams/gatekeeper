import { createTRPCProxyClient, createWSClient, httpBatchLink, wsLink } from '@trpc/client'
import superjson from 'superjson'
import { AppRouter } from '../lib'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  // TODO doesnt work
  // links: [ipcLink()],
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

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
