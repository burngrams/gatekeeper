import { makeAutoObservable } from 'mobx'
import { credentialsManager } from './credentialsManager'
import { ticketManager } from './ticketManager'

class CameraManager {
  data = null

  constructor() {
    makeAutoObservable(this)
  }

  setData(rawData) {
    const data = JSON.parse(rawData)
    this.data = data

    console.log('cameraManager setData', data)

    credentialsManager.setCredentials(data)
    ticketManager.setTicket(data)
  }
}

export const cameraManager = new CameraManager()
