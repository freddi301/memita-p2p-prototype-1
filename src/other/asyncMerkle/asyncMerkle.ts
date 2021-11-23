import libsodium from "libsodium-wrappers";
import { LevelAsyncCryptoHashRepo } from "./LevelAsyncCryptoHashRepo";
import { Tree, MerkleTreeSet, MerkleTreeSequence } from "./AsynMerkleTree";
import { refine, isArray, isNumber, isObject, isString, isAlternative, isLiteral, isInstanceof } from "../assertion";
import { JSONB } from "../JSONB";

export type Hash = string;
export type FileData = Uint8Array;
export type MessageData = {
  senderPublicKey: string;
  recipientPublicKey: string;
  createdAtEpoch: number;
  text: string;
  attachments: Array<{ name: string; contentHash: Hash }>;
};

export type MessageBlock = Tree<Hash, MessageData>;
export type FileBlock = Tree<Hash, Uint8Array>;

export const isValidHash = refine(isString, (string) => string.length === 64);

const isValidMessage = isObject({
  senderPublicKey: isString, // TODO
  recipientPublicKey: isString, // TODO
  createdAtEpoch: isNumber,
  text: isString,
  attachments: isArray(
    isObject({
      name: isString,
      contentHash: isValidHash,
    })
  ),
});

export const isValidMessageBlock = isAlternative([
  isObject({
    type: isLiteral("leaf"),
    data: isValidMessage,
  }),
  isObject({
    type: isLiteral("branch"),
    branches: isArray(isValidHash),
  }),
]);

export const isValidFileBlock = isAlternative([
  isObject({
    type: isLiteral("leaf"),
    data: isInstanceof(Uint8Array),
  }),
  isObject({
    type: isLiteral("branch"),
    branches: isArray(isValidHash),
  }),
]);

export const messagesRepo = new LevelAsyncCryptoHashRepo(
  "replication/messages",
  setTreeHashFunction,
  isValidMessageBlock
);

export const filesRepo = new LevelAsyncCryptoHashRepo("replication/files", sequenceTreeHashFunction, isValidFileBlock);

export const messagesFactory = new MerkleTreeSet(messagesRepo, getHashPrefix);

export const filesFactory = new MerkleTreeSequence(filesRepo, 4000);

function setTreeHashFunction(value: MessageBlock): Hash {
  switch (value.type) {
    case "leaf": {
      const state = libsodium.crypto_generichash_init("leaf", libsodium.crypto_generichash_KEYBYTES);
      libsodium.crypto_generichash_update(state, JSONB.stringify(value.data));
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
    case "branch": {
      const state = libsodium.crypto_generichash_init("branch", libsodium.crypto_generichash_KEYBYTES);
      for (const hash of value.branches) {
        libsodium.crypto_generichash_update(state, hash);
      }
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
  }
}

function sequenceTreeHashFunction(value: FileBlock): Hash {
  switch (value.type) {
    case "leaf": {
      const state = libsodium.crypto_generichash_init("leaf", libsodium.crypto_generichash_KEYBYTES);
      libsodium.crypto_generichash_update(state, value.data);
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
    case "branch": {
      const state = libsodium.crypto_generichash_init("branch", libsodium.crypto_generichash_KEYBYTES);
      for (const hash of value.branches) {
        libsodium.crypto_generichash_update(state, hash);
      }
      return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
    }
  }
}

function getHashPrefix(hash: Hash, level: number) {
  const dataView = new DataView(Buffer.from(hash, "hex"));
  return dataView.getUint8(level);
}
