import type { TimerPlanModel } from '~~/src/main/db/db'
import type { TimerService } from '~~/src/main/db/db-service'

const ipcFn = window.electron.ipcRenderer.invoke

function ipcFetch<T>(methods: keyof TimerService, params?: unknown) {
  return ipcFn('bridge', methods, params) as Promise<T>
}

export function findTimerList() {
  return ipcFetch<TimerPlanModel[]>(
    'getAll',
  )
}

export function createTimer(data: Parameters<TimerService['create']>[0]) {
  return ipcFetch<number>(
    'create',
    data,
  )
}

export function updateTimer(data: Parameters<TimerService['update']>[0]) {
  return ipcFetch<number>(
    'update',
    data,
  )
}

export function findTimer(id: TimerPlanModel['id']) {
  return ipcFetch<TimerPlanModel>(
    'get',
    id,
  )
}

export function deleteTimer(id: number) {
  return ipcFetch<number>(
    'delete',
    id,
  )
}

export function getAppVersion() {
  return ipcFetch<string>(
    'getAppVersion',
  )
}

export function saveData() {
  return ipcFetch<string>(
    'saveData',
  )
}

export function startSchedule() {
  return ipcFetch<number>(
    'resetTimer',
  )
}
