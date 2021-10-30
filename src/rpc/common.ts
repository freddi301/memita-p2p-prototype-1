import { DateTime } from "luxon";
import { AccountPublicKey } from "./local/definition";
import libsodium from "libsodium-wrappers";

export function hashMessage(message: {
  sender: AccountPublicKey;
  recipient: AccountPublicKey;
  text: string;
  createdAt: DateTime;
}) {
  return libsodium.to_hex(
    libsodium.crypto_generichash(
      libsodium.crypto_generichash_BYTES,
      JSON.stringify({
        sender: message.sender.toHex(),
        recipient: message.recipient.toHex(),
        text: message.text,
        createtAt: message.createdAt.toMillis(),
      })
    )
  );
}
