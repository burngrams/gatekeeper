import { observable } from '@trpc/server/observable'
import { z } from 'zod'
import { t } from '../trpc/t'
import { EventEmitter } from 'events'

const ee = new EventEmitter()

export const helloWorldRouter = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req

    ee.emit('greeting', `Greeted ${input.name}`)
    return {
      text: `Hello ${input.name}` as const,
    }
  }),
  subscription: t.procedure.subscription(() => {
    return observable((emit) => {
      function onGreet(text: string) {
        emit.next({ text })
      }

      ee.on('greeting', onGreet)

      return () => {
        ee.off('greeting', onGreet)
      }
    })
  }),
})
