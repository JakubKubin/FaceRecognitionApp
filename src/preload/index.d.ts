import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: {
      buttonFolder: () => Promise<any>
      findFaces: (path) => Promise<any>
      recognizeFaces: (faces) => Promise<any>
      filterImages: (data) => Promise<any>
      saveImages: (paths) => Promise<any>
    }
    api: unknown
  }
}
