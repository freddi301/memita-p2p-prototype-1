import { ipcMain } from "electron";
import fs from "fs";
import { filesFactory } from "../../asyncMerkle/asyncMerkle";
import path from "path";
import { filesFolderPath } from "../../folderPaths";
import { readFileByChunks } from "../../readFileByChunks";

ipcMain.on("file-hash", async (event, filePath) => {
  const hash = await filesFactory.to(readFileByChunks(filePath));
  const hashString = Buffer.from(hash).toString("hex");
  event.reply("file-hash", { path: filePath, hash: hashString });
  await fs.promises.copyFile(filePath, path.resolve(filesFolderPath, hashString));
});
