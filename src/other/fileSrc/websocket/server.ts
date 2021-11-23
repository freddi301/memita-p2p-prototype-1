import express from "express";
import { LOCAL_RPC_WEBSOCKET_PATH } from "../../../rpc/local/websocket/common";
import { app } from "../../../rpc/local/websocket/server";
import { filesFolderPath } from "../../folderPaths";

app.use(LOCAL_RPC_WEBSOCKET_PATH, express.static(filesFolderPath));
