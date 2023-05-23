import { TicketModel } from 'gatekeeper-desktop/lib/models'
import { makeAutoObservable } from 'mobx'
import Toast from 'react-native-toast-message'
import { PagesManager, pagesManager } from './pagesManager'

export class TicketMangaer {
  currentTicket: null | TicketModel = null

  constructor() {
    makeAutoObservable(this)
  }

  *setTicket(ticketData) {
    if (ticketData.ticketId && pagesManager.page === PagesManager.pages.gatekeeper) {
      this.currentTicket = ticketData

      Toast.show({
        type: 'success',
        text1: 'Ticket updated',
        text2: `Ticket ${this.currentTicket.ticketId} is now ${this.currentTicket.isInside ? 'inside' : 'outside'}`,
      })
    }
  }
}

export const ticketManager = new TicketMangaer()
