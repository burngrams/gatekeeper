import { makeAutoObservable, autorun } from 'mobx'
import { PagesManager, pagesManager } from './pagesManager'

interface CredentialsModel {
  fullname: string
  ip: string
}

class CredentialsManager {
  credentials: null | CredentialsModel = null

  constructor() {
    makeAutoObservable(this)
  }

  get getIP() {
    return this.credentials?.ip
  }

  setCredentials(data: CredentialsModel | null) {
    const hasNewCameraData = !!data
    const isComingFromIntroPage = pagesManager.isPreviousPage(PagesManager.pages.intro)

    console.log('setNewCredentials', hasNewCameraData, isComingFromIntroPage)

    if (hasNewCameraData && isComingFromIntroPage) {
      // TODO check if credentials are valid
      this.credentials = data

      pagesManager.pop()
      pagesManager.replace(PagesManager.pages.gatekeeper)
    }
  }
}

export const credentialsManager = new CredentialsManager()
