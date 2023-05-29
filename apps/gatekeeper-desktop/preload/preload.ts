import { contextBridge, ipcRenderer } from 'electron'
import { exposeElectronTRPC } from 'electron-trpc/main'
import type { ElectronAPI } from './ElectronAPI'

process.once('loaded', async () => {
  exposeElectronTRPC()

  const electronAPI: ElectronAPI = {
    ip: await ipcRenderer.invoke('getIp'),
    allocationsModeSetting: await ipcRenderer.invoke('getAllocationsModeSetting'),
    toggleAllocationsModeSetting: async (mode: boolean) => {
      await ipcRenderer.invoke('toggleAllocationsModeSetting')
    },
  }
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
})
