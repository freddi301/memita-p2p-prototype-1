import React from "react";
import { localRpcWebsocketClient } from "../rpc/local/websocket/client";
import { Commands, Queries } from "./domain";

const store = localRpcWebsocketClient;

// frontend machinery
type CommandFacade = {
  [Key in keyof Commands as `do${Key}`]: (...args: Parameters<Commands[Key]>) => Promise<ReturnType<Commands[Key]>>;
};
type QueryFacade = {
  [Key in keyof Queries as `use${Key}`]: (...args: Parameters<Queries[Key]>) => ReturnType<Queries[Key]> | null;
};

export const FrontendFacade: CommandFacade & QueryFacade = new Proxy(
  {},
  {
    get(target, property) {
      if (typeof property === "string" && property.startsWith("use")) {
        const query = property.slice(3) as keyof Queries;
        return subscribeSingletonByKey(query);
      } else if (typeof property === "string" && property.startsWith("do")) {
        const command = property.slice(2) as keyof Commands;
        return dispatchSingletonsByKey(command);
      } else {
        throw new Error();
      }
    },
  }
) as any;
const dispatchSingletonsByKey = makeSingletonByKey(
  <Key extends keyof Commands>(name: Key) =>
    (...args: Parameters<Commands[Key]>) => {
      (store.command[name] as any)(...args);
    }
);
const subscribeSingletonByKey = makeSingletonByKey(
  <Key extends keyof Queries>(key: Key) =>
    (...args: Parameters<Queries[Key]>): ReturnType<Queries[Key]> | null => {
      const [state, setState] = React.useState<ReturnType<Queries[Key]> | null>(null);
      React.useLayoutEffect(() => {
        return (store.query[key] as any)(...args)(setState);
        // eslint-disable-next-line
      }, args);
      return state;
    }
);
function makeSingletonByKey<Key, Value>(factory: (key: Key) => Value) {
  const cache = new Map<Key, Value>();
  return (key: Key) => {
    const cached = cache.get(key);
    if (cached) return cached;
    const created = factory(key);
    cache.set(key, created);
    return created;
  };
}
