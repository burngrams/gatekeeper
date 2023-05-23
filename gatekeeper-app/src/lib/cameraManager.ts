import { makeAutoObservable } from 'mobx'
import { credentialsManager } from './credentialsManager'
import { ticketManager } from './ticketManager'

class CameraManager {
  data = null
  i = 0

  constructor() {
    makeAutoObservable(this)
  }

  setData(rawData) {
    const data = JSON.parse(rawData)
    this.data = data
    this.i++

    console.log('cameraManager setData', this.i, data)

    credentialsManager.setCredentials(data)
    ticketManager.setTicket(data)
  }
}

export const cameraManager = new CameraManager()
