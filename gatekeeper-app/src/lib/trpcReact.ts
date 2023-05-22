import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppRouter } from 'gatekeeper-desktop/lib/api'

export const trpcReact = createTRPCReact<AppRouter>()
