import { makeAutoObservable, autorun } from 'mobx'
import { PagesManager, pagesManager } from './pagesManager'

class CredentialsManager {
  ssid: string | null = null
  fullname: string = 'Edgelord'
  serverIP: string = ''

  constructor() {
    makeAutoObservable(this)
  }
}

export const credentialsManager = new CredentialsManager()
