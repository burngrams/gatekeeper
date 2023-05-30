import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { DatabaseModel } from '../models'
import { DatabaseLayer, defaultData } from './data.types'
import path from 'node:path'

export const getDatabase = async () => {
  const file = path.join(require('downloads-folder')(), 'db.json')

  // Configure lowdb to write data to JSON file
  const adapter = new JSONFile<DatabaseModel>(file)
  const db: DatabaseLayer = new Low(adapter, defaultData)

  // Read data from JSON file, this will set db.data content
  // If JSON file doesn't exist, defaultData is used instead
  await db.read()
  await db.write()

  return db
}
