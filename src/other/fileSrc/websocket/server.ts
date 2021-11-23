import express from "express";
import { LOCAL_RPC_WEBSOCKET_PATH } from "../../../rpc/local/websocket/common";
import { app } from "../../../rpc/local/websocket/server";
import { filesFolderPath } from "../../folderPaths";
import { waitUntilFileExists } from "../../fileUtils";

app.use(
  LOCAL_RPC_WEBSOCKET_PATH,
  (req, res, next) => {
    const abort = waitUntilFileExists(filesFolderPath, req.path.slice(1), () => {
      next();
      abort();
    });
  },
  express.static(filesFolderPath)
);
