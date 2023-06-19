import { app, shell, BrowserWindow, dialog, ipcMain, protocol, nativeImage, Tray, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import performPostRequest from './performPostRequest'
import { readdirSync, copyFileSync } from "fs"
// import icon from "../../resources/icon.icns?asset"
import * as path from "path"



let galleryPath


const handleRecognizeFaces = async (event, data) => {
  const response = await performPostRequest(
    {path: galleryPath, faces: data.map(value => "data:image/png;base64," + value)},
    "/get_recognized_faces2"
  )
  return response
}

const handleSaveFiles = async (event, paths:string[]) => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if(!canceled){
    const newFolderPath = filePaths[0]


    paths.forEach((_path, index) => {
      const [,fileExt] = _path.split(".")
      copyFileSync(_path, path.join(newFolderPath, `${index}.${fileExt}`))
    })
  }
  return {canceled}

}

const handleButtonFolder = async (event, data) => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if(!canceled){
    galleryPath = filePaths[0]
    const fileNames = readdirSync(filePaths[0])
    const photoPaths = fileNames
      .filter(fileName => fileName.includes(".jpg") || fileName.includes(".png")) 
      .map(fileName => path.join(filePaths[0], fileName))

    return {canceled, photoPaths}
  }
  return {canceled}
}

const handleFindFaces = async (event, path) => {
  const response = await performPostRequest({path}, "/get_dict_emotions")
  return response
}

const handleFilterImages = async(event, data) => {
  const response = await performPostRequest(data, "/get_filtered_images")
  return response
}


function createWindow(): void {
  // Create the browser window.
  // let tray = new Tray(nativeImage.createFromPath(icon))


  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    title: "Ceboolean",
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    resizable: false
  })



  mainWindow.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')


  protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.slice('atom://'.length)
    callback({path: url})
  })

  ipcMain.handle("dark-mode:system", () => { nativeTheme.themeSource = "system"})
  ipcMain.handle('button-folder', handleButtonFolder)
  ipcMain.handle('find-faces', handleFindFaces)
  ipcMain.handle('recognize-faces', handleRecognizeFaces)
  ipcMain.handle('filter-images', handleFilterImages)
  ipcMain.handle('save-images', handleSaveFiles)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

  

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
