import { ipcMain } from "electron";
import { copyFile, createReadStream, mkdir } from "fs";
import { filesFactory } from "../../../logic/asyncMerkle/asyncMerkle";
import path from "path";
import { filesFolderPath } from "../../../logic/folderPaths";

mkdir(filesFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});

ipcMain.on("file-hash", async (event, filePath) => {
  filesFactory.to(readFileByChunks(filePath, 256000)).then((hash) => {
    const hashString = Buffer.from(hash).toString("hex");
    event.reply("file-hash", {
      path: filePath,
      hash: hashString,
    });
    copyFile(filePath, path.resolve(filesFolderPath, hashString), (error) => {
      if (error) console.error(error);
    });
  });
});

async function* readFileByChunks(path: string, chunkSize: number) {
  for await (const piece_ of createReadStream(path)) {
    const piece = piece_ as Buffer;
    let i = 0;
    for (; i + chunkSize < piece.length; i += chunkSize) {
      yield Uint8Array.from(piece.slice(i, i + chunkSize));
    }
    yield Uint8Array.from(piece.slice(i)); // TODO manage leftover
  }
}
