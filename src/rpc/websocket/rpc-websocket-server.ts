import { WebSocketServer } from "ws";
import { jsonSerializable } from "../framework/rpc-framwork-json-serializable";
import { localRpcDefinition } from "../localRpcDefinition";
import { localRpcInterpreter } from "../localRpcInterpreter";
import { RPC_WEBSOCKET_PORT } from "./rpc-websocket-common";

const interpreter = localRpcInterpreter(jsonSerializable);
const definition = localRpcDefinition(jsonSerializable);

definition.saveContact.request.deserialize;

const wss = new WebSocketServer({ port: RPC_WEBSOCKET_PORT });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const parsed = JSON.parse(message.toString());
    const requestId = parsed.requestId;
    if (!(parsed.type in definition)) throw new Error();
    const parsedType: keyof typeof definition = parsed.type;
    ws.send(
      JSON.stringify({
        requestId,
        payload: definition[parsedType].response.serialize(
          interpreter[parsedType](
            definition[parsedType].request.deserialize(parsed.payload)
          )
        ),
      })
    );
  });
});
