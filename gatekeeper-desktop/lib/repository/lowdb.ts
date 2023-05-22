// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { DatabaseModel } from '../models'
import { DatabaseLayer } from './types'

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile<DatabaseModel>(file)
const defaultData: DatabaseModel = { tickets: [], gatekeepers: [], shifts: [], participants: [] }
export const db: DatabaseLayer = new Low(adapter, defaultData)
