export type AsyncCryptoHashRepo<Hash, Value> = {
  from(hash: Hash): Promise<{ type: "found"; value: Value } | { type: "missing" }>;
  to(value: Value): Promise<Hash>;
};
