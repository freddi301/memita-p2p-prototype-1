import { WebSocketServer } from "ws";
import express from "express";
import { LOCAL_RPC_WEBSOCKET_PORT } from "./common";
import { store } from "../../../other/domain";
import { JSONB } from "../../../other/JSONB";

export const app = express();

const server = app.listen(LOCAL_RPC_WEBSOCKET_PORT, () => {
  console.log(`server started on port ${LOCAL_RPC_WEBSOCKET_PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const subscriptionMap: Record<string, () => void> = {};
  ws.on("message", async (message) => {
    const parsed = JSONB.parse(message.toString()) as any;
    switch (parsed.type) {
      case "command": {
        (store.command as any)[parsed.name](...parsed.args);
        break;
      }
      case "query": {
        subscriptionMap[parsed.id] = (store.query as any)[parsed.name](...parsed.args)((value: any) => {
          ws.send(JSONB.stringify({ id: parsed.id, value }));
        });
        break;
      }
      case "unsubscribe": {
        subscriptionMap[parsed.id]?.();
        delete subscriptionMap[parsed.id];
      }
    }
  });
});
