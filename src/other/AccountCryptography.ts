import libsodium from "libsodium-wrappers";

// https://libsodium.gitbook.io/doc/public-key_cryptography/authenticated_encryption
export class AccountPublicKey {
  private publicKey: Uint8Array;
  private constructor(publickKey: Uint8Array) {
    if (publickKey.length !== libsodium.crypto_box_PUBLICKEYBYTES) throw new Error();
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
  equals(other: AccountPublicKey) {
    return compareBuffers(this.publicKey.buffer, other.publicKey.buffer);
  }
}

export class AccountSecretKey {
  private privateKey: Uint8Array;
  private constructor(privateKey: Uint8Array) {
    if (privateKey.length !== libsodium.crypto_box_SECRETKEYBYTES) throw new Error();
    this.privateKey = privateKey;
  }
  toUint8Array() {
    return this.privateKey;
  }
  static fromUint8Array(uint8Array: Uint8Array) {
    return new AccountSecretKey(uint8Array);
  }
  toBase64(): string {
    return libsodium.to_base64(this.privateKey);
  }
  static fromBase64(Base64: string) {
    return new AccountSecretKey(libsodium.from_base64(Base64));
  }
  toHex(): string {
    return libsodium.to_hex(this.privateKey);
  }
  static fromHex(hex: string) {
    return new AccountSecretKey(libsodium.from_hex(hex));
  }
  equals(other: AccountSecretKey) {
    return compareBuffers(this.privateKey.buffer, other.privateKey.buffer);
  }
}

export class AccountKeyPair {
  readonly publicKey: AccountPublicKey;
  readonly privateKey: AccountSecretKey;
  private constructor(keyPair: libsodium.KeyPair) {
    this.publicKey = AccountPublicKey.fromUint8Array(keyPair.publicKey);
    this.privateKey = AccountSecretKey.fromUint8Array(keyPair.privateKey);
  }
  static create() {
    return new AccountKeyPair(libsodium.crypto_box_keypair());
  }
}

function compareBuffers(buf1: ArrayBuffer, buf2: ArrayBuffer) {
  if (buf1 === buf2) return true;
  if (buf1.byteLength !== buf2.byteLength) return false;
  const view1 = new DataView(buf1);
  const view2 = new DataView(buf2);
  let i = buf1.byteLength;
  while (i--) {
    if (view1.getUint8(i) !== view2.getUint8(i)) return false;
  }
  return true;
}
