class FreeMap<Key, Value> {
  get(key: Key): FreeMaybe<Value> {
    throw new Error("not implemented");
  }
  set(key: Key, value: Value): FreeMap<Key, Value> {
    throw new Error("not implemented");
  }
  valuesSeq(sorting?: (a: [Key, Value], b: [Key, Value]) => number): FreeSeq<Value> {
    throw new Error("not implemented");
  }
}

class FreeSet<Value> {
  static empty<Value>(): FreeSet<Value> {
    throw new Error("not implemented");
  }
  static single<Value>(value: Value): FreeSet<Value> {
    return this.empty<Value>().add(value);
  }
  add(value: Value): FreeSet<Value> {
    throw new Error("not implemented");
  }
  flatMap<ToValue>(mapper: (value: Value) => FreeSet<ToValue>): FreeSet<ToValue> {
    throw new Error("not implemented");
  }
  maybeFlatMap<ToValue>(mapper: (value: Value) => FreeMaybe<FreeSet<ToValue>>): FreeMaybe<FreeSet<ToValue>> {
    throw new Error("not implemented");
  }
  mapWithState<ToValue, State>(
    initial: State,
    mapper: (state: State, value: Value) => [State, ToValue]
  ): [State, FreeSet<ToValue>] {
    throw new Error("not implemented");
  }
  size(): number {
    throw new Error("not implemented");
  }
  toSeq(sorting?: (a: Value, b: Value) => number): FreeSeq<Value> {
    throw new Error("not implemented");
  }
  groupBy<Key>(criteria: (value: Value) => Key): FreeMap<Key, FreeSet<Value>> {
    throw new Error("not implemented");
  }
}

class FreeSeq<Value> {
  static single<Value>(value: Value): FreeSeq<Value> {
    throw new Error("not implemented");
  }
  static range(start: number, step: number, end: number): FreeSeq<number> {
    throw new Error("not implemented");
  }
  maybeFlatMap<ToValue>(mapper: (value: Value) => FreeMaybe<FreeSeq<ToValue>>): FreeMaybe<FreeSeq<ToValue>> {
    throw new Error("not implemented");
  }
  mapWithState<ToValue, State>(
    initial: State,
    mapper: (state: State, value: Value) => [State, ToValue]
  ): [State, FreeSeq<ToValue>] {
    throw new Error("not implemented");
  }
  toSet(): FreeSet<Value> {
    throw new Error("not implemented");
  }
  size(): number {
    throw new Error("not implemented");
  }
  slice(start: number, end: number): FreeSeq<Value> {
    throw new Error("not implemented");
  }
}

class FreeMaybe<Value> {
  static none<Value>(): FreeMaybe<Value> {
    throw new Error("not implemented");
  }
  static some<Value>(value: Value): FreeMaybe<Value> {
    throw new Error("not implemented");
  }
  flatMap<ToValue>(mapper: (value: Value) => FreeMaybe<ToValue>): FreeMaybe<ToValue> {
    throw new Error("not implemented");
  }
  match<OnNone, OnSome>(onNone: OnNone, onSome: (value: Value) => OnSome): OnNone | OnSome {
    throw new Error("not implemented");
  }
}

type Block<Hash, Data> = { type: "leaf"; data: Data } | { type: "branch"; branches: FreeSeq<Hash> };
type Blocks<Hash, Data> = FreeMap<Hash, Block<Hash, Data>>;

function bubu<Hash, Data>(
  hashFunction: (block: Block<Hash, Data>) => Hash,
  getHashPrefix: (hash: Hash, level: number) => number,
  compareHash: (a: Hash, b: Hash) => number,
  SEQ_BRANCHES_COUNT: number = 4000,
  SET_BRANCHES_COUNT: number = 256
) {
  const toMissing = (blocks: Blocks<Hash, Data>, hash: Hash): FreeSet<Hash> =>
    blocks.get(hash).match(FreeSet.single(hash), (block) => {
      switch (block.type) {
        case "leaf":
          return FreeSet.empty();
        case "branch":
          return block.branches.toSet().flatMap((hash) => toMissing(blocks, hash));
      }
    });
  const toSeq = (blocks: Blocks<Hash, Data>, hash: Hash): FreeMaybe<FreeSeq<Data>> =>
    blocks.get(hash).flatMap((block) => {
      switch (block.type) {
        case "leaf":
          return FreeMaybe.some(FreeSeq.single(block.data));
        case "branch":
          return block.branches.maybeFlatMap((hash) => toSeq(blocks, hash));
        default:
          throw new Error();
      }
    });
  const toSet = (blocks: Blocks<Hash, Data>, hash: Hash): FreeMaybe<FreeSet<Data>> =>
    blocks.get(hash).flatMap((block) => {
      switch (block.type) {
        case "leaf":
          return FreeMaybe.some(FreeSet.single(block.data));
        case "branch":
          return block.branches.toSet().maybeFlatMap((hash) => toSet(blocks, hash));
        default:
          throw new Error();
      }
    });
  const to = (blocks: Blocks<Hash, Data>, block: Block<Hash, Data>): [Blocks<Hash, Data>, Hash] => {
    const hash = hashFunction(block);
    return [blocks.set(hash, block), hash];
  };
  const toBalancedTree = (blocks: Blocks<Hash, Data>, hashes: FreeSeq<Hash>): [Blocks<Hash, Data>, Hash] => {
    if (hashes.size() <= SEQ_BRANCHES_COUNT) return to(blocks, { type: "branch", branches: hashes });
    const branchCount = Math.ceil(hashes.size() / SEQ_BRANCHES_COUNT);
    return toBalancedTree(
      ...FreeSeq.range(0, SEQ_BRANCHES_COUNT, branchCount * SEQ_BRANCHES_COUNT).mapWithState(blocks, (blocks, i) =>
        to(blocks, { type: "branch", branches: hashes.slice(i, i + SEQ_BRANCHES_COUNT) })
      )
    );
  };
  const fromSeq = (blocks: Blocks<Hash, Data>, datas: FreeSeq<Data>) => {
    const [newBlocks, hashes] = datas.mapWithState(blocks, (blocks, data) => to(blocks, { type: "leaf", data }));
    return toBalancedTree(newBlocks, hashes);
  };
  const toBytePrefixTree = (
    blocks: Blocks<Hash, Data>,
    hashes: FreeSet<Hash>,
    prefixLevel: number
  ): [Blocks<Hash, Data>, Hash] => {
    if (hashes.size() <= SET_BRANCHES_COUNT) return to(blocks, { type: "branch", branches: hashes.toSeq(compareHash) });
    const byPrefix = hashes.groupBy((hash) => getHashPrefix(hash, prefixLevel));
    const [newBlocks, branches] = byPrefix
      .valuesSeq(([a], [b]) => a - b)
      .mapWithState(blocks, (blocks, prefixedHashes) => toBytePrefixTree(blocks, prefixedHashes, prefixLevel + 1));
    return to(newBlocks, { type: "branch", branches });
  };
  const fromSet = (blocks: Blocks<Hash, Data>, datas: FreeSet<Data>) => {
    const [newBlocks, hashes] = datas.mapWithState(blocks, (blocks, data) => to(blocks, { type: "leaf", data }));
    return toBytePrefixTree(newBlocks, hashes, 0);
  };
  return { toMissing, fromSeq, toSeq, fromSet, toSet };
}
