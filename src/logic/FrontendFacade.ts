import React from "react";

// logic

type Commands = {
  UpdateContact(publicKey: string, name: string, notes: string): void;
  DeleteContact(publickKey: string): void;
  CreateAccount(name: string, notes: string): void;
  UpdateAccount(publicKey: string, name: string, notes: string): void;
  DeleteAccount(publickKey: string): void;
};

type Queries = {
  ContactListSize(): number;
  ContactListAtIndex(index: number): { publicKey: string; name: string; notes: string } | null;
  ContactByPublicKey(publicKey: string): { name: string; notes: string } | null;
  AccountListSize(): number;
  AccountListAtIndex(index: number): { publicKey: string; name: string; notes: string } | null;
  AccountByPublicKey(publicKey: string): { name: string; notes: string } | null;
};

const store = makeStore(
  {
    contactMap(contactMap: Record<string, { name: string; notes: string }>) {
      return {
        UpdateContact(publicKey, name, notes) {
          return { ...contactMap, [publicKey]: { name, notes } };
        },
        DeleteContact(publicKey) {
          const { [publicKey]: deleted, ...rest } = contactMap;
          return rest;
        },
      };
    },
    accountMap(accountMap: Record<string, { privateKey: string; name: string; notes: string }>) {
      return {
        CreateAccount(name, notes) {
          const publicKey = Math.random().toString(16);
          const privateKey = Math.random().toString(16);
          return { ...accountMap, [publicKey]: { name, notes, privateKey } };
        },
        UpdateAccount(publicKey, name, notes) {
          const existing = accountMap[publicKey];
          if (!existing) return accountMap;
          const { privateKey } = existing;
          return { ...accountMap, [publicKey]: { name, notes, privateKey } };
        },
        DeleteAccount(publicKey) {
          const { [publicKey]: deleted, ...rest } = accountMap;
          return rest;
        },
      };
    },
  },
  { contactMap: {}, accountMap: {} },
  ({ contactMap, accountMap }) => {
    const contactList = Object.entries(contactMap)
      .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const accountList = Object.entries(accountMap)
      .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      ContactListSize() {
        return contactList.length;
      },
      ContactListAtIndex(index) {
        return contactList[index] ?? null;
      },
      ContactByPublicKey(publicKey) {
        const existing = contactMap[publicKey];
        if (!existing) return null;
        const { name, notes } = existing;
        return { name, notes };
      },
      AccountListSize() {
        return accountList.length;
      },
      AccountListAtIndex(index) {
        return accountList[index] ?? null;
      },
      AccountByPublicKey(publicKey) {
        const existing = accountMap[publicKey];
        if (!existing) return null;
        const { name, notes } = existing;
        return { name, notes };
      },
    };
  }
);

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

// machinery

type CommandInterpreter<Return> = { [Key in keyof Commands]?: (...args: Parameters<Commands[Key]>) => Return };
type CommandInterpreterReducer<State> = (state: State) => CommandInterpreter<State>;
type QueryInterpreter = { [Key in keyof Queries]: (...args: Parameters<Queries[Key]>) => ReturnType<Queries[Key]> };

function makeStore<Reducers extends Record<string, CommandInterpreterReducer<any>>>(
  reducers: Reducers,
  initialState: { [Key in keyof Reducers]: Parameters<Reducers[Key]>[0] },
  queries: (states: typeof initialState) => QueryInterpreter
) {
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
  ) as Commands;
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
  ) as {
    [Key in keyof Queries]: (
      ...args: Parameters<Queries[Key]>
    ) => (listener: (value: ReturnType<Queries[Key]>) => void) => () => void;
  };
  // setInterval(() => {
  //   console.log(currentState);
  // }, 1000);
  return { command, query };
}
