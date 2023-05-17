import { makeAutoObservable } from 'mobx';
import { PagesManager, pagesManager } from './pagesManager';

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
		}
	}
}

export const ticketManager = new TicketMangaer();