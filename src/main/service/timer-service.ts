import type { LocalDB } from '../db'
import type { TimerPlanModel } from '../types'
import dayjs from 'dayjs'
import { TIMER_PLAN } from '../db'

export class TimerService {
  protected localDB: LocalDB

  constructor(db: LocalDB) {
    this.localDB = db
  }

  async create(data: Omit<TimerPlanModel, 'id' | 'createTime' | 'updateTime'>) {
    await this.localDB.db.table(TIMER_PLAN).insert({
      ...data,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  async get(id: number) {
    return await this.localDB.db
      .table<TimerPlanModel>(TIMER_PLAN)
      .select('*')
      .where('id', '=', id)
      .first()
  }

  async delete(id: number) {
    const timer = await this.get(id)
    if (!timer)
      return
    await this.localDB.db.table(TIMER_PLAN).where('id', '=', id).delete()
    return id
  }

  async update(data: Omit<TimerPlanModel, 'createTime' | 'updateTime'>) {
    await this.localDB.db
      .table(TIMER_PLAN)
      .where('id', '=', data.id)
      .update({
        ...data,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
  }

  async switchOpen(id: number) {
    const timer = await this.get(id)
    if (!timer)
      return
    await this.localDB.db
      .table(TIMER_PLAN)
      .where('id', '=', id)
      .update({
        open: !timer.open,
      })
  }

  async getAll() {
    return await this.localDB.db.table<TimerPlanModel>(TIMER_PLAN).select('*')
  }

  async getOpenData() {
    return await this.localDB.db
      .table(TIMER_PLAN)
      .where('open', '=', true)
      .select('*')
  }
}
