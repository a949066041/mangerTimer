import type { ElectronService } from '../service/electron-service'
import type { RecordService } from '../service/record-service'
import type { ScheduleService } from '../service/schedule-service'
import type { TimerService } from '../service/timer-service'

export default class AppContoller {
  constructor(
    protected electronService: ElectronService,
    protected timerService: TimerService,
    protected scheduleService: ScheduleService,
    protected recordService: RecordService,
  ) {
  }

  async resetTimer() {
    const openList = await this.timerService.getOpenData()
    await this.scheduleService.openTimer(openList)
  }

  async getAppVersion() {
    return await this.electronService.getAppVersion()
  }

  async getTimerList() {
    return await this.timerService.getAll()
  }

  async createTimer(data: Parameters<TimerService['create']>[0]) {
    await this.timerService.create(data)
    await this.resetTimer()
  }

  async updateTimer(data: Parameters<TimerService['update']>[0]) {
    await this.timerService.update(data)
    await this.resetTimer()
  }

  async deleteTimer(id: Parameters<TimerService['delete']>[0]) {
    await this.timerService.delete(id)
    await this.resetTimer()
  }

  async switchOpen(id: Parameters<TimerService['switchOpen']>[0]) {
    await this.timerService.switchOpen(id)
    await this.resetTimer()
  }

  async getRecordList(id: Parameters<RecordService['getRecord']>[0]) {
    return await this.recordService.getRecord(id)
  }

  async saveFile() {
    return await this.electronService.saveData()
  }

  async getEnabled() {
    const isEnabled = await this.electronService.getEnabled()
    return isEnabled
  }

  async switchEnabled() {
    return await this.electronService.switchEnabled()
  }

  async getSchedule() {
    return await this.scheduleService.getCurrentSchedule()
  }
}
