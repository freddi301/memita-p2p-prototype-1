import { ipcMain, ipcRenderer } from "electron";
import { RCP_ELECTRON_CHANNEL } from "./rpc-electron-common";

ipcMain.on(RCP_ELECTRON_CHANNEL, async (event, arg) => {
  console.log(arg);
  // TODO
});
