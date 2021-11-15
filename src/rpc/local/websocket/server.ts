import { WebSocketServer } from "ws";
import { LOCAL_RPC_WEBSOCKET_PORT } from "./common";
import { store } from "../../../logic/domain";

const wss = new WebSocketServer({ port: LOCAL_RPC_WEBSOCKET_PORT }, () => {
  console.log(`server started on port ${LOCAL_RPC_WEBSOCKET_PORT}`);
});

wss.on("connection", (ws) => {
  const subscriptionMap: Record<string, () => void> = {};
  ws.on("message", async (message) => {
    const parsed = JSON.parse(message.toString());
    switch (parsed.type) {
      case "command": {
        (store.command as any)[parsed.name](...parsed.args);
        break;
      }
      case "query": {
        subscriptionMap[parsed.id] = (store.query as any)[parsed.name](...parsed.args)((value: any) => {
          ws.send(JSON.stringify({ id: parsed.id, value }));
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
