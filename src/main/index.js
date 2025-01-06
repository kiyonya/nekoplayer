import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import ncmapi from 'NeteaseCloudMusicApi/app'
import modules from './ncmapiModuleDef'
import { getQQPlaylist } from './plugins/qqmusic-import/request'
const path = require('path')
ncmapi.startNcmApi(11451, modules)
let mainWindow
let desktopLyric
function createWindow() {
  //创建窗口
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 1300,
    minHeight: 800,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity:false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (e) => {
    e.preventDefault()
    let choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['是', '再想想'],
      title: 'Confirm',
      message: '确定要关闭应用吗'
    })

    if (choice === 0) {
      mainWindow.destroy()
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('猫猫播放器')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('app:close', (e) => {
    e.preventDefault()
    app.quit()
  })
  ipcMain.on('app:minimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('app:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.handle('importer:getQQPlaylist', (e, id) => handleImportPlaylist(id))
  ipcMain.handle("dialog:openDir",handleDir)
  ipcMain.on("shell:openExplorer",(e,path)=>{openExplorer(path)})
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  //允许私有证书
  event.preventDefault()
  callback(true)
})

function createLyricWindow() {
  desktopLyric = new BrowserWindow({
    width: 500,
    height: 160,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    desktopLyric.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/desktoplyric')
  } else {
    console.log('进入electron statistic')
    desktopLyric.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'desktoplyric' })
  }

  setTimeout(() => {
    desktopLyric.show()
  }, 200)

  desktopLyric.on('close', () => {
    desktopLyric = undefined
  })
}

ipcMain.on('useDesktopLyric', (e) => {
  if (desktopLyric) {
    desktopLyric.close()
    desktopLyric = undefined
  } else {
    createLyricWindow()
  }
})

ipcMain.on('desktoplyric:winfix', () => {
  if (desktopLyric.isAlwaysOnTop()) {
    desktopLyric.setAlwaysOnTop(false)
  } else {
    desktopLyric.setAlwaysOnTop(true)
  }
})

//exportQQPlaylist(1431344459)
async function handleImportPlaylist(id) {
  const data = await getQQPlaylist(id)
  return data
}
async function handleDir(type) {
  const path = await dialog.showOpenDialog({
    title: '选择目录',
    buttonLabel: '选择喵',
    properties: ['openDirectory']
  })
  if (!path.canceled) {
    return path.filePaths[0]
  }
  else{
    return false
  }
}

async function openExplorer(pathname) {
  shell.openPath(path.join(pathname,"/"))
}