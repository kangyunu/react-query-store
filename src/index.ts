import type { QueryKey } from "@tanstack/react-query";

type Query = Partial<{
  list: Function;
  detail: Function;
  create: Function;
  update: Function;
  delete: Function;
  [key: string]: Function;
}>;

export type CreateInput<Q extends Query> = {
  root: QueryKey;
  query: Q;
};

export type Store<Q extends Query> = {
  key: {
    root: QueryKey;
    base: Record<keyof Q, QueryKey>;
    generator: Record<keyof Q, (queryKey?: QueryKey) => QueryKey>;
  };
  query: Q;
};

export const create = <Q extends Query>(
  input: Partial<CreateInput<Q>>,
): Store<Q> => {
  type Key = Store<Q>["key"];
  type Query = Store<Q>["query"];

  const { root = [], query = {} as Query } = input;

  const queryFnKeys: (keyof Q)[] = Object.keys(query);

  return {
    key: {
      root,
      base: queryFnKeys.reduce(
        (acc, fnKey) => ({ ...acc, [fnKey]: [...root, fnKey] }),
        {} as Key["base"],
      ),
      generator: queryFnKeys.reduce(
        (acc, fnKey) => ({
          ...acc,
          [fnKey]: (queryKey: QueryKey = []) => [...root, fnKey, ...queryKey],
        }),
        {} as Key["generator"],
      ),
    },
    query,
  };
};
