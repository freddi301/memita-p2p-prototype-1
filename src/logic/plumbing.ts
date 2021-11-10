import { Commands, Queries } from "./domain";

export type RemoteCommands = { [Key in keyof Commands]: (...args: Parameters<Commands[Key]>) => void };
export type RemoteQueries = {
  [Key in keyof Queries]: (
    ...args: Parameters<Queries[Key]>
  ) => (listener: (value: ReturnType<Queries[Key]>) => void) => () => void;
};

type CommandInterpreter<Return> = { [Key in keyof Commands]?: (...args: Parameters<Commands[Key]>) => Return };
type CommandInterpreterReducer<State> = (state: State) => CommandInterpreter<State>;
type QueryInterpreter = { [Key in keyof Queries]: (...args: Parameters<Queries[Key]>) => ReturnType<Queries[Key]> };

export function makeStore<Reducers extends Record<string, CommandInterpreterReducer<any>>>(
  reducers: Reducers,
  initialState: { [Key in keyof Reducers]: Parameters<Reducers[Key]>[0] },
  queries: (states: typeof initialState) => QueryInterpreter
): {
  command: RemoteCommands;
  query: RemoteQueries;
  currentState: typeof initialState;
} {
  let currentState = initialState;
  type Subscription = { query: (states: typeof initialState) => any; listener: (value: any) => void };
  const subscriptions = new Set<Subscription>();
  const command = new Proxy(
    {},
    {
      get(target, property) {
        const commandName = property as keyof Commands;
        return <CommandName extends keyof Commands>(...args: Parameters<Commands[CommandName]>) => {
          const newState = Object.fromEntries(
            Object.entries(reducers).map(([reducerName, reducer]) => {
              const handler = reducer(currentState[reducerName])[commandName] as any;
              return [reducerName, handler ? handler(...args) : currentState[reducerName]];
            })
          ) as typeof initialState;
          currentState = newState;
          for (const { query, listener } of Array.from(subscriptions)) {
            listener(query(newState));
          }
        };
      },
    }
  ) as RemoteCommands;
  const query = new Proxy(
    {},
    {
      get(target, property) {
        return <Key extends keyof Queries>(...args: Parameters<Queries[Key]>) =>
          (listener: (value: ReturnType<Queries[Key]>) => void) => {
            const subscription: Subscription = {
              query: (states) => (queries(states)[property as keyof Queries] as any)(...args),
              listener,
            };
            subscriptions.add(subscription);
            listener(subscription.query(currentState));
            return () => subscriptions.delete(subscription);
          };
      },
    }
  ) as RemoteQueries;
  return {
    command,
    query,
    get currentState() {
      return currentState;
    },
    set currentState(newState: typeof initialState) {
      currentState = newState;
    },
  };
}
