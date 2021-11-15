export type CryptoHashRepo<Hash, Value> = {
  from(hash: Hash): { type: "found"; value: Value } | { type: "missing" };
  to(value: Value): Hash;
};

// TODO implement using immutable js
export class NaiveHashRepo<Hash, Value> implements CryptoHashRepo<Hash, Value> {
  constructor(private hashFunction: (value: Value) => Hash, private hashEquals: (a: Hash, b: Hash) => boolean) {}
  private list: Array<{ hash: Hash; value: Value }> = [];
  from(hash: Hash): { type: "found"; value: Value } | { type: "missing" } {
    const exiting = this.list.find((item) => this.hashEquals(item.hash, hash));
    if (exiting) return { type: "found", value: exiting.value };
    return { type: "missing" };
  }
  to(value: Value) {
    const hash = this.hashFunction(value);
    this.list.push({ hash, value });
    return hash;
  }
}
