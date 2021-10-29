import { makeRpcClient } from "../../framework/rpc-framework";
import { jsonSerializable } from "../../framework/description-implementations/json-serializable";
import { localRpcDefinition } from "../definition";
import { LOCAL_RPC_WEBSOCKET_PORT, LOCAL_RPC_WEBSOCKET_HOST } from "./common";

// TODO improve performance using only one message listener

let socket = new WebSocket(
  `ws://${LOCAL_RPC_WEBSOCKET_HOST}:${LOCAL_RPC_WEBSOCKET_PORT}`
);
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

export const localRpcWebsocketClient = makeRpcClient(
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
