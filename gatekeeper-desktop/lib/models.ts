export interface TicketModel {
  ticketId: string
  participantId: string
  isInside: boolean
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

export interface DatabaseModel {
  tickets: TicketModel[]
  gatekeepers: GatekeeperModel[]
  shifts: ShiftModel[]
  participants: ParticipantModel[]
}
