import { Commands, Queries } from "../../../logic/domain";
import { RemoteCommands, RemoteQueries } from "../../../logic/plumbing";
import { LOCAL_RPC_WEBSOCKET_PORT, LOCAL_RPC_WEBSOCKET_HOST } from "./common";

// TODO improve performance using only one message listener

let socket = new WebSocket(`ws://${LOCAL_RPC_WEBSOCKET_HOST}:${LOCAL_RPC_WEBSOCKET_PORT}`);
socket.addEventListener("open", (event) => {
  // console.log("websocket opened", event);
});
socket.addEventListener("close", (event) => {
  // console.log("websocket closed", event);
});
socket.addEventListener("error", (event) => {
  // console.log("websocket error", event);
});

let isReady = false;
const ready = new Promise<void>((resolve) => {
  socket.addEventListener("open", function listener(event) {
    isReady = true;
    resolve();
    socket.removeEventListener("open", listener);
  });
});

export const localRpcWebsocketClient: {
  command: RemoteCommands;
  query: RemoteQueries;
} = {
  command: new Proxy(
    {},
    {
      get(target, property) {
        return <Key extends keyof Commands>(...args: Parameters<Commands[Key]>) => {
          const name = property as Key;
          const id = Math.random().toString();
          if (isReady) {
            socket.send(
              JSON.stringify({
                id,
                type: "command",
                name,
                args,
              })
            );
          }
        };
      },
    }
  ) as RemoteCommands,
  query: new Proxy(
    {},
    {
      get(target, property) {
        return <Key extends keyof Queries>(...args: Parameters<Queries[Key]>) =>
          (listener: (value: ReturnType<Queries[Key]>) => void) => {
            const name = property as Key;
            const id = Math.random().toString();
            if (isReady) {
              socket.send(
                JSON.stringify({
                  id,
                  type: "query",
                  name,
                  args,
                })
              );
            }
            const onMessage = (event: MessageEvent<any>) => {
              const parsed = JSON.parse(event.data);
              if (parsed.id === id) {
                listener(parsed.value);
              }
            };
            socket.addEventListener("message", onMessage);
            return () => {
              socket.removeEventListener("message", onMessage);
              socket.send(
                JSON.stringify({
                  id,
                  type: "unsubscribe",
                })
              );
            };
          };
      },
    }
  ) as RemoteQueries,
};
