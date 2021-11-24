import { ipcMain, dialog } from "electron";
import path from "path";

ipcMain.on("select-files", async (event, parsed) => {
  const result = await dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
  event.reply(
    "select-files",
    result.filePaths.map((filePath) => {
      return {
        name: path.basename(filePath),
        src: { type: "path", path: filePath },
      };
    })
  );
});
