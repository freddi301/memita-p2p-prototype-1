import _ from "lodash";
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
  type Subscription = { query: (states: typeof initialState) => any; listener: (value: any) => void; lastValue: any };
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
          for (const subscription of Array.from(subscriptions)) {
            const newValue = subscription.query(newState);
            if (!_.isEqual(newValue, subscription.lastValue)) {
              subscription.listener(newValue);
              subscription.lastValue = newValue;
            }
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
            const query = (states: typeof initialState) => (queries(states)[property as keyof Queries] as any)(...args);
            const lastValue = query(currentState);
            const subscription: Subscription = {
              query,
              listener,
              lastValue,
            };
            subscriptions.add(subscription);
            listener(lastValue);
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
