export interface ClientElectronAPI {
  ip: string
  allocationsModeSetting: boolean
  toggleAllocationsModeSetting: () => Promise<void>
}

export interface ServerElectronAPI {
  getIp: () => Promise<string>
  getAllocationsModeSetting: () => Promise<boolean>
  toggleAllocationsModeSetting: () => Promise<void>
}
