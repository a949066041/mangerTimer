/// <reference types="@rsbuild/core/types" />

import type { TimerPlanModel } from '~~/src/main/db/db'

declare const APP_TITLE: string
declare const APP_VERSION: string

declare interface Window {
  Bridge?: {
    selectAll: () => Promise<TimerPlanModel[]>
  }
}
