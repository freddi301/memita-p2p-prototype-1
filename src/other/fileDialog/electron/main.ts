import { ipcMain, dialog } from "electron";

ipcMain.on("select-files", async (event, parsed) => {
  const result = await dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
  event.reply("select-files", result.filePaths);
});
