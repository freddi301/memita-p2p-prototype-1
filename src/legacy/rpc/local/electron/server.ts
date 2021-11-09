import { ipcMain } from "electron";
import { localRpcServerAdapter } from "../adapter";
import { LOCAL_RCP_ELECTRON_CHANNEL } from "./common";

ipcMain.on(LOCAL_RCP_ELECTRON_CHANNEL, async (event, arg) => {
  try {
    await localRpcServerAdapter(arg, (response) =>
      event.reply(LOCAL_RCP_ELECTRON_CHANNEL, response)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
