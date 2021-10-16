import { IpcRendererEvent, ipcRenderer, contextBridge } from "electron";

const rendererIpc = {
  send(channel: string, arg: any) {
    ipcRenderer.send(channel, arg);
  },
  subscribe(channel: string, listener: (arg: any) => void) {
    const subscription = (event: IpcRendererEvent, arg: any) => listener(arg);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld("rendererIpc", rendererIpc);

declare global {
  interface Window {
    rendererIpc: typeof rendererIpc;
  }
}
