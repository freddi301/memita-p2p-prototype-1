import { DateTime } from "luxon";
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
    const all = await rpc.allContacts({
      orderBy: { type: "name-ascending", payload: null },
    });
    setAll(all);
  }, []);
  React.useEffect(() => {
    getAll();
  }, [getAll]);
  return { data: all, reload: getAll };
}

export function useCreateDraft() {
  const createDraft = ({ text }: { text: string }) => {
    return rpc.createDraft({ text });
  };
  return createDraft;
}

export function useAllDrafts() {
  const [all, setAll] = React.useState<
    Array<{ id: string; text: string; updatedAt: DateTime }>
  >([]);
  const getAll = React.useCallback(async () => {
    const all = await rpc.allDrafts({
      orderBy: { type: "date-descending", payload: null },
    });
    setAll(all);
  }, []);
  React.useEffect(() => {
    getAll();
  }, [getAll]);
  return { data: all, reload: getAll };
}

export function useDraftEdit(id: string) {
  const [text, setText] = React.useState("");
  const setText_ = (text: string) => {
    setText(text);
    rpc.updateDraft({ id, text });
  };
  React.useEffect(() => {
    let active = true;
    rpc.draftById({ id }).then((draft) => {
      if (active) {
        setText(draft.text);
      }
    });
    return () => {
      active = false;
    };
  }, [id, setText]);
  return { text, setText: setText_ };
}
