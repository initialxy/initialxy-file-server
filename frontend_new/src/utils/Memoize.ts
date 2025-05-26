import { LRUCache}  from "lru-cache";

/**
 * Wrapper to create LRU cache based Memoization decorator. Default to cache
 * size of 1000.
 */
export default function (max?: number) {
  return (originalMethod: any, context: ClassMethodDecoratorContext) => {
    const cache = new LRUCache<string, any>({ max: max ?? 1000 });

    return function (this: any, ...args: any[]) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    };
  };
}