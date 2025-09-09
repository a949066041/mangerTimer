import type { TimerService } from './main/db/db-service'

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (bridge: 'bridge', channel: keyof TimerService, data?: unknown) => Promise<unknown>
      }
    }
  }
}
