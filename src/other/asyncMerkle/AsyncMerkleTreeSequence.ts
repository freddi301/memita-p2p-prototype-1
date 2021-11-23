import { AsyncCryptoHashRepo } from "./AsyncCryptoHashRepo";
import { Tree } from "./AsynMerkleTree";

export class Factory<Hash, Data> {
  constructor(private asyncCryptoHashRepo: AsyncCryptoHashRepo<Hash, Tree<Hash, Data>>, private listSize: number) {}
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
