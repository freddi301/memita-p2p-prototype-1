import libsodium from "libsodium-wrappers";
import { LevelAsyncHashRepo } from "./AsyncHashRepo";
import * as AsyncMerkleTreeSet from "./AsyncMerkleTreeSet";

export const repo = new LevelAsyncHashRepo("messages", hashFunction, equalsUint8Array);
export const factory = new AsyncMerkleTreeSet.Factory(repo, getHashPrefix);
export type Hash = Uint8Array;
export type Block = AsyncMerkleTreeSet.Tree<Hash, string>; // TODO replace string with message type
export const equalsHash = equalsUint8Array;

function hashFunction(value: Block) {
  switch (value.type) {
    case "leaf": {
      const state = libsodium.crypto_generichash_init("leaf", libsodium.crypto_generichash_KEYBYTES);
      libsodium.crypto_generichash_update(state, value.data);
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES);
    }
    case "branch": {
      const state = libsodium.crypto_generichash_init("branch", libsodium.crypto_generichash_KEYBYTES);
      for (const hash of value.branches) {
        libsodium.crypto_generichash_update(state, hash);
      }
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES);
    }
  }
}

function equalsUint8Array(typedArrayA: Uint8Array, typedArrayB: Uint8Array) {
  if (typedArrayA === typedArrayB) return true;
  if (typedArrayA.byteLength !== typedArrayB.byteLength) return false;
  const dataViewA = new DataView(typedArrayA.buffer);
  const dataViewB = new DataView(typedArrayB.buffer);
  for (let i = 0; i < typedArrayA.byteLength; i++) {
    if (dataViewA.getUint8(i) !== dataViewB.getUint8(i)) return false;
  }
  return true;
}

function getHashPrefix(hash: Uint8Array, level: number) {
  const dataView = new DataView(hash.buffer);
  return dataView.getUint8(level);
}

function chunkUint8Array(data: Uint8Array, chunkSize: number): Array<Uint8Array> {
  const blockCount = Math.ceil(data.length / chunkSize);
  const chunks: Array<Uint8Array> = [];
  for (let i = 0; i < blockCount; i++) {
    const chunk = data.slice(i * chunkSize, i * chunkSize + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}
