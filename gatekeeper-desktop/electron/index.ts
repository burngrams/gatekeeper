import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'
import { createServer } from './server'
import { appRouter } from '../lib'

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
