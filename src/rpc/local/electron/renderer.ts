import { Commands, Queries } from "../../../logic/domain";
import { RemoteCommands, RemoteQueries } from "../../../logic/plumbing";
import { LOCAL_RCP_ELECTRON_CHANNEL } from "./common";

export const localRpcRendererClient: {
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
          window.rendererIpc.send(LOCAL_RCP_ELECTRON_CHANNEL, {
            id,
            type: "command",
            name,
            args,
          });
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
            window.rendererIpc.send(LOCAL_RCP_ELECTRON_CHANNEL, {
              id,
              type: "query",
              name,
              args,
            });
            const unsubscribe = window.rendererIpc.subscribe(LOCAL_RCP_ELECTRON_CHANNEL, (parsed: any) => {
              if (parsed.id === id) {
                listener(parsed.value);
              }
            });
            return () => {
              unsubscribe();
              window.rendererIpc.send(LOCAL_RCP_ELECTRON_CHANNEL, {
                id,
                type: "unsubscribe",
              });
            };
          };
      },
    }
  ) as RemoteQueries,
};
