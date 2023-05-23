import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import superjson from 'superjson'
import { AppRouter } from '../lib'
import { url } from 'inspector'

export const trpcReact = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  // TODO doesnt work
  // links: [ipcLink()],
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})
