import { DateTime } from "luxon";
import {
  DescriptionImplementation,
  ensureRpcDefinition,
} from "../framework/rpc-framework";
import { AccountPublicKey } from "../local/definition";

export const remoteRpcDefinition = <Serialized>({
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
      return accountPublicKey.toHex();
    },
    deserialize(hex) {
      return AccountPublicKey.fromHex(hex);
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
  return ensureRpcDefinition<Serialized>()({
    replicateMessage: {
      request: object({
        sender: accountPublicKey,
        recipient: accountPublicKey,
        text: string,
        createdAt: date,
      }),
      response: empty,
    },
    whoAreYou: {
      request: empty,
      response: object({
        accountPublicKey,
        device: string,
      }),
    },
  });
};
