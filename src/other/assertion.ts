// assertion library
// used to validate javascript structures
// without creating new instances
// ex: object({x: literal(5)})({x: 5}) === true

export type Assertion<Value> = (value: unknown) => value is Value;
type ValueOfAssertion<A extends Assertion<any>> = A extends Assertion<infer Value> ? Value : never;

export const isLiteral =
  <L extends string | number | boolean>(literal: L): Assertion<L> =>
  (value): value is L =>
    value === literal;

export const isString: Assertion<string> = (value): value is string => typeof value === "string";

export const isNumber: Assertion<number> = (value): value is number => typeof value === "number";

export const isObject =
  <Entries extends Record<string, Assertion<any>>>(
    entries: Entries
  ): Assertion<{ [Key in keyof Entries]: ValueOfAssertion<Entries[Key]> }> =>
  (value): value is { [Key in keyof Entries]: ValueOfAssertion<Entries[Key]> } =>
    typeof value === "object" &&
    value !== null &&
    Object.entries(entries).every(([key, assertion]) => assertion((value as Record<string, unknown>)[key]));

export const isArray =
  <Item>(itemAssertion: Assertion<Item>): Assertion<Array<Item>> =>
  (value): value is Array<Item> =>
    value instanceof Array && value.every(itemAssertion);

export const isAlternative =
  <Items extends Assertion<any>[]>(items: Items): Assertion<ValueOfAssertion<Items[number]>> =>
  (value): value is ValueOfAssertion<Items[number]> =>
    items.some((assertion) => assertion(value));

export const isInstanceof =
  <T>(klass: { new (...args: any[]): T }): Assertion<T> =>
  (value): value is T =>
    value instanceof klass;

export const refine =
  <Value>(assertion: Assertion<Value>, refinement: (value: Value) => boolean): Assertion<Value> =>
  (value): value is Value =>
    assertion(value) ? refinement(value) : false;
