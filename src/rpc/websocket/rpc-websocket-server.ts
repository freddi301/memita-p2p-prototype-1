import { WebSocketServer } from "ws";
import { jsonSerializable } from "../framework/rpc-framwork-json-serializable";
import { localRpcDefinition } from "../localRpcDefinition";
import { localRpcInterpreter } from "../localRpcInterpreter";
import { localRpcServerAdapter } from "../localRpcServerAdapter";
import { RPC_WEBSOCKET_PORT } from "./rpc-websocket-common";

export const interpreter = localRpcInterpreter(jsonSerializable);
export const definition = localRpcDefinition(jsonSerializable);

const wss = new WebSocketServer({ port: RPC_WEBSOCKET_PORT });

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    await localRpcServerAdapter(JSON.parse(message.toString()), (response) =>
      ws.send(JSON.stringify(response))
    );
  });
});
