import { ipcMain } from "electron";
import path from "path";
import { filesFolderPath } from "../../folderPaths";
import { watchFile } from "../watchFiles";

ipcMain.on("file-src", async (event, hash) => {
  const abort = watchFile(filesFolderPath, hash, () => {
    event.reply("file-src", {
      hash,
      src: path.resolve(filesFolderPath, hash),
    });
    abort();
  });
});
