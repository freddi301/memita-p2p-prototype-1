import level from "level";
import { userFolderPath } from "../folderPaths";
import path from "path";
import { AsyncCryptoHashRepo } from "./AsyncCryptoHashRepo";
import { JSONB } from "../JSONB";
import { Assertion } from "../assertion";

export class LevelAsyncCryptoHashRepo<Hash, Value> implements AsyncCryptoHashRepo<Hash, Value> {
  constructor(
    private folder: string,
    private hashFunction: (value: Value) => Hash,
    private assertFunction: Assertion<Value>
  ) {}
  private db = level(path.resolve(userFolderPath, this.folder));
  async from(hash: Hash): Promise<{ type: "found"; value: Value } | { type: "missing" }> {
    try {
      const existing = JSONB.parse(await this.db.get(hash));
      if (!this.assertFunction(existing)) throw new Error();
      if (hash === this.hashFunction(existing)) {
        return { type: "found", value: existing };
      } else {
        this.db.del(hash);
        return { type: "missing" };
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
    this.db.put(hash, JSONB.stringify(value));
    return hash;
  }
}
