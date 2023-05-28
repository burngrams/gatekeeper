import { CommunityModel, getCommunity } from './community'
import { cantIncreaseAllocations } from './errors'

function canIncreaseUsedAllocation(community: CommunityModel) {
  const allocationsRequested = community.allocationsUsed + 1
  const canAllocate = allocationsRequested <= community.totalAllocations

  return canAllocate
}

function canIncreaseOrError(community: CommunityModel) {
  const canAllocate = canIncreaseUsedAllocation(community)

  if (!canAllocate) throw cantIncreaseAllocations()
}

export function increaseUsedAllocations(communityId: string) {
  const community = getCommunity(communityId)

  canIncreaseOrError(community)

  community.allocationsUsed += 1

  return community
}
