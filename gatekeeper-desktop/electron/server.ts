import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from '../lib'

export function createServer() {
  const server = createHTTPServer({
    router: appRouter,
  })

  server.listen(3000)
  console.log('Listening on port 3000')
}
