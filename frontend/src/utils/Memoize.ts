import Cache from "lru-cache";
import { Memoize } from "ts-memoize-decorator";

/**
 * Wrapper around ts-memoize-decorator to choose between Map vs LRU cache
 * depending on decorator param
 */
export default function (max?: number): MethodDecorator {
  return Memoize({
    cacheFactory: () => max != null ? new Cache(max) : new Map(),
  });
}