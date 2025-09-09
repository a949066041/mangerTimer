import type { Knex } from 'knex'
import { join } from 'node:path'
import consola from 'consola'
import { app } from 'electron'
import knex from 'knex'

export const TIMER_PLAN = 'timer_plan'
export const TIMER_RECORD = 'timer_record'
export interface TimerPlanModel {
  id: number
  name: string
  file: string
  timer: string
  open: boolean
  createTime: string
  updateTime: string
}

export interface TimerRecord {
  id: number
  execTimer: string
  parentId: TimerPlanModel['id']
}

export class LocalDB {
  declare db: Knex
  async init() {
    this.db = knex({
      client: 'sqlite',
      useNullAsDefault: true,
      connection: {
        filename: join(app.getPath('userData'), 'timerManger.db'),
      },
    })
    consola.success(
      `db path create success:${join(app.getPath('userData'), 'timerManger.db')}`,
    )
    // 新建表
    await this.sync()
  }

  async sync() {
    await this.db.schema.hasTable(TIMER_PLAN).then((exist) => {
      if (exist)
        return
      return this.db.schema.createTable(TIMER_PLAN, (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('name')
        table.string('file')
        table.string('timer')
        table.boolean('open')
        table.string('createTime')
        table.string('updateTime')
      })
    })

    await this.db.schema.hasTable(TIMER_RECORD).then((exist) => {
      if (exist)
        return
      return this.db.schema.createTable(TIMER_RECORD, (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('execTimer')
        table.bigInteger('parentId')
      })
    })
  }
}
