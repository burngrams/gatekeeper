import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { DatabaseModel } from '../models'
import { DatabaseLayer } from '../repository/types'
// import { getSessionFromCookie, type Session } from './auth'

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  // session: /* Session | */ null
  lowdb: DatabaseLayer
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts: CreateInnerContextOptions) {
  return {
    lowdb: opts.lowdb,
  }
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export const generateContext = async (lowdb: DatabaseLayer) => {
  const contextInner = await createContextInner({ lowdb })

  return async function createContext(opts: CreateNextContextOptions) {
    return {
      ...contextInner,
      req: opts.req,
      res: opts.res,
    }
  }
}

export type Context = inferAsyncReturnType<typeof createContextInner>
