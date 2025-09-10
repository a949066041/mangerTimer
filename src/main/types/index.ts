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
