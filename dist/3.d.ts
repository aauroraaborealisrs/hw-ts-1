declare function memoize<T extends (...args: (string | number)[]) => unknown>(fn: T): (this: unknown, ...args: Parameters<T>) => ReturnType<T>;
declare function memoize2<T extends (...args: unknown[]) => unknown>(fn: T): (this: unknown, ...args: Parameters<T>) => ReturnType<T>;
