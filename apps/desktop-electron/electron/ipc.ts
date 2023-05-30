import { BrowserWindow, ipcMain } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'
import { appRouter } from '../lib'
import { ServerElectronAPI } from '../preload/ElectronAPI'
import { getDatabase } from '../lib/repository/lowdb'

export const setupIPCHandlers = (win: BrowserWindow) => {
  createIPCHandler({ router: appRouter, windows: [win] })
  const handlers: ServerElectronAPI = {
    getIp: () => require('ip').address(),
    getAllocationsModeSetting: async () => {
      const db = await getDatabase()

      return db.data.settings.runningInAllocationsMode
    },
    toggleAllocationsModeSetting: async () => {
      const db = await getDatabase()

      db.data.settings.runningInAllocationsMode = !db.data.settings.runningInAllocationsMode
      console.log(
        '🚀 ~ file: ipc.ts:20 ~ toggleAllocationsModeSetting: ~ db.data.settings.runningInAllocationsMode:',
        db.data.settings.runningInAllocationsMode
      )

      await db.write()
    },
  }
  Object.keys(handlers).forEach((key) => {
    ipcMain.handle(key, handlers[key])
  })
  console.log(`Running from ${require('ip').address()}...`)
}
