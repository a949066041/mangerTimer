import type { Knex } from 'knex'
import { join } from 'node:path'
import consola from 'consola'
import { app } from 'electron'
import knex from 'knex'

export const TIMER_PLAN = 'timer_plan'
export const TIMER_RECORD = 'timer_record'

export class LocalDB {
  declare db: Knex

  constructor() {
  }

  async init() {
    const dbFilePath = join(app.getPath('userData'), 'timerManger.db')
    this.db = knex({
      client: 'sqlite',
      useNullAsDefault: true,
      connection: {
        filename: dbFilePath,
      },
    })
    consola.success(
      `db path create success:${dbFilePath}`,
    )
    await this.sync()
  }

  async syncTimerPlan() {
    const isExist = await this.db.schema.hasTable(TIMER_PLAN)
    if (isExist) {
      const execNum = await this.db.schema.hasColumn(TIMER_PLAN, 'execNum')
      if (!execNum) {
        await this.db.schema.alterTable(TIMER_PLAN, (table) => {
          table.integer('execNum').defaultTo(1)
        })
      }
      return
    }
    await this.db.schema.createTable(TIMER_PLAN, (table) => {
      table.bigIncrements('id', { primaryKey: true })
      table.string('name')
      table.string('file')
      table.string('timer')
      table.boolean('open')
      table.integer('execNum').defaultTo(1)
      table.string('createTime')
      table.string('updateTime')
    })
  }

  async syncTimerRecord() {
    const isExist = await this.db.schema.hasTable(TIMER_RECORD)
    if (isExist) {
      return
    }
    await this.db.schema.createTable(TIMER_RECORD, (table) => {
      table.bigIncrements('id', { primaryKey: true })
      table.string('execTimer')
      table.bigInteger('parentId')
    })
  }

  async sync() {
    await this.syncTimerPlan()

    await this.syncTimerRecord()
  }
}
