import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'gatekeeper-desktop/lib'
import superjson from 'superjson'
import * as Network from 'expo-network'

export const trpcReact = createTRPCReact<AppRouter>()

export let trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

// get network ip address from expo-network
// https://docs.expo.io/versions/latest/sdk/network/#networkgetipaddressasync
;(async () => {
  const ipAddress = '10.0.0.30'
  const [o1, o2, o3, octet] = ipAddress.split('.')
  // run from second octet to octet, try to connect to the first one that works
  for (let i = 2; i <= +octet; i++) {
    const url = `http://${o1}.${o2}.${o3}.${i}:3000`
    try {
      const attemptTrpc = createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
          httpBatchLink({
            url,
          }),
        ],
      })
      const res = await trpc.ping.query()
      console.log('trying ip', url, res)
      if (res === 'pong') {
        console.log('connected to', url)
        trpc = attemptTrpc
        break
      }
    } catch (e) {
      console.log('failed to connect to', e, url)
    }
  }
})()
