import { WebSocketServer } from "ws";
import { localRpcServerAdapter } from "../localRpcServerAdapter";
import { RPC_WEBSOCKET_PORT } from "./rpc-websocket-common";

require("source-map-support").install(); // need for node

const wss = new WebSocketServer({ port: RPC_WEBSOCKET_PORT }, () => {
  console.log(`server started on port ${RPC_WEBSOCKET_PORT}`);
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
