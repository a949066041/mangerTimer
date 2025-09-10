import { LocalDB } from '../db'
import { ElectronService, RecordService, ScheduleService, TimerService } from '../service'
import AppContoller from './index.controller'

export async function initContoller() {
  const localDb = new LocalDB()
  await localDb.init()
  const electronService = new ElectronService()
  const timerService = new TimerService(localDb)
  const recordService = new RecordService(localDb)
  const scheduleService = new ScheduleService(recordService)
  return new AppContoller(electronService, timerService, scheduleService, recordService)
}
