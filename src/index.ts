import type { QueryKey } from "@tanstack/react-query";

type Query = Partial<{
  list: Function;
  detail: Function;
  [key: string]: Function;
}>;

type Mutation = Partial<{
  create: Function;
  update: Function;
  delete: Function;
  [key: string]: Function;
}>;

export type CreateInput<Q extends Query, M extends Mutation> = {
  root: QueryKey;
  query: Q;
  mutation: M;
};

export type Store<Q extends Query, M extends Mutation> = {
  key: {
    root: QueryKey;
    base: Record<keyof Q, QueryKey>;
    generator: Record<keyof Q, (queryKey?: QueryKey) => QueryKey>;
  };
  query: Q;
  mutation: M;
};

export const create = <Q extends Query, M extends Mutation>(
  input: Partial<CreateInput<Q, M>>
): Store<Q, M> => {
  type Key = Store<Q, M>["key"];
  type Query = Store<Q, M>["query"];
  type Mutation = Store<Q, M>["mutation"];

  const { root = [], query = {} as Query, mutation = {} as Mutation } = input;

  const queryFnKeys: (keyof Q)[] = Object.keys(query);

  return {
    key: {
      root,
      base: queryFnKeys.reduce(
        (acc, fnKey) => ({ ...acc, [fnKey]: [...root, fnKey] }),
        {} as Key["base"]
      ),
      generator: queryFnKeys.reduce(
        (acc, fnKey) => ({
          ...acc,
          [fnKey]: (queryKey: QueryKey = []) => [...root, fnKey, ...queryKey],
        }),
        {} as Key["generator"]
      ),
    },
    query,
    mutation,
  };
};
