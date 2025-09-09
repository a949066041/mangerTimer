interface IAppRouteItem {
  icon: string
  path: string
  title: string
  auth?: boolean
}

export interface IAppConfig {
  routers: IAppRouteItem[]
  apptitle: string
  appVersion: string
}

export default {
  apptitle: APP_TITLE,
} as IAppConfig
