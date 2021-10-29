import { makeRpcClient } from "../../framework/rpc-framework";
import { jsonSerializable } from "../../framework/description-implementations/json-serializable";
import { localRpcDefinition } from "../definition";
import { LOCAL_RCP_ELECTRON_CHANNEL } from "./common";

// TODO improve performance using only one subscribe

export const localRpcElectronRenderer = window.rendererIpc
  ? makeRpcClient(
      jsonSerializable,
      localRpcDefinition(jsonSerializable),
      ({ type, payload }) => {
        const requestId = Math.random();
        window.rendererIpc.send(LOCAL_RCP_ELECTRON_CHANNEL, {
          requestId,
          type,
          payload,
        });
        return new Promise((resolve) => {
          const unsubscribe = window.rendererIpc.subscribe(
            LOCAL_RCP_ELECTRON_CHANNEL,
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
