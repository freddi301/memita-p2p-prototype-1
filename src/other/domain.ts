import { makeStore } from "./plumbing";
import libsodium from "libsodium-wrappers";
import { Preferences } from "../ui/App";
import { AccountKeyPair } from "./AccountCryptography";

export type Commands = {
  UpdateContact(publicKey: string, name: string, notes: string): void;
  DeleteContact(publickKey: string): void;
  CreateAccount(name: string, notes: string): void;
  UpdateAccount(publicKey: string, name: string, notes: string): void;
  DeleteAccount(publickKey: string): void;
  Message(
    senderPublicKey: string,
    recipientPublicKey: string,
    createdAtEpoch: number,
    text: string,
    attachments: Array<{ name: string; contentHash: string }>
  ): void;
  Post(
    authorPublicKey: string,
    createdAtEpoch: number,
    text: string,
    attachments: Array<{ name: string; contentHash: string }>
  ): void;
  UpdatePreferences(preferences: Preferences): void;
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
  ): {
    senderPublicKey: string;
    recipientPublicKey: string;
    createdAtEpoch: number;
    text: string;
    attachments: Array<{ name: string; contentHash: string }>;
  } | null;
  ConversationsListSize(myPublicKey: string): number;
  ConversationsListAtIndex(
    myPublicKey: string,
    index: number
  ): {
    otherPublicKey: string;
    lastMessage: {
      senderPublicKey: string;
      recipientPublicKey: string;
      text: string;
      createdAtEpoch: number;
      attachments: Array<{ name: string; contentHash: string }>;
    };
  } | null;
  Preferences(): Preferences;
  PostByHash(postHash: string): {
    authorPublicKey: string;
    createdAtEpoch: number;
    text: string;
    attachments: Array<{ name: string; contentHash: string }>;
  } | null;
  PostListSize(authorPublicKey: string): number;
  PostListAtIndex(authorPublicKey: string, index: number): string | null;
  PostFeedSize(myPublicKey: string): number;
  PostFeedAtIndex(myPublicKey: string, index: number): string | null;
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
          const { publicKey, privateKey } = AccountKeyPair.create();
          return { ...accountMap, [publicKey.toHex()]: { name, notes, privateKey: privateKey.toHex() } };
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
        {
          senderPublicKey: string;
          recipientPublicKey: string;
          text: string;
          createdAtEpoch: number;
          attachments: Array<{ name: string; contentHash: string }>;
        }
      >
    ) {
      return {
        Message(senderPublicKey, recipientPublicKey, createdAtEpoch, text, attachments) {
          const messageHash = calculateMessageHash({
            senderPublicKey,
            recipientPublicKey,
            createdAtEpoch,
            text,
            attachments,
          });
          return {
            ...messageMap,
            [messageHash]: { senderPublicKey, recipientPublicKey, text, createdAtEpoch, attachments },
          };
        },
      };
    },
    preferences(preferences: Preferences) {
      return {
        UpdatePreferences(preferences) {
          return preferences;
        },
      };
    },
    postMap(
      postMap: Record<
        string,
        {
          authorPublicKey: string;
          text: string;
          createdAtEpoch: number;
          attachments: Array<{ name: string; contentHash: string }>;
        }
      >
    ) {
      return {
        Post(authorPublicKey, createdAtEpoch, text, attachments) {
          const postHash = calculatePostHash({
            authorPublicKey,
            createdAtEpoch,
            text,
            attachments,
          });
          return {
            ...postMap,
            [postHash]: { authorPublicKey, text, createdAtEpoch, attachments },
          };
        },
      };
    },
  },
  { contactMap: {}, accountMap: {}, messageMap: {}, preferences: {}, postMap: {} },
  ({ contactMap, accountMap, messageMap, preferences, postMap }) => {
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
    const getConversations = (myPublickKey: string) => {
      type Message = {
        senderPublicKey: string;
        recipientPublicKey: string;
        text: string;
        createdAtEpoch: number;
        attachments: Array<{ name: string; contentHash: string }>;
      };
      const lastMessageByConversationKey = Object.values(messageMap).reduce(
        (lastMessageByKey: Record<string, Message>, message) => {
          const replace = (otherPublicKey: string) => {
            const existing = lastMessageByKey[otherPublicKey];
            if (!existing) return { ...lastMessageByKey, [otherPublicKey]: message };
            if (message.createdAtEpoch > existing.createdAtEpoch)
              return { ...lastMessageByKey, [otherPublicKey]: message };
            return lastMessageByKey;
          };
          if (message.senderPublicKey === myPublickKey) {
            const otherPublicKey = message.recipientPublicKey;
            return replace(otherPublicKey);
          } else if (message.recipientPublicKey === myPublickKey) {
            const otherPublicKey = message.senderPublicKey;
            return replace(otherPublicKey);
          } else {
            return lastMessageByKey;
          }
        },
        {}
      );
      return Object.entries(lastMessageByConversationKey).map(([otherPublicKey, lastMessage]) => ({
        otherPublicKey,
        lastMessage,
      }));
    };
    function getPostList(authorPublicKey: string) {
      return Object.entries(postMap)
        .filter(([hash, post]) => post.authorPublicKey === authorPublicKey)
        .sort(([, a], [, b]) => b.createdAtEpoch - a.createdAtEpoch)
        .map(([hash]) => hash);
    }
    function getPostFeed(myPublicKey: string) {
      return Object.entries(postMap)
        .filter(([hash, post]) => true /* TODO filter only from contacts of this account */)
        .sort(([, a], [, b]) => b.createdAtEpoch - a.createdAtEpoch)
        .map(([hash]) => hash);
    }
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
        return getConversation(myPublicKey, otherPublicKey)[index] ?? null;
      },
      Preferences() {
        return preferences;
      },
      ConversationsListSize(myPublicKey) {
        return getConversations(myPublicKey).length;
      },
      ConversationsListAtIndex(myPublicKey, index) {
        return getConversations(myPublicKey)[index] ?? null;
      },
      PostByHash(hash) {
        return postMap[hash] ?? null;
      },
      PostListSize(authorPublicKey) {
        return getPostList(authorPublicKey).length;
      },
      PostListAtIndex(authorPublicKey, index) {
        return getPostList(authorPublicKey)[index] ?? null;
      },
      PostFeedSize(myPublicKey) {
        return getPostFeed(myPublicKey).length;
      },
      PostFeedAtIndex(myPublicKey, index) {
        return getPostFeed(myPublicKey)[index] ?? null;
      },
    };
  }
);

