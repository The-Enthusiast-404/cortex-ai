import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  chat: (messages: { role: 'user' | 'assistant'; content: string }[]) =>
    ipcRenderer.invoke('ollama:chat', messages),
  setModel: (modelName: string) => ipcRenderer.invoke('ollama:setModel', modelName),
  getModels: () => ipcRenderer.invoke('ollama:getModels')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
