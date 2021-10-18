import { ipcMain } from "electron";
import { localRpcServerAdapter } from "../localRpcServerAdapter";
import { RCP_ELECTRON_CHANNEL } from "./rpc-electron-common";

ipcMain.on(RCP_ELECTRON_CHANNEL, async (event, arg) => {
  localRpcServerAdapter(arg, (response) => event.reply(response));
});
