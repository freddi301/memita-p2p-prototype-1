import {
  DescriptionImplementation,
  ensureRpcDefinition,
} from "../framework/rpc-framework";

export const remoteRpcDefinition = <Serialized>({
  object,
  string,
  custom,
  empty,
  enumeration,
  array,
  number,
}: DescriptionImplementation<Serialized>) => {
  return ensureRpcDefinition<Serialized>()({
    replicate: {
      request: string,
      response: empty,
    },
  });
};

// TODO
