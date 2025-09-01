import type { LocalDB, TimerPlanModel } from './db'
import dayjs from 'dayjs'
import { TIMER_PLAN } from './db'

export class TimerPlanService {
  constructor(public localDB: LocalDB) {
  }

  async create(data: Omit<TimerPlanModel, 'id' | 'createTime' | 'updateTime'>) {
    return await this.localDB.db.table(TIMER_PLAN).insert({
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
    return await this.localDB.db.table(TIMER_PLAN).where('id', '=', id).delete()
  }

  async update(data: Omit<TimerPlanModel, 'createTime' | 'updateTime'>) {
    return await this.localDB.db
      .table(TIMER_PLAN)
      .where('id', '=', data.id)
      .update({
        ...data,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
  }

  async getAll() {
    console.log('select all')
    return await this.localDB.db.table<TimerPlanModel>(TIMER_PLAN).select('*')
  }
}
