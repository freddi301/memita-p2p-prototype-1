import { DescriptionImplementation } from "./rpc-framework";

export const jsonSerializable: DescriptionImplementation<unknown> = {
  boolean: {
    serialize(value) {
      return value;
    },
    deserialize(data) {
      if (typeof data !== "boolean") throw new Error();
      return data;
    },
  },
  number: {
    serialize(value) {
      return value;
    },
    deserialize(data) {
      if (typeof data !== "number") throw new Error();
      return data;
    },
  },
  string: {
    serialize(value) {
      return value;
    },
    deserialize(data) {
      if (typeof data !== "string") throw new Error();
      return data;
    },
  },
  array(itemDescription) {
    return {
      serialize(value) {
        return value.map((item) => itemDescription.serialize(item));
      },
      deserialize(data) {
        if (!(data instanceof Array)) throw new Error();
        return data.map((item) => itemDescription.deserialize(item));
      },
    };
  },
  object(entriesDescription) {
    return {
      serialize(value) {
        return Object.fromEntries(
          Object.entries(value).map(([key, value]) => {
            return [key, entriesDescription[key].serialize(value)];
          })
        );
      },
      deserialize(data) {
        if (!(data instanceof Object)) throw new Error();
        return Object.fromEntries(
          Object.entries(data).map(([key, value]) => {
            return [key, entriesDescription[key].deserialize(value)];
          })
        ) as any;
      },
    };
  },
  enumeration(entriesDescription) {
    return {
      serialize(value) {
        return {
          type: value.type,
          payload: entriesDescription[value.type].serialize(value.payload),
        };
      },
      deserialize(data) {
        if (!(data instanceof Object)) throw new Error();
        if (!("type" in data)) throw new Error();
        if (!("playload" in data)) throw new Error();
        if (!((data as any).type in entriesDescription)) throw new Error();
        return {
          type: (data as any).type,
          payload: entriesDescription[(data as any).type].deserialize(
            (data as any).payload
          ),
        } as any;
      },
    };
  },
  custom(description) {
    return {
      serialize(value) {
        return description.intermediate.serialize(description.serialize(value));
      },
      deserialize(data) {
        return description.deserialize(
          description.intermediate.deserialize(data)
        );
      },
    };
  },
};
