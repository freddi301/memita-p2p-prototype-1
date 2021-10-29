import React from "react";
import { localRpcElectronRenderer } from "./rpc/local/electron/client";
import { localRpcWebsocketClient } from "./rpc/local/websocket/client";

const rpc = localRpcElectronRenderer ?? localRpcWebsocketClient;

export function useReadRpcCall<Method extends keyof typeof rpc, Initial>(
  method: Method,
  request: Parameters<typeof rpc[Method]>[0],
  initialValue: Initial
) {
  const [response, setResponse] = React.useState<
    Initial | Awaited<ReturnType<typeof rpc[Method]>>
  >(initialValue);
  const [forceReload, setForceReload] = React.useState(0);
  const reload = React.useCallback(() => {
    setForceReload((n) => n + 1);
  }, []);
  React.useEffect(() => {
    let active = true;
    rpc[method](request as any).then((response) => {
      if (active) {
        setResponse(response as any);
      }
    });
    return () => {
      active = false;
    };
  }, [method, request, forceReload]);
  return { response, reload };
}

export function doWriteRpcCall<Method extends keyof typeof rpc>(
  method: Method,
  request: Parameters<typeof rpc[Method]>[0]
): ReturnType<typeof rpc[Method]> {
  return rpc[method](request as any) as any;
}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
