// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { DatabaseModel } from './models'
import { DatabaseLayer } from './repository/types'

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile<DatabaseModel>(file)
const defaultData: DatabaseModel = { tickets: [], gatekeepers: [], shifts: [], participants: [] }
const db: DatabaseLayer = new Low(adapter, defaultData)

// Read data from JSON file, this will set db.data content
// If JSON file doesn't exist, defaultData is used instead
await db.read()

export default db
