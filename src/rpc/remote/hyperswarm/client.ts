import { Connection } from "hyperswarm";
import { makeRpcClient } from "../../framework/rpc-framework";
import { jsonSerializable } from "../../framework/description-implementations/json-serializable";
import { localRpcDefinition } from "../../local/definition";

export function makeRpcHyperswarmClient(connection: Connection) {
  return makeRpcClient(
    jsonSerializable,
    localRpcDefinition(jsonSerializable),
    async ({ type, payload }) => {
      const requestId = Math.random();
      connection.write(
        Buffer.from(
          JSON.stringify({
            requestId,
            type,
            payload,
          })
        )
      );
      return new Promise((resolve) => {
        connection.on("data", function listener(data) {
          const parsed = JSON.parse(data.toString());
          if (parsed.requestId === requestId) {
            resolve(parsed.payload);
            // TODO
            // connection.removeEventListener("message", listener);
          }
        });
      });
    }
  );
}
