// import libsodium from "libsodium-wrappers";
import {
  DescriptionImplementation,
  ensureRpcDefinition,
} from "./framework/rpc-framework";

export const localRpcDefinition = <Serialized>({
  object,
  string,
  enumeration,
}: DescriptionImplementation<Serialized>) =>
  ensureRpcDefinition<Serialized>()({
    saveContact: {
      request: object({
        name: string,
      }),
      response: enumeration({
        ok: object({}),
        ko: object({}),
      }),
    },
  });

// https://libsodium.gitbook.io/doc/public-key_cryptography/authenticated_encryption

// export class AccountPublicKey {
//   private publicKey: Uint8Array;
//   private constructor(publickKey: Uint8Array) {
//     if (publickKey.length !== libsodium.crypto_box_PUBLICKEYBYTES)
//       throw new Error();
//     this.publicKey = publickKey;
//   }
//   toHex(): string {
//     return libsodium.to_hex(this.publicKey);
//   }
//   static fromHex(hex: string) {
//     return new AccountPublicKey(libsodium.from_hex(hex));
//   }
// }
