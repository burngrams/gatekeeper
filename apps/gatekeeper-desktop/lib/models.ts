export interface TicketModel {
  ticketId: string
  participantId: string
  isInside: boolean
  hasBeenScanned: boolean
}

export interface GatekeeperModel {
  gatekeeperId: string
  fullname: string
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
}

export interface OperationLogModel {
  operationId: string
  gatekeeperId: string
  // the actual data of what has been modified
  jsondiff: string
  timestamp: Date
}

export type AuditlogModel = OperationLogModel[]

export interface DatabaseModel {
  tickets: TicketModel[]
  gatekeepers: GatekeeperModel[]
  participants: ParticipantModel[]
  auditlog: AuditlogModel
}
