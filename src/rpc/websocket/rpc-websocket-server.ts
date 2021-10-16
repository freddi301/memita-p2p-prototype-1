import { WebSocketServer } from "ws";
import { RPC_WEBSOCKET_PORT } from "./rpc-websocket-common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const wss = new WebSocketServer({ port: RPC_WEBSOCKET_PORT });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(message.toString());
    // TODO
  });
});
