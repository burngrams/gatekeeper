import { makeAutoObservable, autorun } from 'mobx'
import { PagesManager, pagesManager } from './pagesManager';

class CredentialsManager {
	credentials = null;


	constructor() {
		makeAutoObservable(this)
	}

	setCredentials(data) {
		const newCameraData = !!data
		const isComingFromIntroPage = pagesManager.isPreviousPage(PagesManager.pages.intro)

		console.log('setNewCredentials', newCameraData, isComingFromIntroPage)

		if (newCameraData && isComingFromIntroPage) {
			// TODO check if credentials are valid
			this.credentials = data

			pagesManager.pop()
			pagesManager.replace(PagesManager.pages.gatekeeper)
		}
	}

}

export const credentialsManager = new CredentialsManager();