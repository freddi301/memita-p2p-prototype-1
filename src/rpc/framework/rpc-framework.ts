type Description<Deserialized, Serialized> = {
  serialize(deserialized: Deserialized): Serialized;
  deserialize(serialized: Serialized): Deserialized;
};
type DeserializedOfDescription<D> = D extends Description<infer T, any>
  ? T
  : never;

export type DescriptionImplementation<Serialized> = {
  string: Description<string, Serialized>;
  boolean: Description<boolean, Serialized>;
  number: Description<number, Serialized>;
  array<Item>(
    item: Description<Item, Serialized>
  ): Description<Array<Item>, Serialized>;
  object<Entries extends { [key: string]: Description<any, Serialized> }>(
    entries: Entries
  ): Description<
    { [Key in keyof Entries]: DeserializedOfDescription<Entries[Key]> },
    Serialized
  >;
  enumeration<Entries extends { [key: string]: Description<any, Serialized> }>(
    entries: Entries
  ): Description<
    {
      [Key in keyof Entries]: {
        type: Key;
        payload: DeserializedOfDescription<Entries[Key]>;
      };
    }[keyof Entries],
    Serialized
  >;
  custom<
    Deserialized,
    Intermediate extends Description<any, Serialized>
  >(params: {
    intermediate: Intermediate;
    serialize: (
      deserialized: Deserialized
    ) => DeserializedOfDescription<Intermediate>;
    deserialize: (
      serialized: DeserializedOfDescription<Intermediate>
    ) => Deserialized;
  }): Description<Deserialized, Serialized>;
};

type RpcDefinitionShape<Serialized> = {
  [key: string]: {
    request: Description<any, Serialized>;
    response: Description<any, Serialized>;
  };
};
export const ensureRpcDefinition =
  <Serialized>() =>
  <D extends RpcDefinitionShape<Serialized>>(definition: D) =>
    definition;

export function makeRpcClient<
  Serialized,
  D extends RpcDefinitionShape<Serialized>
>(
  descriptionImplementation: DescriptionImplementation<Serialized>,
  rpcDefinition: D,
  implementation: (
    callDescription: {
      [K in keyof D]: { type: K; payload: Serialized };
    }[keyof D]
  ) => Promise<Serialized>
): {
  [Key in keyof D]: (
    request: DeserializedOfDescription<D[Key]["request"]>
  ) => Promise<DeserializedOfDescription<D[Key]["response"]>>;
} {
  return Object.fromEntries(
    Object.entries(rpcDefinition).map(([key, descriptions]) => {
      return [
        key,
        async (request: any) => {
          return descriptions.response.deserialize(
            await implementation({
              type: key,
              payload: descriptions.request.serialize(request),
            })
          );
        },
      ];
    })
  ) as any;
}
