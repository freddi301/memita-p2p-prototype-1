import { CryptoHashRepo } from "./HashRepo";

export type Tree<Hash, Data> = Branch<Hash> | Leaf<Data>;
type Branch<Hash> = { type: "branch"; branches: Array<Hash> };
type Leaf<Data> = { type: "leaf"; data: Data };

export class Factory<Hash, Data> {
  constructor(
    private cryptoHashRepo: CryptoHashRepo<Hash, Tree<Hash, Data>>,
    private getHashPrefix: (hash: Hash, level: number) => number
  ) {}
  private toBytePrefixTree(hashes: Array<Hash>): Hash {
    const recurse = (inputHashes: Array<Hash>, prefixLevel: number) => {
      if (inputHashes.length <= 256) return this.cryptoHashRepo.to({ type: "branch", branches: inputHashes });
      const innerHashes: Array<Hash> = [];
      for (let possiblePrefix = 0; possiblePrefix < 256; possiblePrefix++) {
        const prefixedHashes = inputHashes.filter((hash) => this.getHashPrefix(hash, prefixLevel) === possiblePrefix);
        if (prefixedHashes.length > 0) innerHashes.push(recurse(prefixedHashes, prefixLevel + 1));
      }
      return this.cryptoHashRepo.to({ type: "branch", branches: innerHashes });
    };
    return recurse(hashes, 0);
  }
  to(datas: Array<Data>): Hash {
    return this.toBytePrefixTree(datas.map((data) => this.cryptoHashRepo.to({ type: "leaf", data })));
  }
  missing(hash: Hash): Array<Hash> {
    const fromRepo = this.cryptoHashRepo.from(hash);
    if (fromRepo.type === "missing") return [hash];
    const tree = fromRepo.value;
    switch (tree.type) {
      case "leaf":
        return [];
      case "branch":
        return tree.branches.flatMap((hash) => this.missing(hash));
    }
  }
  from(hash: Hash): Array<Data> | null {
    const fromRepo = this.cryptoHashRepo.from(hash);
    if (fromRepo.type === "missing") return null;
    const tree = fromRepo.value;
    switch (tree.type) {
      case "leaf":
        return [tree.data];
      case "branch": {
        const datas: Array<Data> = [];
        for (const hash of tree.branches) {
          const data = this.from(hash);
          if (data === null) return null;
          datas.push(...data);
        }
        return datas;
      }
    }
  }
}
