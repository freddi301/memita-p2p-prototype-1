import { definition, interpreter } from "./websocket/rpc-websocket-server";

export async function localRpcServerAdapter(
  request: any,
  reply: (response: unknown) => void
) {
  if (!(request instanceof Object)) throw new Error();
  if (!("requestId" in request)) throw new Error();
  const requestId = (request as any).requestId;
  if (!((request as any).type in definition)) throw new Error();
  const parsedType: keyof typeof definition = request.type;
  const deserializedRequest = definition[parsedType].request.deserialize(
    request.payload
  );
  const deserializedResponse = await interpreter[parsedType](
    deserializedRequest as any
  );
  const serializedResponse = (definition[parsedType].response.serialize as any)(
    deserializedResponse
  );
  reply({
    requestId,
    payload: serializedResponse,
  });
}