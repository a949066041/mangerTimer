import type AppController from '~/main/controller/index.controller'
import type { TimerPlanModel, TimerRecord } from '~/main/types'

const ipcFn = window.electron.ipcRenderer.invoke

function ipcFetch<T>(methods: keyof AppController, params?: unknown) {
  return ipcFn('bridge', methods, params) as Promise<T>
}

export function findTimerList() {
  return ipcFetch<TimerPlanModel[]>(
    'getTimerList',
  )
}

export function createTimer(data: Parameters<AppController['createTimer']>[0]) {
  return ipcFetch<number>(
    'createTimer',
    data,
  )
}

export function updateTimer(data: Parameters<AppController['updateTimer']>[0]) {
  return ipcFetch<number>(
    'updateTimer',
    data,
  )
}

export function deleteTimer(id: Parameters<AppController['deleteTimer']>[0]) {
  return ipcFetch<number>(
    'deleteTimer',
    id,
  )
}

export function getAppVersion() {
  return ipcFetch<string>(
    'getAppVersion',
  )
}

export function saveFile() {
  return ipcFetch<string>(
    'saveFile',
  )
}

export function startSchedule() {
  return ipcFetch<number>(
    'resetTimer',
  )
}

export function switchOpen(id: number) {
  return ipcFetch<number>(
    'switchOpen',
    id,
  )
}

export function getRecord(id: number) {
  return ipcFetch<TimerRecord[]>(
    'getRecordList',
    id,
  )
}
