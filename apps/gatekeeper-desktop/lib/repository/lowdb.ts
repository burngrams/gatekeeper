import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { DatabaseModel } from '../models'
import { DatabaseLayer, defaultData } from './data.types'
import path from 'node:path'

let db: DatabaseLayer = null as any

export function getSyncDatabase() {
  if (!db) throw new Error('Database not loaded')

  return db
}

export async function getDatabase() {
  if (db) return db
  db = await load()

  return db
}

async function load(): Promise<typeof db> {
  const downloadsDirPath = require('downloads-folder')()
  const file = path.join(downloadsDirPath, 'db.json')

  // Configure lowdb to write data to JSON file
  const adapter = new JSONFile<DatabaseModel>(file)
  const db: DatabaseLayer = new Low(adapter, defaultData)

  // Read data from JSON file, this will set db.data content
  // If JSON file doesn't exist, defaultData is used instead
  await db.read()
  await db.write()
  return db
}
