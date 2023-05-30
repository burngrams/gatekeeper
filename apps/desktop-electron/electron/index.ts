// TODO move to root folder for better readability
import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'
import { appRouter } from '../lib'
import { generateContext } from '../lib/trpc/context'
import { getDatabase } from '../lib/repository/lowdb'
import express from 'express'
import cors from 'cors'

// IMPORT TRPC SERVER
// npm i @trpc/server
import { createExpressMiddleware } from '@trpc/server/adapters/express'

// * IMPORT TRPC WEBSOCKET SERVER (WSS)
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { setupIPCHandlers } from './ipc'

// * IMPORT WEBSOCKET
// this actually doesnt work, but require does. Maybe related to electron
// because it works in https://github.com/emanuelefavero/trpc-web-socket-subscriptions
// import * as WS from 'ws'
const WS = require('ws')

async function createServer() {
  const lowdb = await getDatabase()
  const createContext = await generateContext(lowdb)
  const app = express()
  app.use(cors({ origin: 'http://localhost:5173' })) // cors for client

  // Add the TRPC middleware to express (express specific)
  // http://localhost:3000/trpc
  app.use(
    // Create route for trpc
    '/',
    createExpressMiddleware({
      // Pass the router
      router: appRouter, // * <- router
      // Add context to the server (req.ctx)
      createContext, // * <- context
    })
  )

  // * ADD A WEB SOCKET LISTENER
  const server = app.listen(3000) // * <- server

  applyWSSHandler({
    wss: new WS.Server({ server }), // * <- pass the server
    router: appRouter, // * <- pass the router
    createContext, // * <- pass the context
  })
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

  setupIPCHandlers(win)

  if (url) {
    win.loadURL(url)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }

  win.show()
  win.webContents.openDevTools()

  const autoUpdater = require('electron-updater')

  autoUpdater.checkForUpdatesAndNotify()
})
