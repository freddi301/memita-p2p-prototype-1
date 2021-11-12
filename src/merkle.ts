import libsodium from "libsodium-wrappers";

export type Block =
  | {
      type: "leaf";
      data: string;
    }
  | {
      type: "branch";
      list: Array<string>;
    };

export function calculateBlockHash(block: Block) {
  switch (block.type) {
    case "leaf": {
      const state = libsodium.crypto_generichash_init("leaf", libsodium.crypto_generichash_KEYBYTES);
      libsodium.crypto_generichash_update(state, "leaf");
      libsodium.crypto_generichash_update(state, block.data);
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
    case "branch": {
      const state = libsodium.crypto_generichash_init("branch", libsodium.crypto_generichash_KEYBYTES);
      libsodium.crypto_generichash_update(state, "branch");
      for (const hash of block.list) {
        libsodium.crypto_generichash_update(state, hash);
      }
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
  }
}

export function merkleFromData(data: string, dataSize: number, listSize: number) {
  const blockCount = Math.ceil(data.length / dataSize);
  const list: Array<string> = [];
  const blocks: Record<string, Block> = {};
  for (let i = 0; i < blockCount; i++) {
    const chunk = data.slice(i * dataSize, i * dataSize + dataSize);
    const block: Block = { type: "leaf", data: chunk };
    const hash = calculateBlockHash(block);
    blocks[hash] = block;
    list.push(hash);
  }
  const hash = piramidal(list, blocks, listSize);
  return {
    hash,
    blocks,
  };
}

export function merkleFromSet(datas: Array<string>, listSize: number) {
  const list: Array<string> = [];
  const blocks: Record<string, Block> = {};
  for (const data of datas) {
    const block: Block = { type: "leaf", data };
    const hash = calculateBlockHash(block);
    blocks[hash] = block;
    list.push(hash);
  }
  const prefixes = list.map((hash) => hash.slice(0, 1));
  const hash = piramidal(
    prefixes.map((prefix) =>
      piramidal(
        list.filter((item) => item.startsWith(prefix)),
        blocks,
        listSize
      )
    ),
    blocks,
    listSize
  );
  return {
    hash,
    blocks,
  };
}

export function piramidal(list: Array<string>, blocks: Record<string, Block>, listSize: number): string {
  if (list.length <= listSize) {
    const block: Block = { type: "branch", list };
    const hash = calculateBlockHash(block);
    blocks[hash] = block;
    return hash;
  } else {
    const branches: Array<string> = [];
    const branchCount = Math.ceil(list.length / listSize);
    for (let i = 0; i < branchCount; i++) {
      const partitioned = list.slice(i * listSize, i * listSize + listSize);
      const block: Block = { type: "branch", list: partitioned };
      const hash = calculateBlockHash(block);
      blocks[hash] = block;
      branches.push(hash);
    }
    return piramidal(branches, blocks, listSize);
  }
}

export const dataFromMerkle = (hash: string, blocks: Record<string, Block>): string | null => {
  const block = blocks[hash];
  if (block === null) return null;
  switch (block.type) {
    case "leaf":
      return block.data;
    case "branch": {
      let accumulator = "";
      for (const hash of block.list) {
        const data = dataFromMerkle(hash, blocks);
        if (data === null) return null;
        accumulator += data;
      }
      return accumulator;
    }
  }
};

export const missingFromMerkle = (hash: string, blocks: Record<string, Block>): Array<string> => {
  const block = blocks[hash];
  if (!block) return [hash];
  switch (block.type) {
    case "leaf":
      return [];
    case "branch":
      return block.list.flatMap((hash) => missingFromMerkle(hash, blocks));
  }
};

// libsodium.ready.then(() => {
//   const merkle1 = merkleFromData("hello world", 1, 2);
//   console.log(merkle1);
//   // const missing1 = missingFromMerkle(merkle1.hash, merkle1.blocks);
//   // console.log(missing1);
//   // console.log(
//   //   missingFromMerkle(merkle1.hash, {
//   //     ...merkle1.blocks,
//   //     "78c8166e7ef06e63d92c46e08a89b25988c6f853d07bb075cab7ca27ebb1d5d5": undefined as any,
//   //   })
//   // );
//   const data1 = dataFromMerkle(merkle1.hash, merkle1.blocks);
//   console.log(data1);
// });

if (!(typeof window === "undefined")) {
  // variable is undefined
  (window as any).merkle = {
    calculateBlockHash,
    merkleFromData,
    dataFromMerkle,
    missingFromMerkle,
  };
}
