import type { LocalDB } from '../db'
import type { TimerRecord } from '../types'
import { TIMER_RECORD } from '../db'

export class RecordService {
  protected localDB: LocalDB

  constructor(db: LocalDB) {
    this.localDB = db
  }

  async createRecord(data: Omit<TimerRecord, 'id'>) {
    return await this.localDB.db.table(TIMER_RECORD).insert(data)
  }

  async getRecord(id: number) {
    return await this.localDB.db
      .table<TimerRecord>(TIMER_RECORD)
      .select('*')
      .where('parentId', '=', id)
      .orderBy('id', 'desc')
  }
}
