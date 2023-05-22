import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'gatekeeper-desktop/lib'

export const trpcReact = createTRPCReact<AppRouter>()

export const getTrpcUrl = (ip: string) => `http://${ip}:3000`
