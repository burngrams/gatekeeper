import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { appRouter } from 'gatekeeper-mirror/src/server/api/appRouter'
import { MirrorModel } from 'gatekeeper-mirror/src/server/api/routers/data.router'
import SuperJSON from 'superjson'
import { DatabaseLayer } from '../lib/repository/data.types'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.NODE_ENV === 'production') return process.env.VERCEL_URL
  return `http://localhost:${process.env.PORT ?? 3001}` // dev SSR should use localhost
}

const baseUrl = getBaseUrl()
console.log('🚀 ~ file: mirror.ts:14 ~ baseUrl:', baseUrl)

export const trpc = createTRPCProxyClient<typeof appRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
})

export const getSums = (db: DatabaseLayer) => {
  const mirrorModel: MirrorModel = {
    sumCarIsInside: db.data.tickets.reduce((acc, ticket) => acc + (ticket.isInside && ticket.isCarTicket ? 1 : 0), 0),
    sumCarTotalTickets: db.data.tickets.reduce((acc, ticket) => acc + (ticket.isCarTicket ? 1 : 0), 0),
    sumHasBeenScanned: db.data.tickets.reduce((acc, ticket) => acc + (ticket.hasBeenScanned ? 1 : 0), 0),
    sumIsInside: db.data.tickets.reduce((acc, ticket) => acc + (ticket.isInside ? 1 : 0), 0),
    sumTotalTickets: db.data.tickets.length,
  }

  return mirrorModel
}
export const setSums = async (model: MirrorModel): Promise<MirrorModel> => {
  return trpc.data.set.mutate(model)
}
