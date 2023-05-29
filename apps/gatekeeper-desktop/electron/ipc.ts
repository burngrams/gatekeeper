import { BrowserWindow, ipcMain } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'
import { appRouter } from '../lib'
import { ElectronAPI } from '../preload/ElectronAPI'

export const setupIPCHandlers = (win: BrowserWindow) => {
  createIPCHandler({ router: appRouter, windows: [win] })
  const handlers: Partial<ElectronAPI> = {
    getIp: () => require('ip').address(),
    getAllocationsModeSetting: async () => {
      return true
    },
    toggleAllocationsModeSetting: async (mode: boolean) => {
      console.log('setAllocationsMode', mode)
    },
  }
  Object.keys(handlers).forEach((key) => {
    ipcMain.handle(key, handlers[key])
  })
  console.log(`Running from ${require('ip').address()}...`)
}
