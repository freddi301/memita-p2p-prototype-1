import libsodium from "libsodium-wrappers";

type Block = { type: "leaf"; data: Uint8Array } | { type: "branch"; branches: Array<string> };

type Action =
  | {
      type: "load";
      id: string;
      data: Uint8Array;
    }
  | {
      type: "unload";
      id: string;
    };

type State = {
  filesMap: Record<string, string>;
  blocksMap: BlocksMap;
};

type BlocksMap = Record<string, { block: Block; referenceCount: number }>;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load": {
      const [hash, blocks] = chunk(action.data);
      const existing = Record.get(state.filesMap, action.id);
      const extendedBlocksMap = Object.entries(blocks).reduce((blocksMap, [hash, block]) => {
        const existing = Record.get(blocksMap, hash);
        if (existing) {
          return Record.set(blocksMap, hash, { referenceCount: existing.referenceCount + 1, block: existing.block });
        }
        return Record.set(blocksMap, hash, { referenceCount: 1, block });
      }, state.blocksMap);
      return {
        filesMap: Record.set(state.filesMap, action.id, hash),
        blocksMap: existing ? decrement(existing, extendedBlocksMap) : extendedBlocksMap,
      };
    }
    case "unload": {
      const hash = Record.get(state.filesMap, action.id);
      if (!hash) throw new Error();
      return {
        filesMap: Record.del(state.filesMap, action.id),
        blocksMap: decrement(hash, state.blocksMap),
      };
    }
  }
}

function decrement(hash: string, blocksMap: BlocksMap): BlocksMap {
  const existing = Record.get(blocksMap, hash);
  if (!existing) throw new Error();
  switch (existing.block.type) {
    case "leaf": {
      if (existing.referenceCount === 1) return Record.del(blocksMap, hash);
      return Record.set(blocksMap, hash, { referenceCount: existing.referenceCount - 1, block: existing.block });
    }
    case "branch": {
      return existing.block.branches.reduce(
        (blocksMap, hash) => decrement(hash, blocksMap),
        existing.referenceCount === 1
          ? Record.del(blocksMap, hash)
          : Record.set(blocksMap, hash, { referenceCount: existing.referenceCount - 1, block: existing.block })
      );
    }
  }
}

function chunk(data: Uint8Array) {
  const CHUNK_SIZE = 256000;
  const blockMap: Record<string, Block> = {};
  const root: Block = { type: "branch", branches: [] };
  for (let i = 0; i < data.byteLength; i += CHUNK_SIZE) {
    const block: Block = { type: "leaf", data: data.slice(i, i + CHUNK_SIZE) };
    const hash = getBlockHash(block);
    blockMap[hash] = block;
    root.branches.push(hash);
  }
  const rootHash = getBlockHash(root);
  blockMap[rootHash] = root;
  return [rootHash, blockMap] as const;
}

function getBlockHash(block: Block) {
  switch (block.type) {
    case "leaf": {
      const state = libsodium.crypto_generichash_init("leaf", libsodium.crypto_generichash_KEYBYTES);
      libsodium.crypto_generichash_update(state, block.data);
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
    case "branch": {
      const state = libsodium.crypto_generichash_init("branch", libsodium.crypto_generichash_KEYBYTES);
      for (const hash of block.branches) {
        libsodium.crypto_generichash_update(state, hash);
      }
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
  }
}

const Record = {
  get<Key extends string, Value>(record: Record<Key, Value>, key: Key): Value | undefined {
    return record[key];
  },
  set<Key extends string, Value>(record: Record<Key, Value>, key: Key, value: Value): Record<Key, Value> {
    return { ...record, [key]: value };
  },
  del<Key extends string, Value>(record: Record<Key, Value>, key: Key): Record<Key, Value> {
    const { [key]: removed, ...rest } = record;
    return rest as any;
  },
};
