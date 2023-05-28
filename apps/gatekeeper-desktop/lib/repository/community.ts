import { TicketModel } from '../models'
import { DatabaseLayer } from './data.types'

export const ticketToCommunity = (db: DatabaseLayer, ticket: TicketModel) => {
  const participant = db.data.participants.find((participant) => participant.participantId === ticket.participantId)

  if (!participant) {
    throw new Error('Participant not found')
  }

  const community = db.data.communities.find((community) => community.communityId === participant.communityId)

  if (!community) {
    throw new Error('Community not found')
  }

  return community
}
