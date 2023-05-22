import { Low } from 'lowdb'
import { DatabaseModel } from '../models'

export type DatabaseLayer = Low<DatabaseModel>
