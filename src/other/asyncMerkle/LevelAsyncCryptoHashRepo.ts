import level from "level";
import { userFolderPath } from "../folderPaths";
import path from "path";
import cbor from "cbor";
import { Assertion } from "../assertion";
import { AsyncCryptoHashRepo } from "./AsynMerkleTree";

const TRUST_SELF = true;

export class LevelAsyncCryptoHashRepo<Hash, Value> implements AsyncCryptoHashRepo<Hash, Value> {
  constructor(
    private folder: string,
    private hashFunction: (value: Value) => Hash,
    private assertFunction: Assertion<Value>
  ) {}
  private db = level(path.resolve(userFolderPath, this.folder), { valueEncoding: "binary" });
  async from(hash: Hash): Promise<{ type: "found"; value: Value } | { type: "missing" }> {
    try {
      if (TRUST_SELF) {
        const existing = cbor.decodeFirstSync(await this.db.get(hash), { highWaterMark: 512000 } as any) as any;
        return { type: "found", value: existing };
      } else {
        const existing = cbor.decodeFirstSync(await this.db.get(hash), { highWaterMark: 512000 } as any);
        if (!this.assertFunction(existing)) throw new Error();
        if (hash === this.hashFunction(existing)) {
          return { type: "found", value: existing };
        } else {
          this.db.del(hash);
          return { type: "missing" };
        }
      }
    } catch (error) {
      if ((error as any).notFound) {
        return { type: "missing" };
      } else {
        throw error;
      }
    }
  }
  async to(value: Value): Promise<Hash> {
    const hash = this.hashFunction(value);
    this.db.put(hash, cbor.encodeOne(value, { highWaterMark: 512000 } as any));
    return hash;
  }
}
