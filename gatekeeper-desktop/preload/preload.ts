const { contextBridge, ipcRenderer } = require('electron')
import { exposeElectronTRPC } from 'electron-trpc/main'
import { address } from 'ip'

process.once('loaded', async () => {
  exposeElectronTRPC()
  contextBridge.exposeInMainWorld('gatekeeper', { ip: await ipcRenderer.invoke('getIP') })
})
