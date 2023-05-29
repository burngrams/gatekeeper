export interface ElectronAPI {
  ip: string
  getIp: () => Promise<string>
  getAllocationsModeSetting: () => Promise<boolean>
  allocationsModeSetting: boolean
  toggleAllocationsModeSetting: (mode: boolean) => Promise<void>
}
