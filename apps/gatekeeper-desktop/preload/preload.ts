import { contextBridge, ipcRenderer } from 'electron'
import { exposeElectronTRPC } from 'electron-trpc/main'
import type { ClientElectronAPI } from './ElectronAPI'

process.once('loaded', async () => {
  exposeElectronTRPC()

  const electronAPI: ClientElectronAPI = {
    ip: await ipcRenderer.invoke('getIp'),
    allocationsModeSetting: await ipcRenderer.invoke('getAllocationsModeSetting'),
    toggleAllocationsModeSetting: async () => {
      await ipcRenderer.invoke('toggleAllocationsModeSetting')
    },
  }
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
})
