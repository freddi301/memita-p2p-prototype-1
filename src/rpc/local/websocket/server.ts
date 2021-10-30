import { WebSocketServer } from "ws";
import { localRpcServerAdapter } from "../adapter";
import { LOCAL_RPC_WEBSOCKET_PORT } from "./common";

const wss = new WebSocketServer({ port: LOCAL_RPC_WEBSOCKET_PORT }, () => {
  console.log(`server started on port ${LOCAL_RPC_WEBSOCKET_PORT}`);
});

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    try {
      await localRpcServerAdapter(JSON.parse(message.toString()), (response) =>
        ws.send(JSON.stringify(response))
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
