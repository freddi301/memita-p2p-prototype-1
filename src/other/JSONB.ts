export const JSONB = {
  stringify(value: unknown, reviver?: null, indentation?: number) {
    return JSON.stringify(
      value,
      (key: string, value: unknown) => {
        if (value instanceof Uint8Array) {
          return { Uint8Array: Buffer.from(value).toString("base64") };
        }
        return value;
      },
      indentation
    );
  },
  parse(value: string): unknown {
    return JSON.parse(value, (key, value) => {
      if (value && value.Uint8Array) {
        return Uint8Array.from(Buffer.from(value.Uint8Array, "base64"));
      }
      return value;
    });
  },
};
