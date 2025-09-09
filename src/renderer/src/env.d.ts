/// <reference types="@rsbuild/core/types" />

declare const APP_TITLE: string

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
