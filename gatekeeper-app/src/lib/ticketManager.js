import { makeAutoObservable } from 'mobx';
import { PagesManager, pagesManager } from './pagesManager';
import Toast from 'react-native-toast-message';

export class TicketMangaer {
	currentTicket = null;

	constructor() {
		makeAutoObservable(this)
	}

	setTicket(ticketData) {
		console.log('setTicket', ticketData);
		if (ticketData.ticketId && pagesManager.page === PagesManager.pages.gatekeeper) {
			this.currentTicket = ticketData;

			ticketData.isStatusInside = !ticketData.isStatusInside;

			Toast.show({
				'type': 'success',
				'text1': 'Ticket updated',
				'text2': `Ticket ${ticketData.ticketId} is now ${ticketData.isStatusInside ? 'inside' : 'outside'}`
			})
		}
	}
}

export const ticketManager = new TicketMangaer();