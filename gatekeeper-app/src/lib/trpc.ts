import { createTRPCProxyClient, httpBatchLink } from '@trpc/react-query'
import { autorun, makeAutoObservable, observable } from 'mobx'
import { getTrpcUrl } from './trpcReact'
import { credentialsManager } from './credentialsManager'
import { AppRouter } from 'gatekeeper-desktop/lib'
import superjson from 'superjson'

export class TRPCManager {
  trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>> = null!

  constructor() {
    makeAutoObservable(this)

    const self = this
    autorun(() => {
      if (!credentialsManager.getIP) return
      const url = getTrpcUrl(credentialsManager.getIP)
      console.log('Starting new TRPCManager with url', url)

      self.trpc = createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
          httpBatchLink({
            url,
          }),
        ],
      })
    })
  }
}

export const trpcManager = new TRPCManager()
