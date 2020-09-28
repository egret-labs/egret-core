declare namespace ts {
    type GetIteratorCallback = <I extends readonly any[] | ReadonlySetShim<any> | ReadonlyMapShim<any, any> | undefined>(iterable: I) => IteratorShim<I extends ReadonlyMapShim<infer K, infer V> ? [K, V] : I extends ReadonlySetShim<infer T> ? T : I extends readonly (infer T)[] ? T : I extends undefined ? undefined : never>;
    type IteratorResultShim<T> = {
        value: T;
        done?: false;
    } | {
        value: never;
        done: true;
    };
    interface IteratorShim<T> {
        next(): IteratorResultShim<T>;
    }
    interface ReadonlyMapShim<K, V> {
        readonly size: number;
        get(key: K): V | undefined;
        has(key: K): boolean;
        keys(): IteratorShim<K>;
        values(): IteratorShim<V>;
        entries(): IteratorShim<[K, V]>;
        forEach(action: (value: V, key: K) => void): void;
    }
    interface MapShim<K, V> extends ReadonlyMapShim<K, V> {
        set(key: K, value: V): this;
        delete(key: K): boolean;
        clear(): void;
    }
    type MapShimConstructor = new <K, V>(iterable?: readonly (readonly [K, V])[] | ReadonlyMapShim<K, V>) => MapShim<K, V>;
    interface ReadonlySetShim<T> {
        readonly size: number;
        has(value: T): boolean;
        keys(): IteratorShim<T>;
        values(): IteratorShim<T>;
        entries(): IteratorShim<[T, T]>;
        forEach(action: (value: T, key: T) => void): void;
    }
    interface SetShim<T> extends ReadonlySetShim<T> {
        add(value: T): this;
        delete(value: T): boolean;
        clear(): void;
    }
    type SetShimConstructor = new <T>(iterable?: readonly T[] | ReadonlySetShim<T>) => SetShim<T>;
    export namespace ShimCollections {
        function createMapShim(getIterator: GetIteratorCallback): MapShimConstructor;
        function createSetShim(getIterator: GetIteratorCallback): SetShimConstructor;
    }
    export {};
}
//# sourceMappingURL=shims.d.ts.map