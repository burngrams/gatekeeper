export interface TicketModel {
  ticketId: string
  participantId: string
  isInside: boolean
  hasBeenScanned: boolean
}

export interface GatekeeperModel {
  gatekeeperId: string
  fullname: string
  isActive: boolean
}

export interface ShiftModel {
  shiftId: string
  gatekeeperId: string
  startTime: Date
  endTime: Date
}

export interface ParticipantModel {
  participantId: string
  fullname: string
  communityId: string
}

export interface OperationLogModel {
  operationId: string
  gatekeeperId?: string
  // the actual data of what has been modified
  jsondiff: string
  timestamp: Date
}

export interface CommunityModel {
  communityId: string
  name: string
  currentlyInside: number
  maxAllowedInside: number
}

export type AuditlogModel = OperationLogModel[]

export interface SettingsModel {
  runningInAllocationsMode: boolean
}

export interface DatabaseModel {
  tickets: TicketModel[]
  gatekeepers: GatekeeperModel[]
  participants: ParticipantModel[]
  auditlog: AuditlogModel
  communities: CommunityModel[]
  settings: SettingsModel
}
