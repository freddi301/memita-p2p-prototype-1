import { makeStore } from "./plumbing";

export type Commands = {
  UpdateContact(publicKey: string, name: string, notes: string): void;
  DeleteContact(publickKey: string): void;
  CreateAccount(name: string, notes: string): void;
  UpdateAccount(publicKey: string, name: string, notes: string): void;
  DeleteAccount(publickKey: string): void;
  Message(senderPublicKey: string, recipientPublicKey: string, text: string, createdAtEpoch: number): void;
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
    messageArray(
      messageArray: Array<{ senderPublicKey: string; recipientPublicKey: string; text: string; createdAtEpoch: number }>
    ) {
      return {
        Message(senderPublicKey, recipientPublicKey, text, createdAtEpoch) {
          return [...messageArray, { senderPublicKey, recipientPublicKey, text, createdAtEpoch }];
        },
      };
    },
  },
  { contactMap: {}, accountMap: {}, messageArray: [] },
  ({ contactMap, accountMap, messageArray }) => {
    const contactList = Object.entries(contactMap)
      .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const accountList = Object.entries(accountMap)
      .map(([publicKey, { name, notes }]) => ({ publicKey, name, notes }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const getConversation = (myPublicKey: string, otherPublicKey: string) =>
      messageArray
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
