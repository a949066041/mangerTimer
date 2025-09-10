import type { Job } from 'node-schedule'
import type { TimerPlanModel } from '../types'
import type { RecordService } from './record-service'
import consola from 'consola'
import dayjs from 'dayjs'
import schedule from 'node-schedule'
import soundPlay from 'sound-play'

export class ScheduleService {
  protected schedule: Map<number, Job> = new Map()
  protected timerList: TimerPlanModel[] = []
  protected recordService: RecordService

  constructor(
    recordService: RecordService,
  ) {
    this.recordService = recordService
  }

  getSchedule() {
    return this.schedule
  }

  async openTimer(timerList: TimerPlanModel[]) {
    this.cancelAll()
    this.timerList = timerList
    timerList.forEach((timer) => {
      this.start(timer)
    })
  }

  start(timer: TimerPlanModel) {
    const job = this.schedule.get(timer.id)
    if (job) {
      this.cancel(timer.id)
    }
    consola.success(`start timer ${timer.id}`, timer)
    const newJob = schedule.scheduleJob(timer.timer, () => {
      consola.info(`exec timer ${timer.id}`)
      this.recordService.createRecord({
        execTimer: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        parentId: timer.id,
      })
      soundPlay.play(timer.file)
    })
    this.schedule.set(timer.id, newJob)
  }

  cancel(id: number) {
    const job = this.schedule.get(id)
    if (job) {
      job.cancel()
      this.schedule.delete(id)
    }
  }

  cancelAll() {
    this.schedule.entries().forEach(([id, job]) => {
      consola.success(`cancel timer ${id}`)
      job.cancel()
    })
    this.schedule.clear()
  }
}
