import { WebSocketServer } from "ws";
import { jsonSerializable } from "../framework/rpc-framwork-json-serializable";
import { localRpcDefinition } from "../localRpcDefinition";
import { localRpcInterpreter } from "../localRpcInterpreter";
import { localRpcServerAdapter } from "../localRpcServerAdapter";
import { RPC_WEBSOCKET_PORT } from "./rpc-websocket-common";

require("source-map-support").install(); // need for node

export const interpreter = localRpcInterpreter(jsonSerializable);
export const definition = localRpcDefinition(jsonSerializable);

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
