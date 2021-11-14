import { ipcMain } from "electron";
import { LOCAL_RCP_ELECTRON_CHANNEL } from "./common";

ipcMain.on(LOCAL_RCP_ELECTRON_CHANNEL, (event, arg) => {
  event.reply(LOCAL_RCP_ELECTRON_CHANNEL, {});
});
