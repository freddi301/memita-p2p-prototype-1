import React from "react";
import ReactDOM from "react-dom";
import libsodium from "libsodium-wrappers";
import { RemoteCommands, RemoteQueries } from "./other/plumbing";
import isElectron from "is-electron";

export let frontendStore: { command: RemoteCommands; query: RemoteQueries };

(async () => {
  await libsodium.ready;
  const { App } = await import("./ui/App");
  if (isElectron()) {
    const { localRpcRendererClient } = await import("./rpc/local/electron/renderer");
    frontendStore = localRpcRendererClient;
  } else {
    const { localRpcWebsocketClient } = await import("./rpc/local/websocket/client");
    frontendStore = localRpcWebsocketClient;
  }
  ReactDOM.render(<App />, document.getElementById("root"));
})();
