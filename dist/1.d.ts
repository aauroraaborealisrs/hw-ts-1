declare function promiseAll<T>(promises: Iterable<T | PromiseLike<T>>): Promise<T[]>;
declare function promiseAll2<T extends readonly unknown[]>(// чтоб работало с as const
promises: T): Promise<{
    [K in keyof T]: Awaited<T[K]>;
}>;
declare const p1: Promise<number>;
declare const p2: Promise<number>;
declare const a: Promise<unknown>;
declare const b: Promise<unknown>;
declare const ok: Promise<string>;
declare const fail: Promise<never>;
declare const thenableNumber: PromiseLike<number>;
