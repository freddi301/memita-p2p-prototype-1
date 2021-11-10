import { makeStore } from "./plumbing";
import libsodium from "libsodium-wrappers";

export type Commands = {
  UpdateContact(publicKey: string, name: string, notes: string): void;
  DeleteContact(publickKey: string): void;
  CreateAccount(name: string, notes: string): void;
  UpdateAccount(publicKey: string, name: string, notes: string): void;
  DeleteAccount(publickKey: string): void;
  Message(senderPublicKey: string, recipientPublicKey: string, createdAtEpoch: number, text: string): void;
};
export type Queries = {
  ContactListSize(): number;
  ContactListAtIndex(index: number): { publicKey: string; name: string; notes: string } | null;
  ContactByPublicKey(publicKey: string): { name: string; notes: string } | null;
  AccountListSize(): number;
  AccountListAtIndex(index: number): { publicKey: string; name: string; notes: string } | null;
  AccountByPublicKey(publicKey: string): { name: string; notes: string } | null;
  ConversationListSize(myPublicKey: string, otherPublicKey: string): number;
  ConversationListAtIndex(
    myPublicKey: string,
    otherPublicKey: string,
    index: number
  ): { senderPublicKey: string; recipientPublicKey: string; text: string; createdAtEpoch: number };
};
export const store = makeStore(
  {
    contactMap(contactMap: Record<string, { name: string; notes: string }>) {
      return {
        UpdateContact(publicKey, name, notes) {
          return { ...contactMap, [publicKey]: { name, notes } };
        },
        DeleteContact(publicKey) {
          const { [publicKey]: deleted, ...rest } = contactMap;
          return rest;
        },
      };
    },
    accountMap(accountMap: Record<string, { privateKey: string; name: string; notes: string }>) {
      return {
        CreateAccount(name, notes) {
          const publicKey = Math.random().toString(16);
          const privateKey = Math.random().toString(16);
          return { ...accountMap, [publicKey]: { name, notes, privateKey } };
        },
        UpdateAccount(publicKey, name, notes) {
          const existing = accountMap[publicKey];
          if (!existing) return accountMap;
          const { privateKey } = existing;
          return { ...accountMap, [publicKey]: { name, notes, privateKey } };
        },
        DeleteAccount(publicKey) {
          const { [publicKey]: deleted, ...rest } = accountMap;
          return rest;
        },
      };
    },
    messageMap(
      messageMap: Record<
        string,
        { senderPublicKey: string; recipientPublicKey: string; text: string; createdAtEpoch: number }
      >
    ) {
      return {
        Message(senderPublicKey, recipientPublicKey, createdAtEpoch, text) {
          const messageHash = calculateMessageHash({ senderPublicKey, recipientPublicKey, createdAtEpoch, text });
          return { ...messageMap, [messageHash]: { senderPublicKey, recipientPublicKey, text, createdAtEpoch } };
        },
      };
    },
  },
  { contactMap: {}, accountMap: {}, messageMap: {} },
  ({ contactMap, accountMap, messageMap }) => {
    const contactList = Object.entries(contactMap)
      .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const accountList = Object.entries(accountMap)
      .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const getConversation = (myPublicKey: string, otherPublicKey: string) =>
      Object.values(messageMap)
        .filter(
          (message) =>
            (message.senderPublicKey === myPublicKey && message.recipientPublicKey === otherPublicKey) ||
            (message.senderPublicKey === otherPublicKey && message.recipientPublicKey === myPublicKey)
        )
        .sort((a, b) => a.createdAtEpoch - b.createdAtEpoch);
    return {
      ContactListSize() {
        return contactList.length;
      },
      ContactListAtIndex(index) {
        return contactList[index] ?? null;
      },
      ContactByPublicKey(publicKey) {
        const existing = contactMap[publicKey];
        if (!existing) return null;
        const { name, notes } = existing;
        return { name, notes };
      },
      AccountListSize() {
        return accountList.length;
      },
      AccountListAtIndex(index) {
        return accountList[index] ?? null;
      },
      AccountByPublicKey(publicKey) {
        const existing = accountMap[publicKey];
        if (!existing) return null;
        const { name, notes } = existing;
        return { name, notes };
      },
      ConversationListSize(myPublicKey, otherPublicKey) {
        return getConversation(myPublicKey, otherPublicKey).length;
      },
      ConversationListAtIndex(myPublicKey, otherPublicKey, index) {
        return getConversation(myPublicKey, otherPublicKey)[index];
      },
    };
  }
);

function calculateMessageHash({
  senderPublicKey,
  recipientPublicKey,
  text,
  createdAtEpoch,
}: {
  senderPublicKey: string;
  recipientPublicKey: string;
  text: string;
  createdAtEpoch: number;
}) {
  const state = libsodium.crypto_generichash_init(null, libsodium.crypto_generichash_KEYBYTES);
  libsodium.crypto_generichash_update(state, senderPublicKey);
  libsodium.crypto_generichash_update(state, recipientPublicKey);
  libsodium.crypto_generichash_update(state, createdAtEpoch.toString());
  libsodium.crypto_generichash_update(state, text);
  return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
}
