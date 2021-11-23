import { ipcMain } from "electron";
import path from "path";
import { filesFolderPath } from "../../folderPaths";
import { waitUntilFileExists } from "../../fileUtils";

ipcMain.on("file-src", async (event, hash) => {
  const abort = waitUntilFileExists(filesFolderPath, hash, () => {
    event.reply("file-src", {
      hash,
      src: path.resolve(filesFolderPath, hash),
    });
    abort();
  });
});
