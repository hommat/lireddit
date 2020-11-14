import { Cache, QueryInput } from '@urql/exchange-graphcache';

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  updateFn: (result: Result, query: Query) => Query
) {
  return cache.updateQuery(
    queryInput,
    (data) => updateFn(result, data as any) as any
  );
}
