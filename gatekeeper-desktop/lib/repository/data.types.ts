import { Low } from 'lowdb'
import { DatabaseModel } from '../models'

export type DatabaseLayer = Low<DatabaseModel>

export const defaultData: DatabaseModel = {
  tickets: [
    {
      ticketId: 'always-existing-test-id',
      participantId: '123456789',
      isInside: false,
    },
  ],
  gatekeepers: [],
  shifts: [],
  participants: [],
}
