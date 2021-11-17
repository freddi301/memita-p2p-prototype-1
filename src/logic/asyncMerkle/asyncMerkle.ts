import libsodium from "libsodium-wrappers";
import { LevelAsyncHashRepo } from "./AsyncHashRepo";
import * as AsyncMerkleTreeSet from "./AsyncMerkleTreeSet";
import * as AsyncMerkleTreeSequence from "./AsyncMerkleTreeSequence";

export const messagesRepo = new LevelAsyncHashRepo("replication/messages", setTreeHashFunction, equalsUint8Array);
export const messagesFactory = new AsyncMerkleTreeSet.Factory(messagesRepo, getHashPrefix);
export type MessageBlock = AsyncMerkleTreeSet.Tree<Hash, string>; // TODO replace string with message type

export const filesRepo = new LevelAsyncHashRepo("replication/files", sequenceTreeHashFunction, equalsUint8Array);
export const filesFactory = new AsyncMerkleTreeSequence.Factory(filesRepo, 4000);
export type FileBlock = AsyncMerkleTreeSequence.Tree<Hash, Uint8Array>;

export type Hash = Uint8Array;
export const equalsHash = equalsUint8Array;

function setTreeHashFunction(value: MessageBlock) {
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

function sequenceTreeHashFunction(value: FileBlock) {
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
