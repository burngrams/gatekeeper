import { makeAutoObservable } from 'mobx'
import { PagesManager, pagesManager } from './pagesManager'
import Toast from 'react-native-toast-message'
import { trpc, trpcReact } from './trpcReact'
import { TicketModel } from 'gatekeeper-desktop/lib/models'

export class TicketMangaer {
  currentTicket: null | TicketModel = null

  constructor() {
    makeAutoObservable(this)
  }

  *setTicket(ticketData) {
    console.log('setTicket', ticketData)
    if (ticketData.ticketId && pagesManager.page === PagesManager.pages.gatekeeper) {
      const { ticket } = yield trpc.tickets.get.query({ ticketId: ticketData.ticketId })
      this.currentTicket = ticket
      console.log('ticket', ticket)

      const { ticket: newTicket } = yield trpc.tickets.updateStatus.mutate({
        isInside: !ticket.isInside,
        ticketId: ticket.ticketId,
      })
      this.currentTicket = newTicket
      console.log('newTicket', newTicket)

      Toast.show({
        type: 'success',
        text1: 'Ticket updated',
        text2: `Ticket ${newTicket.ticketId} is now ${newTicket.isInside ? 'inside' : 'outside'}`,
      })
    }
  }
}

export const ticketManager = new TicketMangaer()
