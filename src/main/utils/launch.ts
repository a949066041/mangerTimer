import AutoLaunch from 'auto-launch'
import consola from 'consola'
import { app } from 'electron'

/**
 * 设置应用开机自启动
 * @param enable 是否启用自启动，默认为true
 * https://www.cnblogs.com/risheng/p/18797426
 */
export function setupAutoLaunch(enable: boolean = true): Promise<void> {
  return new Promise((resolve, reject) => {
    const autoLauncher = new AutoLaunch({
      name: app.getName(),
      path: process.execPath,
    })
    autoLauncher.isEnabled().then(() => {
      const switchAction = enable ? autoLauncher.enable : autoLauncher.disable
      switchAction().then(() => {
        consola.info(`已${enable ? '启用' : '禁用'}自启动`)
        resolve()
      }).catch((err) => {
        consola.error(`操作自启动失败: ${err}`)
        reject(err)
      })
    })
  })
}
