import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'
import { appRouter } from '../lib'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { generateContext } from '../lib/trpc/context'
import { getDatabase } from '../lib/repository/lowdb'

async function createServer() {
  const lowdb = await getDatabase()
  const createContext = await generateContext(lowdb)

  const server = createHTTPServer({
    router: appRouter,
    createContext,
  })

  server.listen(3000)
  console.log('Listening on port 3000...')
}

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

const preload = path.join(__dirname, './preload.js')
const url = process.env['VITE_DEV_SERVER_URL']

app.on('ready', () => {
  createServer()

  const win = new BrowserWindow({
    webPreferences: {
      preload,

      webSecurity: process.env.NODE_ENV === 'production',
    },
  })

  createIPCHandler({ router: appRouter, windows: [win] })
  ipcMain.handle('getIp', () => require('ip').address())
  console.log(`Running from ${require('ip').address()}...`)

  if (url) {
    win.loadURL(url)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }

  win.show()
})
