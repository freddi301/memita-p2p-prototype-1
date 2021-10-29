import { makeRpcClient } from "../../framework/rpc-framework";
import { jsonSerializable } from "../../framework/rpc-framwork-json-serializable";
import { localRpcDefinition } from "../localRpcDefinition";
import { RPC_WEBSOCKET_PORT, RPC_WEBSOCKET_HOST } from "./rpc-websocket-common";

// TODO improve performance using only one message listener

let socket = new WebSocket(`ws://${RPC_WEBSOCKET_HOST}:${RPC_WEBSOCKET_PORT}`);
socket.addEventListener("open", (event) => {
  // console.log("websocket opened", event);
});
socket.addEventListener("close", (event) => {
  // console.log("websocket closed", event);
});
socket.addEventListener("error", (event) => {
  // console.log("websocket error", event);
});
const ready = new Promise<void>((resolve) => {
  socket.addEventListener("open", function listener(event) {
    resolve();
    socket.removeEventListener("open", listener);
  });
});

export const rpcWebsocketClient = makeRpcClient(
  jsonSerializable,
  localRpcDefinition(jsonSerializable),
  async ({ type, payload }) => {
    await ready;
    const requestId = Math.random();
    socket.send(
      JSON.stringify({
        requestId,
        type,
        payload,
      })
    );
    return new Promise((resolve) => {
      socket.addEventListener("message", function listener(event) {
        const parsed = JSON.parse(event.data);
        if (parsed.requestId === requestId) {
          resolve(parsed.payload);
          socket.removeEventListener("message", listener);
        }
      });
    });
  }
);
