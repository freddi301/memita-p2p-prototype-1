export type Tree<Hash, Data> = Branch<Hash> | Leaf<Data>;
type Branch<Hash> = { type: "branch"; branches: Array<Hash> };
type Leaf<Data> = { type: "leaf"; data: Data };
