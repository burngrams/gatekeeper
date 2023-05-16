import { makeAutoObservable } from 'mobx'

export class PagesManager {
	page = 'intro'

	constructor() {
		makeAutoObservable(this)
	}

	setPage(page) {
		this.page = page
	}

	static pages = {
		intro: 'intro',
		login: 'login',
	}
}

export const pagesManager = new PagesManager()