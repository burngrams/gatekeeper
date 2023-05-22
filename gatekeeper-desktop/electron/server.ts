import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from '../lib'
import { generateContext } from '../lib/trpc/context'
import { getDatabase } from '../lib/repository/lowdb'

export async function createServer() {
  const lowdb = await getDatabase()
  const createContext = await generateContext(lowdb)

  const server = createHTTPServer({
    router: appRouter,
    createContext,
  })

  server.listen(3000)
  console.log('Listening on port 3000...')
}
