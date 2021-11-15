export const JSONB = {
  stringify(value: any) {
    return JSON.stringify(value, (key: string, value: any) => {
      if (value instanceof Uint8Array) {
        return { Uint8Array: Buffer.from(value).toString("base64") };
      }
      return value;
    });
  },
  parse(value: string) {
    return JSON.parse(value, (key, value) => {
      if (value && value.Uint8Array) {
        return Uint8Array.from(Buffer.from(value.Uint8Array, "base64"));
      }
      return value;
    });
  },
};
