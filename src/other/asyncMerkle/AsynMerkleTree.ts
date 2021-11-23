export type Tree<Hash, Data> = Branch<Hash> | Leaf<Data>;
type Branch<Hash> = { type: "branch"; branches: Array<Hash> };
type Leaf<Data> = { type: "leaf"; data: Data };

export type AsyncCryptoHashRepo<Hash, Value> = {
  from(hash: Hash): Promise<{ type: "found"; value: Value } | { type: "missing" }>;
  to(value: Value): Promise<Hash>;
};

class MerkleTree<Hash, Data> {
  constructor(protected asyncCryptoHashRepo: AsyncCryptoHashRepo<Hash, Tree<Hash, Data>>) {}
  async *missing(hash: Hash): AsyncGenerator<Hash, void, unknown> {
    const block = await this.asyncCryptoHashRepo.from(hash);
    if (block.type === "missing") {
      yield hash;
      return;
    }
    switch (block.value.type) {
      case "leaf":
        return;
      case "branch": {
        for (const hash of block.value.branches) yield* this.missing(hash);
        return;
      }
    }
  }
  async *from(hash: Hash): AsyncGenerator<Data, void, unknown> {
    const fromRepo = await this.asyncCryptoHashRepo.from(hash);
    if (fromRepo.type === "missing") throw new Error();
    const tree = fromRepo.value;
    switch (tree.type) {
      case "leaf": {
        yield tree.data;
        return;
      }
      case "branch": {
        for (const hash of tree.branches) {
          yield* this.from(hash);
        }
        return;
      }
    }
  }
}

export class MerkleTreeSet<Hash, Data> extends MerkleTree<Hash, Data> {
  constructor(
    asyncCryptoHashRepo: AsyncCryptoHashRepo<Hash, Tree<Hash, Data>>,
    private getHashPrefix: (hash: Hash, level: number) => number
  ) {
    super(asyncCryptoHashRepo);
  }
  private async toBytePrefixTree(hashes: Array<Hash>): Promise<Hash> {
    const recurse = async (inputHashes: Array<Hash>, prefixLevel: number) => {
      if (inputHashes.length <= 256) return this.asyncCryptoHashRepo.to({ type: "branch", branches: inputHashes });
      const innerHashes: Array<Hash> = [];
      for (let possiblePrefix = 0; possiblePrefix < 256; possiblePrefix++) {
        const prefixedHashes = inputHashes.filter((hash) => this.getHashPrefix(hash, prefixLevel) === possiblePrefix);
        if (prefixedHashes.length > 0) innerHashes.push(await recurse(prefixedHashes, prefixLevel + 1));
      }
      return this.asyncCryptoHashRepo.to({ type: "branch", branches: innerHashes });
    };
    return recurse(hashes, 0);
  }
  async to(datas: Array<Data>): Promise<Hash> {
    return await this.toBytePrefixTree(
      await Promise.all(datas.map((data) => this.asyncCryptoHashRepo.to({ type: "leaf", data })))
    );
  }
}

export class MerkleTreeSequence<Hash, Data> extends MerkleTree<Hash, Data> {
  constructor(asyncCryptoHashRepo: AsyncCryptoHashRepo<Hash, Tree<Hash, Data>>, private listSize: number) {
    super(asyncCryptoHashRepo);
  }
  private async toBalancedTree(list: Array<Hash>): Promise<Hash> {
    if (list.length <= this.listSize) {
      return this.asyncCryptoHashRepo.to({ type: "branch", branches: list });
    } else {
      const branches: Array<Hash> = [];
      const branchCount = Math.ceil(list.length / this.listSize);
      for (let i = 0; i < branchCount; i++) {
        const partitioned = list.slice(i * this.listSize, i * this.listSize + this.listSize);
        branches.push(await this.asyncCryptoHashRepo.to({ type: "branch", branches: partitioned }));
      }
      return this.toBalancedTree(branches);
    }
  }
  async to(datas: AsyncIterable<Data>): Promise<Hash> {
    const hashes: Array<Hash> = [];
    for await (const data of datas) {
      const hash = await this.asyncCryptoHashRepo.to({ type: "leaf", data });
      hashes.push(hash);
    }
    return this.toBalancedTree(hashes);
  }
}
