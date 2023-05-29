import { ElectronAPI } from '../preload/ElectronAPI'

export const electronAPI: ElectronAPI = window['electronAPI']

console.log('electronAPI.allocationsModeSetting', electronAPI.allocationsModeSetting)
