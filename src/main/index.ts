import type AppContoller from './controller/index.controller'
import path, { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron'
import { initContoller } from './controller/init'
import { setupAutoLaunch } from './utils'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    title: '定时播报',
    icon: path.join(__dirname, '../../resources/timer.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  // 创建系统托盘
  const tray = new Tray(path.join(__dirname, '../../resources/timer.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        mainWindow.show()
      },
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setToolTip('定时播报')
  tray.setContextMenu(contextMenu)

  // 点击托盘图标切换窗口显示/隐藏
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    }
    else {
      mainWindow.show()
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.title = '定时播报'
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', (event) => {
    event.reply('pong', { message: 'copy that.', time: new Date().getTime() })
  })

  createWindow()
  const appController = await initContoller()
  await appController.resetTimer()
  const isEnabled = await appController.getEnabled()
  if (isEnabled) {
    setupAutoLaunch(true)
  }
  ipcMain.handle('bridge', async (_event, method: keyof AppContoller, params?: any) => {
    return appController[method](params) as Promise<unknown>
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
