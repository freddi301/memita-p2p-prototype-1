import libsodium from "libsodium-wrappers";
import {
  DescriptionImplementation,
  ensureRpcDefinition,
} from "./framework/rpc-framework";
import { DateTime } from "luxon";

export const localRpcDefinition = <Serialized>({
  object,
  string,
  custom,
  empty,
  enumeration,
  array,
  number,
}: DescriptionImplementation<Serialized>) => {
  const accountPublicKey = custom({
    intermediate: string,
    serialize(accountPublicKey: AccountPublicKey) {
      return accountPublicKey.toBase64();
    },
    deserialize(hex) {
      return AccountPublicKey.fromBase64(hex);
    },
  });
  const date = custom({
    intermediate: number,
    serialize(dateTime: DateTime) {
      return dateTime.toMillis();
    },
    deserialize(millis) {
      return DateTime.fromMillis(millis);
    },
  });
  const draft = object({
    id: string,
    text: string,
    updatedAt: date,
  });
  return ensureRpcDefinition<Serialized>()({
    saveContact: {
      request: object({
        name: string,
        accountPublicKey,
      }),
      response: empty,
    },
    allContacts: {
      request: object({
        orderBy: enumeration({ "name-ascending": empty }),
      }),
      response: array(
        object({
          name: string,
          accountPublicKey,
        })
      ),
    },
    createDraft: {
      request: object({
        text: string,
      }),
      response: object({
        id: string,
      }),
    },
    updateDraft: {
      request: object({
        id: string,
        text: string,
      }),
      response: empty,
    },
    allDrafts: {
      request: object({
        orderBy: enumeration({ "date-descending": empty }),
      }),
      response: array(draft),
    },
    draftById: {
      request: object({
        id: string,
      }),
      response: draft,
    },
  });
};

// TODO move to own file
// https://libsodium.gitbook.io/doc/public-key_cryptography/authenticated_encryption
export class AccountPublicKey {
  private publicKey: Uint8Array;
  private constructor(publickKey: Uint8Array) {
    if (publickKey.length !== libsodium.crypto_box_PUBLICKEYBYTES)
      throw new Error();
    this.publicKey = publickKey;
  }
  toUint8Array() {
    return this.publicKey;
  }
  static fromUint8Array(uint8Array: Uint8Array) {
    return new AccountPublicKey(uint8Array);
  }
  toBase64(): string {
    return libsodium.to_base64(this.publicKey);
  }
  static fromBase64(Base64: string) {
    return new AccountPublicKey(libsodium.from_base64(Base64));
  }
  toHex(): string {
    return libsodium.to_hex(this.publicKey);
  }
  static fromHex(hex: string) {
    return new AccountPublicKey(libsodium.from_hex(hex));
  }
}

export class AccountSecretKey {
  readonly publicKey: AccountPublicKey;
  private privateKey: Uint8Array;
  private constructor(keyPair: libsodium.KeyPair) {
    this.publicKey = AccountPublicKey.fromUint8Array(keyPair.publicKey);
    this.privateKey = keyPair.privateKey;
  }
  static create() {
    return new AccountSecretKey(libsodium.crypto_box_keypair());
  }
}
