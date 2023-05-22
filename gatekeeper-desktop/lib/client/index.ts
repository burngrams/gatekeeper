import { createTRPCProxyClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import type { AppRouter } from '../server'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()],
})

export async function main() {
  /**
   * Inferring types
   */
  const users = await trpc.userList.query()
  //    ^?
  console.log('Users:', users)

  const createdUser = await trpc.userCreate.mutate({ name: 'sachinraja' })
  //    ^?
  console.log('Created user:', createdUser)

  const user = await trpc.userById.query('1')
  //    ^?
  console.log('User 1:', user)
}

main().catch(console.error)
