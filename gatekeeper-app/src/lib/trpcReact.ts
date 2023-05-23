import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'gatekeeper-desktop/lib'

export const trpcReact = createTRPCReact<AppRouter>()
