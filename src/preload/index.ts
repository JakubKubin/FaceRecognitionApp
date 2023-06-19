import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  buttonFolder: () => ipcRenderer.invoke("button-folder", ""),
  findFaces: (path) => ipcRenderer.invoke("find-faces", path),
  recognizeFaces: (faces) => ipcRenderer.invoke("recognize-faces", faces),
  filterImages: (data) => ipcRenderer.invoke("filter-images", data),
  saveImages: (paths) => ipcRenderer.invoke("save-images", paths)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
