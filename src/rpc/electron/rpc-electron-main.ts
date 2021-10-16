import { ipcMain, ipcRenderer } from "electron";
import { RCP_ELECTRON_CHANNEL } from "./rpc-electron-common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

ipcMain.on(RCP_ELECTRON_CHANNEL, async (event, arg) => {
  console.log(arg);
  // TODO
});
