import { makeRpcClient } from "../../framework/rpc-framework";
import { jsonSerializable } from "../../framework/rpc-framwork-json-serializable";
import { localRpcDefinition } from "../localRpcDefinition";
import { RCP_ELECTRON_CHANNEL } from "./rpc-electron-common";

// TODO improve performance using only one subscribe

export const rpcElectronRenderer = window.rendererIpc
  ? makeRpcClient(
      jsonSerializable,
      localRpcDefinition(jsonSerializable),
      ({ type, payload }) => {
        const requestId = Math.random();
        window.rendererIpc.send(RCP_ELECTRON_CHANNEL, {
          requestId,
          type,
          payload,
        });
        return new Promise((resolve) => {
          const unsubscribe = window.rendererIpc.subscribe(
            RCP_ELECTRON_CHANNEL,
            (arg) => {
              if (arg.requestId === requestId) {
                resolve(arg.payload);
                unsubscribe();
              }
            }
          );
        });
      }
    )
  : null;
