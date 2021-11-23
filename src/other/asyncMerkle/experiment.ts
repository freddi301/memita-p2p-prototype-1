import { Tree } from "./AsynMerkleTree";

type Option<Value> = { type: "none" } | { type: "some"; value: Value };

type Repo<Key, Value> = {
  get(hash: Key): Option<Value>;
};

function bubu<Hash, Data>(repo: Repo<Hash, Tree<Hash, Data>>) {
  async function* missing(hash: Hash): AsyncGenerator<Hash, void, unknown> {
    const block = await repo.get(hash);
    if (block.type === "none") {
      yield hash;
      return;
    }
    switch (block.value.type) {
      case "leaf":
        return;
      case "branch": {
        for (const hash of block.value.branches) yield* missing(hash);
        return;
      }
    }
  }
}
