import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import AutoLaunch from 'auto-launch'
import { app, dialog } from 'electron'
import { first } from 'lodash-es'
import { v4 } from 'uuid'
import { setupAutoLaunch } from '../utils'

export const TIMER_PLAN_DIR = 'timer-plan'

export class ElectronService {
  constructor() {
  }

  getAppVersion(): string {
    return app.getVersion()
  }

  async saveData() {
    const value = await dialog.showOpenDialogSync({
      title: '选择文件',
      buttonLabel: '选择',
      properties: ['showHiddenFiles', 'openFile'],
    })

    const filePath = first(value)
    if (!filePath)
      return
    const appDir = app.getPath('userData')
    const newFileName = v4()
    const savePath = join(appDir, TIMER_PLAN_DIR)
    if (!existsSync(savePath))
      mkdirSync(savePath, { recursive: true })
    const ext = filePath.split('.').pop()
    const newFlePath = join(savePath, `${newFileName}.${ext}`)
    await copyFileSync(filePath, newFlePath)
    return newFlePath
  }

  async getEnabled() {
    const autoLauncher = new AutoLaunch({
      name: app.getName(),
      path: process.execPath,
    })
    return await autoLauncher.isEnabled()
  }

  async switchEnabled() {
    const currentEnabled = await this.getEnabled()
    return await setupAutoLaunch(!currentEnabled)
  }
}
