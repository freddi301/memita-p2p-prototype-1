import React from "react";
import { rpcElectronRenderer } from "./rpc/electron/rpc-electron-renderer";
import { AccountPublicKey } from "./rpc/localRpcDefinition";
import { rpcWebsocketClient } from "./rpc/websocket/rpc-websocket-client";

const rpc = rpcElectronRenderer ?? rpcWebsocketClient;

export function useSaveContact() {
  const save = ({
    name,
    accountPublicKey,
  }: {
    name: string;
    accountPublicKey: AccountPublicKey;
  }) => {
    rpc.saveContact({ name, accountPublicKey });
  };
  return save;
}

export function useAllContacts() {
  const [all, setAll] = React.useState<
    Array<{ name: string; accountPublicKey: AccountPublicKey }>
  >([]);
  const getAll = React.useCallback(async () => {
    console.log("bug");
    const all = await rpc.allContacts({
      orderBy: { type: "name-ascending", payload: null },
    });
    console.log(all);
    setAll(all);
  }, []);
  React.useEffect(() => {
    getAll();
  }, [getAll]);
  console.log(all);
  return { data: all, reload: getAll };
}
