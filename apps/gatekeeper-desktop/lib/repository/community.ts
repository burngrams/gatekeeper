import { getSyncDatabase } from './lowdb'

export interface CommunityModel {
  communityId: string
  name: string
  totalAllocations: number
  allocationsUsed: number
}

export function getCommunity(communityId: string) {
  const communities: CommunityModel[] = getSyncDatabase().data.communities

  const community = communities.find((c) => c.communityId === communityId)

  if (!community) throw new Error('Community not found')

  return community
}
