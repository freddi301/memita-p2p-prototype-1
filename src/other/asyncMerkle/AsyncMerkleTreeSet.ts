import { AsyncCryptoHashRepo } from "./AsyncCryptoHashRepo";
import { Tree } from "./AsynMerkleTree";

export class Factory<Hash, Data> {
  constructor(
    private asyncCryptoHashRepo: AsyncCryptoHashRepo<Hash, Tree<Hash, Data>>,
    private getHashPrefix: (hash: Hash, level: number) => number
  ) {}
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
  async missing(hash: Hash): Promise<Array<Hash>> {
    const fromRepo = await this.asyncCryptoHashRepo.from(hash);
    if (fromRepo.type === "missing") return [hash];
    const tree = fromRepo.value;
    switch (tree.type) {
      case "leaf":
        return [];
      case "branch":
        return (await Promise.all(tree.branches.map((hash) => this.missing(hash)))).flat(1);
    }
  }
  async from(hash: Hash): Promise<Array<Data> | null> {
    const fromRepo = await this.asyncCryptoHashRepo.from(hash);
    if (fromRepo.type === "missing") return null;
    const tree = fromRepo.value;
    switch (tree.type) {
      case "leaf":
        return [tree.data];
      case "branch": {
        const datas: Array<Data> = [];
        for (const hash of tree.branches) {
          const data = await this.from(hash);
          if (data === null) return null;
          datas.push(...data);
        }
        return datas;
      }
    }
  }
}