function calculateMessageHash({
  senderPublicKey,
  recipientPublicKey,
  text,
  createdAtEpoch,
  attachments,
}: {
  senderPublicKey: string;
  recipientPublicKey: string;
  text: string;
  createdAtEpoch: number;
  attachments: Array<{ name: string; contentHash: string }>;
}) {
  const state = libsodium.crypto_generichash_init("message", libsodium.crypto_generichash_KEYBYTES);
  libsodium.crypto_generichash_update(state, senderPublicKey);
  libsodium.crypto_generichash_update(state, recipientPublicKey);
  libsodium.crypto_generichash_update(state, createdAtEpoch.toString());
  libsodium.crypto_generichash_update(state, text);
  for (const attachment of attachments) {
    libsodium.crypto_generichash_update(state, attachment.name);
    libsodium.crypto_generichash_update(state, attachment.contentHash);
  }
  return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
}

export function calculatePostHash({
  authorPublicKey,
  text,
  createdAtEpoch,
  attachments,
}: {
  authorPublicKey: string;
  text: string;
  createdAtEpoch: number;
  attachments: Array<{ name: string; contentHash: string }>;
}) {
  const state = libsodium.crypto_generichash_init("post", libsodium.crypto_generichash_KEYBYTES);
  libsodium.crypto_generichash_update(state, authorPublicKey);
  libsodium.crypto_generichash_update(state, createdAtEpoch.toString());
  libsodium.crypto_generichash_update(state, text);
  for (const attachment of attachments) {
    libsodium.crypto_generichash_update(state, attachment.name);
    libsodium.crypto_generichash_update(state, attachment.contentHash);
  }
  return libsodium.crypto_generichash_final(state, libsodium.crypto_generichash_KEYBYTES, "hex");
}
