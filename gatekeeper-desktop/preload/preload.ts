import { contextBridge } from 'electron'
import { exposeElectronTRPC } from 'electron-trpc/main'

process.once('loaded', async () => {
  exposeElectronTRPC()

  contextBridge.exposeInMainWorld('gatekeeper', { ip: require('ip').address() })
})
