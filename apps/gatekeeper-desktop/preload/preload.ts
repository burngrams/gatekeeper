import { contextBridge, ipcRenderer } from 'electron'
import { exposeElectronTRPC } from 'electron-trpc/main'

process.once('loaded', async () => {
  exposeElectronTRPC()

  const ip = await ipcRenderer.invoke('getIp')
  contextBridge.exposeInMainWorld('gatekeeper', { ip })
})
