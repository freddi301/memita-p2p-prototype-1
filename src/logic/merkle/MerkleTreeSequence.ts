import { CryptoHashRepo } from "./HashRepo";

export type Tree<Hash, Data> = Branch<Hash> | Leaf<Data>;
type Branch<Hash> = { type: "branch"; branches: Array<Hash> };
type Leaf<Data> = { type: "leaf"; data: Data };

export class Factory<Hash, Data> {
  constructor(private cryptoHashRepo: CryptoHashRepo<Hash, Tree<Hash, Data>>, private listSize: number) {}
  private toBalancedTree(list: Array<Hash>): Hash {
    if (list.length <= this.listSize) {
      return this.cryptoHashRepo.to({ type: "branch", branches: list });
    } else {
      const branches: Array<Hash> = [];
      const branchCount = Math.ceil(list.length / this.listSize);
      for (let i = 0; i < branchCount; i++) {
        const partitioned = list.slice(i * this.listSize, i * this.listSize + this.listSize);
        branches.push(this.cryptoHashRepo.to({ type: "branch", branches: partitioned }));
      }
      return this.toBalancedTree(branches);
    }
  }
  to(datas: Array<Data>): Hash {
    return this.toBalancedTree(datas.map((data) => this.cryptoHashRepo.to({ type: "leaf", data })));
  }
  missing(hash: Hash): Array<Hash> {
    const fromRepo = this.cryptoHashRepo.from(hash);
    if (fromRepo.type === "missing") return [hash];
    const tree = fromRepo.value;
    switch (tree.type) {
      case "leaf":
        return [];
      case "branch":
        return tree.branches.flatMap(this.missing);
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
