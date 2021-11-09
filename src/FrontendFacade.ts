import React from "react";

type Commands = {
  UpdateContact(publicKey: string, name: string, notes: string): void;
  DeleteContact(publickKey: string, name: string, notes: string): void;
};

type Queries = {
  ContactListSize(): number;
  ContactListAtIndex(index: number): { publicKey: string; name: string; notes: string } | null;
  ContactByPublicKey(publicKey: string): { name: string; notes: string } | null;
};

type CommandFacade = {
  [Key in keyof Commands as `do${Key}`]: (...args: Parameters<Commands[Key]>) => Promise<ReturnType<Commands[Key]>>;
};

type QueryFacade = {
  [Key in keyof Queries as `use${Key}`]: (...args: Parameters<Queries[Key]>) => ReturnType<Queries[Key]> | null;
};

const log: Array<{ [Key in keyof Commands]: [Key, ...Parameters<Commands[Key]>] }[keyof Commands]> = [];
const subscriptions = new Set<Subscription>();
type Subscription = {
  [Key in keyof Queries]: {
    query: [Key, Parameters<Queries[Key]>];
    listener(arg: ReturnType<Queries[Key]>): void;
  };
}[keyof Queries];

function notify({ query, listener }: Subscription) {
  const [key, ...parameters] = query;
  listener((queryInterpreter[key] as any)(...parameters));
}

const dispatchSingletonsByKey = makeSingletonByKey(
  <Key extends keyof Commands>(name: Key) =>
    (...args: Parameters<Commands[Key]>) => {
      log.push([name, ...args] as any);
      for (const subscription of Array.from(subscriptions)) {
        notify(subscription);
      }
    }
);

const subscribeSingletonByKey = makeSingletonByKey(
  <Key extends keyof Queries>(key: Key) =>
    (...args: Parameters<Queries[Key]>): ReturnType<Queries[Key]> | null => {
      const [state, setState] = React.useState<ReturnType<Queries[Key]> | null>(null);
      React.useLayoutEffect(() => {
        const subscription = { query: [key, ...args], listener: setState } as any as Subscription;
        subscriptions.add(subscription as any);
        notify(subscription);
        return () => {
          subscriptions.delete(subscription as any);
        };
        // eslint-disable-next-line
      }, args);
      return state;
    }
);

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

type QueryInterpreter = { [Key in keyof Queries]: (...args: Parameters<Queries[Key]>) => ReturnType<Queries[Key]> };

const queryInterpreter: QueryInterpreter = {
  ContactListSize() {
    const contactMap = getContactMap();
    return Object.keys(contactMap).length;
  },
  ContactListAtIndex(index) {
    const contactList = getContactList();
    return contactList[index] ?? null;
  },
  ContactByPublicKey(publicKey) {
    const contactMap = getContactMap();
    const existing = contactMap[publicKey];
    if (!existing) return null;
    const { name, notes } = existing;
    return { name, notes };
  },
};

type CommandInterpreter<Return> = { [Key in keyof Commands]: (...args: Parameters<Commands[Key]>) => Return };

function getContactMap() {
  type ContactMap = Record<string, { name: string; notes: string }>;
  return log.reduce((contactMap: ContactMap, action) => {
    const commandInterpreter: CommandInterpreter<ContactMap> = {
      DeleteContact(publicKey) {
        const { [publicKey]: deleted, ...rest } = contactMap;
        return rest;
      },
      UpdateContact(publicKey, name, notes) {
        return { ...contactMap, [publicKey]: { name, notes } };
      },
    };
    const [actionName, ...actionParams] = action;
    return commandInterpreter[actionName](...actionParams);
  }, {});
}

function getContactList() {
  const contactMap = getContactMap();
  return Object.entries(contactMap)
    .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
