import { makeAutoObservable, autorun } from 'mobx'
import { PagesManager, pagesManager } from './pagesManager'

interface CredentialsModel {
  fullname: string
  ip: string
}

const mockCredentials = { fullname: 'Dan', ip: '10.0.0.15' }
class CredentialsManager {
  ssid: string | null = null
  credentials: null | CredentialsModel = mockCredentials

  constructor() {
    makeAutoObservable(this)
  }

  setCredentials(data: CredentialsModel | null, ssid: string) {
    const hasNewCameraData = !!data
    const isComingFromIntroPage = pagesManager.isPreviousPage(PagesManager.pages.intro)

    if (hasNewCameraData && isComingFromIntroPage) {
      // TODO check if credentials are valid
      this.credentials = data

      pagesManager.pop()
      pagesManager.replace(PagesManager.pages.gatekeeper)
    }
  }
}

export const credentialsManager = new CredentialsManager()

export const useCredentialsManager = () => {
  return {
    login: (data: any) => {
      // TODO ssid should be retrieved from the expo-network
      const ssid = 'ssid'
      credentialsManager.setCredentials(data, ssid)
    },
  }
}
