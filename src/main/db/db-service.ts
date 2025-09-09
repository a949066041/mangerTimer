import type { TimerPlanModel, TimerRecord } from './db'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import dayjs from 'dayjs'
import { app, dialog } from 'electron'
import { first } from 'lodash-es'
import { v4 } from 'uuid'
import { timerSchedule } from '../schedule'
import { LocalDB, TIMER_PLAN, TIMER_RECORD } from './db'

export const TIMER_PLAN_DIR = 'timer-plan'

export class TimerService {
  protected localDB: LocalDB

  constructor() {
    this.localDB = new LocalDB()
  }

  async init() {
    await this.localDB.init()
  }

  getAppVersion(): string {
    return app.getVersion()
  }

  async create(data: Omit<TimerPlanModel, 'id' | 'createTime' | 'updateTime'>) {
    await this.localDB.db.table(TIMER_PLAN).insert({
      ...data,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    this.resetTimer()
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
    this.resetTimer()
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
    this.resetTimer()
  }

  async getAll() {
    return await this.localDB.db.table<TimerPlanModel>(TIMER_PLAN).select('*')
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

  async getOpenData() {
    return await this.localDB.db
      .table(TIMER_PLAN)
      .where('open', '=', true)
      .select('*')
  }

  async saveData() {
    const value = await dialog.showOpenDialogSync({
      title: '对话框窗口的标题',
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

  async switchOpen(id: number) {
    const timer = await this.get(id)
    if (!timer)
      return
    await this.update({
      ...timer,
      open: !timer.open,
    })
    this.resetTimer()
  }

  async resetTimer() {
    timerSchedule.initAllTimer()
  }
}

export const timerService = new TimerService()
