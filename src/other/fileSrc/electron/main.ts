import { ipcMain } from "electron";
import path from "path";
import { filesFolderPath } from "../../folderPaths";

ipcMain.on("file-src", async (event, hash) => {
  event.reply("file-src", {
    hash,
    src: path.resolve(filesFolderPath, hash),
  });
});
