import multer from "multer";
import { app } from "../../../rpc/local/websocket/server";
import { filesFactory } from "../../asyncMerkle/asyncMerkle";
import { uploadsFolderPath, filesFolderPath } from "../../folderPaths";
import { readFileByChunks } from "../../readFileByChunks";
import { LOCAL_RPC_WEBSOCKET_PATH } from "../../../rpc/local/websocket/common";
import fs from "fs";
import path from "path";

const upload = multer({ dest: uploadsFolderPath });

app.post(LOCAL_RPC_WEBSOCKET_PATH, upload.single("file"), async (req, res, next) => {
  if (!req.file) throw new Error();
  const filePath = req.file.path;
  const hash = await filesFactory.to(readFileByChunks(filePath));
  await fs.promises.copyFile(filePath, path.resolve(filesFolderPath, hash));
  await fs.promises.unlink(filePath);
  res.status(200).end(hash);
});
