declare namespace ts {
    const versionMajorMinor = "4.2";
    /** The version of the TypeScript compiler release */
    const version: string;
    /**
     * Type of objects whose values are all of the same type.
     * The `in` and `for-in` operators can *not* be safely used,
     * since `Object.prototype` may be modified by outside code.
     */
    interface MapLike<T> {
        [index: string]: T;
    }
    interface SortedReadonlyArray<T> extends ReadonlyArray<T> {
        " __sortedArrayBrand": any;
    }
    interface SortedArray<T> extends Array<T> {
        " __sortedArrayBrand": any;
    }
    /** Common read methods for ES6 Map/Set. */
    interface ReadonlyCollection<K> {
        readonly size: number;
        has(key: K): boolean;
        keys(): Iterator<K>;
    }
    /** Common write methods for ES6 Map/Set. */
    interface Collection<K> extends ReadonlyCollection<K> {
        delete(key: K): boolean;
        clear(): void;
    }
    /** ES6 Map interface, only read methods included. */
    interface ReadonlyESMap<K, V> extends ReadonlyCollection<K> {
        get(key: K): V | undefined;
        values(): Iterator<V>;
        entries(): Iterator<[K, V]>;
        forEach(action: (value: V, key: K) => void): void;
    }
    /**
     * ES6 Map interface, only read methods included.
     */
    interface ReadonlyMap<T> extends ReadonlyESMap<string, T> {
    }
    /** ES6 Map interface. */
    interface ESMap<K, V> extends ReadonlyESMap<K, V>, Collection<K> {
        set(key: K, value: V): this;
    }
    /**
     * ES6 Map interface.
     */
    interface Map<T> extends ESMap<string, T> {
    }
    interface MapConstructor {
        new <K, V>(iterable?: readonly (readonly [K, V])[] | ReadonlyESMap<K, V>): ESMap<K, V>;
    }
    /** ES6 Set interface, only read methods included. */
    interface ReadonlySet<T> extends ReadonlyCollection<T> {
        has(value: T): boolean;
        values(): Iterator<T>;
        entries(): Iterator<[T, T]>;
        forEach(action: (value: T, key: T) => void): void;
    }
    /** ES6 Set interface. */
    interface Set<T> extends ReadonlySet<T>, Collection<T> {
        add(value: T): this;
        delete(value: T): boolean;
    }
    interface SetConstructor {
        new <T>(iterable?: readonly T[] | ReadonlySet<T>): Set<T>;
    }
    /** ES6 Iterator type. */
    interface Iterator<T> {
        next(): {
            value: T;
            done?: false;
        } | {
            value: void;
            done: true;
        };
    }
    /** Array that is only intended to be pushed to, never read. */
    interface Push<T> {
        push(...values: T[]): void;
        readonly length: number;
    }
    type EqualityComparer<T> = (a: T, b: T) => boolean;
    type Comparer<T> = (a: T, b: T) => Comparison;
    const enum Comparison {
        LessThan = -1,
        EqualTo = 0,
        GreaterThan = 1
    }
    namespace NativeCollections {
        /**
         * Returns the native Map implementation if it is available and compatible (i.e. supports iteration).
         */
        function tryGetNativeMap(): MapConstructor | undefined;
        /**
         * Returns the native Set implementation if it is available and compatible (i.e. supports iteration).
         */
        function tryGetNativeSet(): SetConstructor | undefined;
    }
}
declare namespace ts {
    const Map: MapConstructor;
    const Set: SetConstructor;
    function getIterator<I extends readonly any[] | ReadonlySet<any> | ReadonlyESMap<any, any> | undefined>(iterable: I): Iterator<I extends ReadonlyESMap<infer K, infer V> ? [K, V] : I extends ReadonlySet<infer T> ? T : I extends readonly (infer T)[] ? T : I extends undefined ? undefined : never>;
    function getIterator<K, V>(iterable: ReadonlyESMap<K, V>): Iterator<[K, V]>;
    function getIterator<K, V>(iterable: ReadonlyESMap<K, V> | undefined): Iterator<[K, V]> | undefined;
    function getIterator<T>(iterable: readonly T[] | ReadonlySet<T>): Iterator<T>;
    function getIterator<T>(iterable: readonly T[] | ReadonlySet<T> | undefined): Iterator<T> | undefined;
    const emptyArray: never[];
    const emptyMap: ReadonlyESMap<never, never>;
    const emptySet: ReadonlySet<never>;
    /**
     * Create a new map.
     * @deprecated Use `new Map()` instead.
     */
    function createMap<K, V>(): ESMap<K, V>;
    function createMap<T>(): ESMap<string, T>;
    /**
     * Create a new map from a template object is provided, the map will copy entries from it.
     * @deprecated Use `new Map(getEntries(template))` instead.
     */
    function createMapFromTemplate<T>(template: MapLike<T>): ESMap<string, T>;
    function length(array: readonly any[] | undefined): number;
    /**
     * Iterates through 'array' by index and performs the callback on each element of array until the callback
     * returns a truthy value, then returns that value.
     * If no such value is found, the callback is applied to each element of array and undefined is returned.
     */
    function forEach<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
    /**
     * Like `forEach`, but iterates in reverse order.
     */
    function forEachRight<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
    /** Like `forEach`, but suitable for use with numbers and strings (which may be falsy). */
    function firstDefined<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
    function firstDefinedIterator<T, U>(iter: Iterator<T>, callback: (element: T) => U | undefined): U | undefined;
    function reduceLeftIterator<T, U>(iterator: Iterator<T> | undefined, f: (memo: U, value: T, i: number) => U, initial: U): U;
    function zipWith<T, U, V>(arrayA: readonly T[], arrayB: readonly U[], callback: (a: T, b: U, index: number) => V): V[];
    function zipToIterator<T, U>(arrayA: readonly T[], arrayB: readonly U[]): Iterator<[T, U]>;
    function zipToMap<K, V>(keys: readonly K[], values: readonly V[]): ESMap<K, V>;
    /**
     * Creates a new array with `element` interspersed in between each element of `input`
     * if there is more than 1 value in `input`. Otherwise, returns the existing array.
     */
    function intersperse<T>(input: T[], element: T): T[];
    /**
     * Iterates through `array` by index and performs the callback on each element of array until the callback
     * returns a falsey value, then returns false.
     * If no such value is found, the callback is applied to each element of array and `true` is returned.
     */
    function every<T>(array: readonly T[] | undefined, callback: (element: T, index: number) => boolean): boolean;
    /** Works like Array.prototype.find, returning `undefined` if no element satisfying the predicate is found. */
    function find<T, U extends T>(array: readonly T[], predicate: (element: T, index: number) => element is U): U | undefined;
    function find<T>(array: readonly T[], predicate: (element: T, index: number) => boolean): T | undefined;
    function findLast<T, U extends T>(array: readonly T[], predicate: (element: T, index: number) => element is U): U | undefined;
    function findLast<T>(array: readonly T[], predicate: (element: T, index: number) => boolean): T | undefined;
    /** Works like Array.prototype.findIndex, returning `-1` if no element satisfying the predicate is found. */
    function findIndex<T>(array: readonly T[], predicate: (element: T, index: number) => boolean, startIndex?: number): number;
    function findLastIndex<T>(array: readonly T[], predicate: (element: T, index: number) => boolean, startIndex?: number): number;
    /**
     * Returns the first truthy result of `callback`, or else fails.
     * This is like `forEach`, but never returns undefined.
     */
    function findMap<T, U>(array: readonly T[], callback: (element: T, index: number) => U | undefined): U;
    function contains<T>(array: readonly T[] | undefined, value: T, equalityComparer?: EqualityComparer<T>): boolean;
    function arraysEqual<T>(a: readonly T[], b: readonly T[], equalityComparer?: EqualityComparer<T>): boolean;
    function indexOfAnyCharCode(text: string, charCodes: readonly number[], start?: number): number;
    function countWhere<T>(array: readonly T[], predicate: (x: T, i: number) => boolean): number;
    /**
     * Filters an array by a predicate function. Returns the same array instance if the predicate is
     * true for all elements, otherwise returns a new array instance containing the filtered subset.
     */
    function filter<T, U extends T>(array: T[], f: (x: T) => x is U): U[];
    function filter<T>(array: T[], f: (x: T) => boolean): T[];
    function filter<T, U extends T>(array: readonly T[], f: (x: T) => x is U): readonly U[];
    function filter<T, U extends T>(array: readonly T[], f: (x: T) => boolean): readonly T[];
    function filter<T, U extends T>(array: T[] | undefined, f: (x: T) => x is U): U[] | undefined;
    function filter<T>(array: T[] | undefined, f: (x: T) => boolean): T[] | undefined;
    function filter<T, U extends T>(array: readonly T[] | undefined, f: (x: T) => x is U): readonly U[] | undefined;
    function filter<T, U extends T>(array: readonly T[] | undefined, f: (x: T) => boolean): readonly T[] | undefined;
    function filterMutate<T>(array: T[], f: (x: T, i: number, array: T[]) => boolean): void;
    function clear(array: {}[]): void;
    function map<T, U>(array: readonly T[], f: (x: T, i: number) => U): U[];
    function map<T, U>(array: readonly T[] | undefined, f: (x: T, i: number) => U): U[] | undefined;
    function mapIterator<T, U>(iter: Iterator<T>, mapFn: (x: T) => U): Iterator<U>;
    function sameMap<T>(array: T[], f: (x: T, i: number) => T): T[];
    function sameMap<T>(array: readonly T[], f: (x: T, i: number) => T): readonly T[];
    function sameMap<T>(array: T[] | undefined, f: (x: T, i: number) => T): T[] | undefined;
    function sameMap<T>(array: readonly T[] | undefined, f: (x: T, i: number) => T): readonly T[] | undefined;
    /**
     * Flattens an array containing a mix of array or non-array elements.
     *
     * @param array The array to flatten.
     */
    function flatten<T>(array: T[][] | readonly (T | readonly T[] | undefined)[]): T[];
    /**
     * Maps an array. If the mapped value is an array, it is spread into the result.
     *
     * @param array The array to map.
     * @param mapfn The callback used to map the result into one or more values.
     */
    function flatMap<T, U>(array: readonly T[] | undefined, mapfn: (x: T, i: number) => U | readonly U[] | undefined): readonly U[];
    function flatMapToMutable<T, U>(array: readonly T[] | undefined, mapfn: (x: T, i: number) => U | readonly U[] | undefined): U[];
    function flatMapIterator<T, U>(iter: Iterator<T>, mapfn: (x: T) => readonly U[] | Iterator<U> | undefined): Iterator<U>;
    /**
     * Maps an array. If the mapped value is an array, it is spread into the result.
     * Avoids allocation if all elements map to themselves.
     *
     * @param array The array to map.
     * @param mapfn The callback used to map the result into one or more values.
     */
    function sameFlatMap<T>(array: T[], mapfn: (x: T, i: number) => T | readonly T[]): T[];
    function sameFlatMap<T>(array: readonly T[], mapfn: (x: T, i: number) => T | readonly T[]): readonly T[];
    function mapAllOrFail<T, U>(array: readonly T[], mapFn: (x: T, i: number) => U | undefined): U[] | undefined;
    function mapDefined<T, U>(array: readonly T[] | undefined, mapFn: (x: T, i: number) => U | undefined): U[];
    function mapDefinedIterator<T, U>(iter: Iterator<T>, mapFn: (x: T) => U | undefined): Iterator<U>;
    function mapDefinedEntries<K1, V1, K2, V2>(map: ReadonlyESMap<K1, V1>, f: (key: K1, value: V1) => readonly [K2, V2] | undefined): ESMap<K2, V2>;
    function mapDefinedEntries<K1, V1, K2, V2>(map: ReadonlyESMap<K1, V1> | undefined, f: (key: K1, value: V1) => readonly [K2 | undefined, V2 | undefined] | undefined): ESMap<K2, V2> | undefined;
    function mapDefinedValues<V1, V2>(set: ReadonlySet<V1>, f: (value: V1) => V2 | undefined): Set<V2>;
    function mapDefinedValues<V1, V2>(set: ReadonlySet<V1> | undefined, f: (value: V1) => V2 | undefined): Set<V2> | undefined;
    function getOrUpdate<K, V>(map: ESMap<K, V>, key: K, callback: () => V): V;
    function tryAddToSet<T>(set: Set<T>, value: T): boolean;
    const emptyIterator: Iterator<never>;
    function singleIterator<T>(value: T): Iterator<T>;
    /**
     * Maps contiguous spans of values with the same key.
     *
     * @param array The array to map.
     * @param keyfn A callback used to select the key for an element.
     * @param mapfn A callback used to map a contiguous chunk of values to a single value.
     */
    function spanMap<T, K, U>(array: readonly T[], keyfn: (x: T, i: number) => K, mapfn: (chunk: T[], key: K, start: number, end: number) => U): U[];
    function spanMap<T, K, U>(array: readonly T[] | undefined, keyfn: (x: T, i: number) => K, mapfn: (chunk: T[], key: K, start: number, end: number) => U): U[] | undefined;
    function mapEntries<K1, V1, K2, V2>(map: ReadonlyESMap<K1, V1>, f: (key: K1, value: V1) => readonly [K2, V2]): ESMap<K2, V2>;
    function mapEntries<K1, V1, K2, V2>(map: ReadonlyESMap<K1, V1> | undefined, f: (key: K1, value: V1) => readonly [K2, V2]): ESMap<K2, V2> | undefined;
    function some<T>(array: readonly T[] | undefined): array is readonly T[];
    function some<T>(array: readonly T[] | undefined, predicate: (value: T) => boolean): boolean;
    /** Calls the callback with (start, afterEnd) index pairs for each range where 'pred' is true. */
    function getRangesWhere<T>(arr: readonly T[], pred: (t: T) => boolean, cb: (start: number, afterEnd: number) => void): void;
    function concatenate<T>(array1: T[], array2: T[]): T[];
    function concatenate<T>(array1: readonly T[], array2: readonly T[]): readonly T[];
    function concatenate<T>(array1: T[] | undefined, array2: T[] | undefined): T[];
    function concatenate<T>(array1: readonly T[] | undefined, array2: readonly T[] | undefined): readonly T[];
    function indicesOf(array: readonly unknown[]): number[];
    /**
     * Deduplicates an unsorted array.
     * @param equalityComparer An `EqualityComparer` used to determine if two values are duplicates.
     * @param comparer An optional `Comparer` used to sort entries before comparison, though the
     * result will remain in the original order in `array`.
     */
    function deduplicate<T>(array: readonly T[], equalityComparer: EqualityComparer<T>, comparer?: Comparer<T>): T[];
    function insertSorted<T>(array: SortedArray<T>, insert: T, compare: Comparer<T>): void;
    function sortAndDeduplicate<T>(array: readonly string[]): SortedReadonlyArray<string>;
    function sortAndDeduplicate<T>(array: readonly T[], comparer: Comparer<T>, equalityComparer?: EqualityComparer<T>): SortedReadonlyArray<T>;
    function arrayIsSorted<T>(array: readonly T[], comparer: Comparer<T>): boolean;
    function arrayIsEqualTo<T>(array1: readonly T[] | undefined, array2: readonly T[] | undefined, equalityComparer?: (a: T, b: T, index: number) => boolean): boolean;
    /**
     * Compacts an array, removing any falsey elements.
     */
    function compact<T>(array: (T | undefined | null | false | 0 | "")[]): T[];
    function compact<T>(array: readonly (T | undefined | null | false | 0 | "")[]): readonly T[];
    function compact<T>(array: T[]): T[];
    function compact<T>(array: readonly T[]): readonly T[];
    /**
     * Gets the relative complement of `arrayA` with respect to `arrayB`, returning the elements that
     * are not present in `arrayA` but are present in `arrayB`. Assumes both arrays are sorted
     * based on the provided comparer.
     */
    function relativeComplement<T>(arrayA: T[] | undefined, arrayB: T[] | undefined, comparer: Comparer<T>): T[] | undefined;
    function sum<T extends Record<K, number>, K extends string>(array: readonly T[], prop: K): number;
    /**
     * Appends a value to an array, returning the array.
     *
     * @param to The array to which `value` is to be appended. If `to` is `undefined`, a new array
     * is created if `value` was appended.
     * @param value The value to append to the array. If `value` is `undefined`, nothing is
     * appended.
     */
    function append<TArray extends any[] | undefined, TValue extends NonNullable<TArray>[number] | undefined>(to: TArray, value: TValue): [undefined, undefined] extends [TArray, TValue] ? TArray : NonNullable<TArray>[number][];
    function append<T>(to: T[], value: T | undefined): T[];
    function append<T>(to: T[] | undefined, value: T): T[];
    function append<T>(to: T[] | undefined, value: T | undefined): T[] | undefined;
    function append<T>(to: Push<T>, value: T | undefined): void;
    /**
     * Combines two arrays, values, or undefineds into the smallest container that can accommodate the resulting set:
     *
     * ```
     * undefined -> undefined -> undefined
     * T -> undefined -> T
     * T -> T -> T[]
     * T[] -> undefined -> T[] (no-op)
     * T[] -> T -> T[]         (append)
     * T[] -> T[] -> T[]       (concatenate)
     * ```
     */
    function combine<T>(xs: T | readonly T[] | undefined, ys: T | readonly T[] | undefined): T | readonly T[] | undefined;
    function combine<T>(xs: T | T[] | undefined, ys: T | T[] | undefined): T | T[] | undefined;
    /**
     * Appends a range of value to an array, returning the array.
     *
     * @param to The array to which `value` is to be appended. If `to` is `undefined`, a new array
     * is created if `value` was appended.
     * @param from The values to append to the array. If `from` is `undefined`, nothing is
     * appended. If an element of `from` is `undefined`, that element is not appended.
     * @param start The offset in `from` at which to start copying values.
     * @param end The offset in `from` at which to stop copying values (non-inclusive).
     */
    function addRange<T>(to: T[], from: readonly T[] | undefined, start?: number, end?: number): T[];
    function addRange<T>(to: T[] | undefined, from: readonly T[] | undefined, start?: number, end?: number): T[] | undefined;
    /**
     * @return Whether the value was added.
     */
    function pushIfUnique<T>(array: T[], toAdd: T, equalityComparer?: EqualityComparer<T>): boolean;
    /**
     * Unlike `pushIfUnique`, this can take `undefined` as an input, and returns a new array.
     */
    function appendIfUnique<T>(array: T[] | undefined, toAdd: T, equalityComparer?: EqualityComparer<T>): T[];
    /**
     * Returns a new sorted array.
     */
    function sort<T>(array: readonly T[], comparer?: Comparer<T>): SortedReadonlyArray<T>;
    function arrayIterator<T>(array: readonly T[]): Iterator<T>;
    function arrayReverseIterator<T>(array: readonly T[]): Iterator<T>;
    /**
     * Stable sort of an array. Elements equal to each other maintain their relative position in the array.
     */
    function stableSort<T>(array: readonly T[], comparer: Comparer<T>): SortedReadonlyArray<T>;
    function rangeEquals<T>(array1: readonly T[], array2: readonly T[], pos: number, end: number): boolean;
    /**
     * Returns the element at a specific offset in an array if non-empty, `undefined` otherwise.
     * A negative offset indicates the element should be retrieved from the end of the array.
     */
    function elementAt<T>(array: readonly T[] | undefined, offset: number): T | undefined;
    /**
     * Returns the first element of an array if non-empty, `undefined` otherwise.
     */
    function firstOrUndefined<T>(array: readonly T[]): T | undefined;
    function first<T>(array: readonly T[]): T;
    /**
     * Returns the last element of an array if non-empty, `undefined` otherwise.
     */
    function lastOrUndefined<T>(array: readonly T[]): T | undefined;
    function last<T>(array: readonly T[]): T;
    /**
     * Returns the only element of an array if it contains only one element, `undefined` otherwise.
     */
    function singleOrUndefined<T>(array: readonly T[] | undefined): T | undefined;
    /**
     * Returns the only element of an array if it contains only one element; otherwise, returns the
     * array.
     */
    function singleOrMany<T>(array: T[]): T | T[];
    function singleOrMany<T>(array: readonly T[]): T | readonly T[];
    function singleOrMany<T>(array: T[] | undefined): T | T[] | undefined;
    function singleOrMany<T>(array: readonly T[] | undefined): T | readonly T[] | undefined;
    function replaceElement<T>(array: readonly T[], index: number, value: T): T[];
    /**
     * Performs a binary search, finding the index at which `value` occurs in `array`.
     * If no such index is found, returns the 2's-complement of first index at which
     * `array[index]` exceeds `value`.
     * @param array A sorted array whose first element must be no larger than number
     * @param value The value to be searched for in the array.
     * @param keySelector A callback used to select the search key from `value` and each element of
     * `array`.
     * @param keyComparer A callback used to compare two keys in a sorted array.
     * @param offset An offset into `array` at which to start the search.
     */
    function binarySearch<T, U>(array: readonly T[], value: T, keySelector: (v: T) => U, keyComparer: Comparer<U>, offset?: number): number;
    /**
     * Performs a binary search, finding the index at which an object with `key` occurs in `array`.
     * If no such index is found, returns the 2's-complement of first index at which
     * `array[index]` exceeds `key`.
     * @param array A sorted array whose first element must be no larger than number
     * @param key The key to be searched for in the array.
     * @param keySelector A callback used to select the search key from each element of `array`.
     * @param keyComparer A callback used to compare two keys in a sorted array.
     * @param offset An offset into `array` at which to start the search.
     */
    function binarySearchKey<T, U>(array: readonly T[], key: U, keySelector: (v: T, i: number) => U, keyComparer: Comparer<U>, offset?: number): number;
    function reduceLeft<T, U>(array: readonly T[] | undefined, f: (memo: U, value: T, i: number) => U, initial: U, start?: number, count?: number): U;
    function reduceLeft<T>(array: readonly T[], f: (memo: T, value: T, i: number) => T): T | undefined;
    /**
     * Indicates whether a map-like contains an own property with the specified key.
     *
     * @param map A map-like.
     * @param key A property key.
     */
    function hasProperty(map: MapLike<any>, key: string): boolean;
    /**
     * Gets the value of an owned property in a map-like.
     *
     * @param map A map-like.
     * @param key A property key.
     */
    function getProperty<T>(map: MapLike<T>, key: string): T | undefined;
    /**
     * Gets the owned, enumerable property keys of a map-like.
     */
    function getOwnKeys<T>(map: MapLike<T>): string[];
    function getAllKeys(obj: object): string[];
    function getOwnValues<T>(sparseArray: T[]): T[];
    function getEntries<T>(obj: MapLike<T>): [string, T][];
    function arrayOf<T>(count: number, f: (index: number) => T): T[];
    /** Shims `Array.from`. */
    function arrayFrom<T, U>(iterator: Iterator<T> | IterableIterator<T>, map: (t: T) => U): U[];
    function arrayFrom<T>(iterator: Iterator<T> | IterableIterator<T>): T[];
    function assign<T extends object>(t: T, ...args: (T | undefined)[]): T;
    /**
     * Performs a shallow equality comparison of the contents of two map-likes.
     *
     * @param left A map-like whose properties should be compared.
     * @param right A map-like whose properties should be compared.
     */
    function equalOwnProperties<T>(left: MapLike<T> | undefined, right: MapLike<T> | undefined, equalityComparer?: EqualityComparer<T>): boolean;
    /**
     * Creates a map from the elements of an array.
     *
     * @param array the array of input elements.
     * @param makeKey a function that produces a key for a given element.
     *
     * This function makes no effort to avoid collisions; if any two elements produce
     * the same key with the given 'makeKey' function, then the element with the higher
     * index in the array will be the one associated with the produced key.
     */
    function arrayToMap<K, V>(array: readonly V[], makeKey: (value: V) => K | undefined): ESMap<K, V>;
    function arrayToMap<K, V1, V2>(array: readonly V1[], makeKey: (value: V1) => K | undefined, makeValue: (value: V1) => V2): ESMap<K, V2>;
    function arrayToMap<T>(array: readonly T[], makeKey: (value: T) => string | undefined): ESMap<string, T>;
    function arrayToMap<T, U>(array: readonly T[], makeKey: (value: T) => string | undefined, makeValue: (value: T) => U): ESMap<string, U>;
    function arrayToNumericMap<T>(array: readonly T[], makeKey: (value: T) => number): T[];
    function arrayToNumericMap<T, U>(array: readonly T[], makeKey: (value: T) => number, makeValue: (value: T) => U): U[];
    function arrayToMultiMap<K, V>(values: readonly V[], makeKey: (value: V) => K): MultiMap<K, V>;
    function arrayToMultiMap<K, V, U>(values: readonly V[], makeKey: (value: V) => K, makeValue: (value: V) => U): MultiMap<K, U>;
    function group<T, K>(values: readonly T[], getGroupId: (value: T) => K): readonly (readonly T[])[];
    function group<T, K, R>(values: readonly T[], getGroupId: (value: T) => K, resultSelector: (values: readonly T[]) => R): R[];
    function group<T>(values: readonly T[], getGroupId: (value: T) => string): readonly (readonly T[])[];
    function group<T, R>(values: readonly T[], getGroupId: (value: T) => string, resultSelector: (values: readonly T[]) => R): R[];
    function clone<T>(object: T): T;
    /**
     * Creates a new object by adding the own properties of `second`, then the own properties of `first`.
     *
     * NOTE: This means that if a property exists in both `first` and `second`, the property in `first` will be chosen.
     */
    function extend<T1, T2>(first: T1, second: T2): T1 & T2;
    function copyProperties<T1 extends T2, T2>(first: T1, second: T2): void;
    function maybeBind<T, A extends any[], R>(obj: T, fn: ((this: T, ...args: A) => R) | undefined): ((...args: A) => R) | undefined;
    interface MultiMap<K, V> extends ESMap<K, V[]> {
        /**
         * Adds the value to an array of values associated with the key, and returns the array.
         * Creates the array if it does not already exist.
         */
        add(key: K, value: V): V[];
        /**
         * Removes a value from an array of values associated with the key.
         * Does not preserve the order of those values.
         * Does nothing if `key` is not in `map`, or `value` is not in `map[key]`.
         */
        remove(key: K, value: V): void;
    }
    function createMultiMap<K, V>(): MultiMap<K, V>;
    function createMultiMap<V>(): MultiMap<string, V>;
    interface UnderscoreEscapedMultiMap<T> extends UnderscoreEscapedMap<T[]> {
        /**
         * Adds the value to an array of values associated with the key, and returns the array.
         * Creates the array if it does not already exist.
         */
        add(key: __String, value: T): T[];
        /**
         * Removes a value from an array of values associated with the key.
         * Does not preserve the order of those values.
         * Does nothing if `key` is not in `map`, or `value` is not in `map[key]`.
         */
        remove(key: __String, value: T): void;
    }
    function createUnderscoreEscapedMultiMap<T>(): UnderscoreEscapedMultiMap<T>;
    /**
     * Tests whether a value is an array.
     */
    function isArray(value: any): value is readonly {}[];
    function toArray<T>(value: T | T[]): T[];
    function toArray<T>(value: T | readonly T[]): readonly T[];
    /**
     * Tests whether a value is string
     */
    function isString(text: unknown): text is string;
    function isNumber(x: unknown): x is number;
    function tryCast<TOut extends TIn, TIn = any>(value: TIn | undefined, test: (value: TIn) => value is TOut): TOut | undefined;
    function tryCast<T>(value: T, test: (value: T) => boolean): T | undefined;
    function cast<TOut extends TIn, TIn = any>(value: TIn | undefined, test: (value: TIn) => value is TOut): TOut;
    /** Does nothing. */
    function noop(_?: {} | null | undefined): void;
    /** Do nothing and return false */
    function returnFalse(): false;
    /** Do nothing and return true */
    function returnTrue(): true;
    /** Do nothing and return undefined */
    function returnUndefined(): undefined;
    /** Returns its argument. */
    function identity<T>(x: T): T;
    /** Returns lower case string */
    function toLowerCase(x: string): string;
    /**
     * Case insensitive file systems have descripencies in how they handle some characters (eg. turkish Upper case I with dot on top - \u0130)
     * This function is used in places where we want to make file name as a key on these systems
     * It is possible on mac to be able to refer to file name with I with dot on top as a fileName with its lower case form
     * But on windows we cannot. Windows can have fileName with I with dot on top next to its lower case and they can not each be referred with the lowercase forms
     * Technically we would want this function to be platform sepcific as well but
     * our api has till now only taken caseSensitive as the only input and just for some characters we dont want to update API and ensure all customers use those api
     * We could use upper case and we would still need to deal with the descripencies but
     * we want to continue using lower case since in most cases filenames are lowercasewe and wont need any case changes and avoid having to store another string for the key
     * So for this function purpose, we go ahead and assume character I with dot on top it as case sensitive since its very unlikely to use lower case form of that special character
     */
    function toFileNameLowerCase(x: string): string;
    /** Throws an error because a function is not implemented. */
    function notImplemented(): never;
    function memoize<T>(callback: () => T): () => T;
    /** A version of `memoize` that supports a single primitive argument */
    function memoizeOne<A extends string | number | boolean | undefined, T>(callback: (arg: A) => T): (arg: A) => T;
    /**
     * High-order function, composes functions. Note that functions are composed inside-out;
     * for example, `compose(a, b)` is the equivalent of `x => b(a(x))`.
     *
     * @param args The functions to compose.
     */
    function compose<T>(...args: ((t: T) => T)[]): (t: T) => T;
    const enum AssertionLevel {
        None = 0,
        Normal = 1,
        Aggressive = 2,
        VeryAggressive = 3
    }
    /**
     * Safer version of `Function` which should not be called.
     * Every function should be assignable to this, but this should not be assignable to every function.
     */
    type AnyFunction = (...args: never[]) => void;
    type AnyConstructor = new (...args: unknown[]) => unknown;
    function equateValues<T>(a: T, b: T): boolean;
    /**
     * Compare the equality of two strings using a case-sensitive ordinal comparison.
     *
     * Case-sensitive comparisons compare both strings one code-point at a time using the integer
     * value of each code-point after applying `toUpperCase` to each string. We always map both
     * strings to their upper-case form as some unicode characters do not properly round-trip to
     * lowercase (such as `ẞ` (German sharp capital s)).
     */
    function equateStringsCaseInsensitive(a: string, b: string): boolean;
    /**
     * Compare the equality of two strings using a case-sensitive ordinal comparison.
     *
     * Case-sensitive comparisons compare both strings one code-point at a time using the
     * integer value of each code-point.
     */
    function equateStringsCaseSensitive(a: string, b: string): boolean;
    /**
     * Compare two numeric values for their order relative to each other.
     * To compare strings, use any of the `compareStrings` functions.
     */
    function compareValues(a: number | undefined, b: number | undefined): Comparison;
    /**
     * Compare two TextSpans, first by `start`, then by `length`.
     */
    function compareTextSpans(a: Partial<TextSpan> | undefined, b: Partial<TextSpan> | undefined): Comparison;
    function min<T>(a: T, b: T, compare: Comparer<T>): T;
    /**
     * Compare two strings using a case-insensitive ordinal comparison.
     *
     * Ordinal comparisons are based on the difference between the unicode code points of both
     * strings. Characters with multiple unicode representations are considered unequal. Ordinal
     * comparisons provide predictable ordering, but place "a" after "B".
     *
     * Case-insensitive comparisons compare both strings one code-point at a time using the integer
     * value of each code-point after applying `toUpperCase` to each string. We always map both
     * strings to their upper-case form as some unicode characters do not properly round-trip to
     * lowercase (such as `ẞ` (German sharp capital s)).
     */
    function compareStringsCaseInsensitive(a: string, b: string): Comparison;
    /**
     * Compare two strings using a case-sensitive ordinal comparison.
     *
     * Ordinal comparisons are based on the difference between the unicode code points of both
     * strings. Characters with multiple unicode representations are considered unequal. Ordinal
     * comparisons provide predictable ordering, but place "a" after "B".
     *
     * Case-sensitive comparisons compare both strings one code-point at a time using the integer
     * value of each code-point.
     */
    function compareStringsCaseSensitive(a: string | undefined, b: string | undefined): Comparison;
    function getStringComparer(ignoreCase?: boolean): typeof compareStringsCaseSensitive;
    function getUILocale(): string | undefined;
    function setUILocale(value: string | undefined): void;
    /**
     * Compare two strings in a using the case-sensitive sort behavior of the UI locale.
     *
     * Ordering is not predictable between different host locales, but is best for displaying
     * ordered data for UI presentation. Characters with multiple unicode representations may
     * be considered equal.
     *
     * Case-sensitive comparisons compare strings that differ in base characters, or
     * accents/diacritic marks, or case as unequal.
     */
    function compareStringsCaseSensitiveUI(a: string, b: string): Comparison;
    function compareProperties<T, K extends keyof T>(a: T | undefined, b: T | undefined, key: K, comparer: Comparer<T[K]>): Comparison;
    /** True is greater than false. */
    function compareBooleans(a: boolean, b: boolean): Comparison;
    /**
     * Given a name and a list of names that are *not* equal to the name, return a spelling suggestion if there is one that is close enough.
     * Names less than length 3 only check for case-insensitive equality.
     *
     * find the candidate with the smallest Levenshtein distance,
     *    except for candidates:
     *      * With no name
     *      * Whose length differs from the target name by more than 0.34 of the length of the name.
     *      * Whose levenshtein distance is more than 0.4 of the length of the name
     *        (0.4 allows 1 substitution/transposition for every 5 characters,
     *         and 1 insertion/deletion at 3 characters)
     */
    function getSpellingSuggestion<T>(name: string, candidates: T[], getName: (candidate: T) => string | undefined): T | undefined;
    function endsWith(str: string, suffix: string): boolean;
    function removeSuffix(str: string, suffix: string): string;
    function tryRemoveSuffix(str: string, suffix: string): string | undefined;
    function stringContains(str: string, substring: string): boolean;
    /**
     * Takes a string like "jquery-min.4.2.3" and returns "jquery"
     */
    function removeMinAndVersionNumbers(fileName: string): string;
    /** Remove an item from an array, moving everything to its right one space left. */
    function orderedRemoveItem<T>(array: T[], item: T): boolean;
    /** Remove an item by index from an array, moving everything to its right one space left. */
    function orderedRemoveItemAt<T>(array: T[], index: number): void;
    function unorderedRemoveItemAt<T>(array: T[], index: number): void;
    /** Remove the *first* occurrence of `item` from the array. */
    function unorderedRemoveItem<T>(array: T[], item: T): boolean;
    type GetCanonicalFileName = (fileName: string) => string;
    function createGetCanonicalFileName(useCaseSensitiveFileNames: boolean): GetCanonicalFileName;
    /** Represents a "prefix*suffix" pattern. */
    interface Pattern {
        prefix: string;
        suffix: string;
    }
    function patternText({ prefix, suffix }: Pattern): string;
    /**
     * Given that candidate matches pattern, returns the text matching the '*'.
     * E.g.: matchedText(tryParsePattern("foo*baz"), "foobarbaz") === "bar"
     */
    function matchedText(pattern: Pattern, candidate: string): string;
    /** Return the object corresponding to the best pattern to match `candidate`. */
    function findBestPatternMatch<T>(values: readonly T[], getPattern: (value: T) => Pattern, candidate: string): T | undefined;
    function startsWith(str: string, prefix: string): boolean;
    function removePrefix(str: string, prefix: string): string;
    function tryRemovePrefix(str: string, prefix: string, getCanonicalFileName?: GetCanonicalFileName): string | undefined;
    function and<T>(f: (arg: T) => boolean, g: (arg: T) => boolean): (arg: T) => boolean;
    function or<T extends unknown[]>(...fs: ((...args: T) => boolean)[]): (...args: T) => boolean;
    function not<T extends unknown[]>(fn: (...args: T) => boolean): (...args: T) => boolean;
    function assertType<T>(_: T): void;
    function singleElementArray<T>(t: T | undefined): T[] | undefined;
    function enumerateInsertsAndDeletes<T, U>(newItems: readonly T[], oldItems: readonly U[], comparer: (a: T, b: U) => Comparison, inserted: (newItem: T) => void, deleted: (oldItem: U) => void, unchanged?: (oldItem: U, newItem: T) => void): boolean;
    function fill<T>(length: number, cb: (index: number) => T): T[];
    function cartesianProduct<T>(arrays: readonly T[][]): T[][];
    /**
     * Returns string left-padded with spaces or zeros until it reaches the given length.
     *
     * @param s String to pad.
     * @param length Final padded length. If less than or equal to 's.length', returns 's' unchanged.
     * @param padString Character to use as padding (default " ").
     */
    function padLeft(s: string, length: number, padString?: " " | "0"): string;
    /**
     * Returns string right-padded with spaces until it reaches the given length.
     *
     * @param s String to pad.
     * @param length Final padded length. If less than or equal to 's.length', returns 's' unchanged.
     * @param padString Character to use as padding (default " ").
     */
    function padRight(s: string, length: number, padString?: " "): string;
    function takeWhile<T, U extends T>(array: readonly T[], predicate: (element: T) => element is U): U[];
}
declare namespace ts {
    enum LogLevel {
        Off = 0,
        Error = 1,
        Warning = 2,
        Info = 3,
        Verbose = 4
    }
    interface LoggingHost {
        log(level: LogLevel, s: string): void;
    }
    interface DeprecationOptions {
        message?: string;
        error?: boolean;
        since?: Version | string;
        warnAfter?: Version | string;
        errorAfter?: Version | string;
        typeScriptVersion?: Version | string;
    }
    namespace Debug {
        let currentLogLevel: LogLevel;
        let isDebugging: boolean;
        let loggingHost: LoggingHost | undefined;
        function getTypeScriptVersion(): Version;
        function shouldLog(level: LogLevel): boolean;
        function log(s: string): void;
        namespace log {
            function error(s: string): void;
            function warn(s: string): void;
            function log(s: string): void;
            function trace(s: string): void;
        }
        function getAssertionLevel(): AssertionLevel;
        function setAssertionLevel(level: AssertionLevel): void;
        function shouldAssert(level: AssertionLevel): boolean;
        function fail(message?: string, stackCrawlMark?: AnyFunction): never;
        function failBadSyntaxKind(node: Node, message?: string, stackCrawlMark?: AnyFunction): never;
        function assert(expression: unknown, message?: string, verboseDebugInfo?: string | (() => string), stackCrawlMark?: AnyFunction): asserts expression;
        function assertEqual<T>(a: T, b: T, msg?: string, msg2?: string, stackCrawlMark?: AnyFunction): void;
        function assertLessThan(a: number, b: number, msg?: string, stackCrawlMark?: AnyFunction): void;
        function assertLessThanOrEqual(a: number, b: number, stackCrawlMark?: AnyFunction): void;
        function assertGreaterThanOrEqual(a: number, b: number, stackCrawlMark?: AnyFunction): void;
        function assertIsDefined<T>(value: T, message?: string, stackCrawlMark?: AnyFunction): asserts value is NonNullable<T>;
        function checkDefined<T>(value: T | null | undefined, message?: string, stackCrawlMark?: AnyFunction): T;
        /**
         * @deprecated Use `checkDefined` to check whether a value is defined inline. Use `assertIsDefined` to check whether
         * a value is defined at the statement level.
         */
        const assertDefined: typeof checkDefined;
        function assertEachIsDefined<T extends Node>(value: NodeArray<T>, message?: string, stackCrawlMark?: AnyFunction): asserts value is NodeArray<T>;
        function assertEachIsDefined<T>(value: readonly T[], message?: string, stackCrawlMark?: AnyFunction): asserts value is readonly NonNullable<T>[];
        function checkEachDefined<T, A extends readonly T[]>(value: A, message?: string, stackCrawlMark?: AnyFunction): A;
        /**
         * @deprecated Use `checkEachDefined` to check whether the elements of an array are defined inline. Use `assertEachIsDefined` to check whether
         * the elements of an array are defined at the statement level.
         */
        const assertEachDefined: typeof checkEachDefined;
        function assertNever(member: never, message?: string, stackCrawlMark?: AnyFunction): never;
        function assertEachNode<T extends Node, U extends T>(nodes: NodeArray<T>, test: (node: T) => node is U, message?: string, stackCrawlMark?: AnyFunction): asserts nodes is NodeArray<U>;
        function assertEachNode<T extends Node, U extends T>(nodes: readonly T[], test: (node: T) => node is U, message?: string, stackCrawlMark?: AnyFunction): asserts nodes is readonly U[];
        function assertEachNode(nodes: readonly Node[], test: (node: Node) => boolean, message?: string, stackCrawlMark?: AnyFunction): void;
        function assertNode<T extends Node, U extends T>(node: T | undefined, test: (node: T) => node is U, message?: string, stackCrawlMark?: AnyFunction): asserts node is U;
        function assertNode(node: Node | undefined, test: ((node: Node) => boolean) | undefined, message?: string, stackCrawlMark?: AnyFunction): void;
        function assertNotNode<T extends Node, U extends T>(node: T | undefined, test: (node: Node) => node is U, message?: string, stackCrawlMark?: AnyFunction): asserts node is Exclude<T, U>;
        function assertNotNode(node: Node | undefined, test: ((node: Node) => boolean) | undefined, message?: string, stackCrawlMark?: AnyFunction): void;
        function assertOptionalNode<T extends Node, U extends T>(node: T, test: (node: T) => node is U, message?: string, stackCrawlMark?: AnyFunction): asserts node is U;
        function assertOptionalNode<T extends Node, U extends T>(node: T | undefined, test: (node: T) => node is U, message?: string, stackCrawlMark?: AnyFunction): asserts node is U | undefined;
        function assertOptionalNode(node: Node | undefined, test: ((node: Node) => boolean) | undefined, message?: string, stackCrawlMark?: AnyFunction): void;
        function assertOptionalToken<T extends Node, K extends SyntaxKind>(node: T, kind: K, message?: string, stackCrawlMark?: AnyFunction): asserts node is Extract<T, {
            readonly kind: K;
        }>;
        function assertOptionalToken<T extends Node, K extends SyntaxKind>(node: T | undefined, kind: K, message?: string, stackCrawlMark?: AnyFunction): asserts node is Extract<T, {
            readonly kind: K;
        }> | undefined;
        function assertOptionalToken(node: Node | undefined, kind: SyntaxKind | undefined, message?: string, stackCrawlMark?: AnyFunction): void;
        function assertMissingNode(node: Node | undefined, message?: string, stackCrawlMark?: AnyFunction): asserts node is undefined;
        function getFunctionName(func: AnyFunction): any;
        function formatSymbol(symbol: Symbol): string;
        /**
         * Formats an enum value as a string for debugging and debug assertions.
         */
        function formatEnum(value: number | undefined, enumObject: any, isFlags?: boolean): string;
        function formatSyntaxKind(kind: SyntaxKind | undefined): string;
        function formatNodeFlags(flags: NodeFlags | undefined): string;
        function formatModifierFlags(flags: ModifierFlags | undefined): string;
        function formatTransformFlags(flags: TransformFlags | undefined): string;
        function formatEmitFlags(flags: EmitFlags | undefined): string;
        function formatSymbolFlags(flags: SymbolFlags | undefined): string;
        function formatTypeFlags(flags: TypeFlags | undefined): string;
        function formatSignatureFlags(flags: SignatureFlags | undefined): string;
        function formatObjectFlags(flags: ObjectFlags | undefined): string;
        function formatFlowFlags(flags: FlowFlags | undefined): string;
        function printControlFlowGraph(flowNode: FlowNode): void;
        function formatControlFlowGraph(flowNode: FlowNode): string;
        function attachFlowNodeDebugInfo(flowNode: FlowNodeBase): void;
        function attachNodeArrayDebugInfo(array: NodeArray<Node>): void;
        /**
         * Injects debug information into frequently used types.
         */
        function enableDebugInfo(): void;
        function deprecate<F extends (...args: any[]) => any>(func: F, options?: DeprecationOptions): F;
    }
}
declare namespace ts {
    /**
     * Describes a precise semantic version number, https://semver.org
     */
    class Version {
        static readonly zero: Version;
        readonly major: number;
        readonly minor: number;
        readonly patch: number;
        readonly prerelease: readonly string[];
        readonly build: readonly string[];
        constructor(text: string);
        constructor(major: number, minor?: number, patch?: number, prerelease?: string, build?: string);
        static tryParse(text: string): Version | undefined;
        compareTo(other: Version | undefined): Comparison;
        increment(field: "major" | "minor" | "patch"): Version;
        toString(): string;
    }
    /**
     * Describes a semantic version range, per https://github.com/npm/node-semver#ranges
     */
    class VersionRange {
        private _alternatives;
        constructor(spec: string);
        static tryParse(text: string): VersionRange | undefined;
        test(version: Version | string): boolean;
        toString(): string;
    }
}
declare namespace ts {
    interface PerformanceHooks {
        /** Indicates whether we should write native performance events */
        shouldWriteNativeEvents: boolean;
        performance: Performance;
        PerformanceObserver: PerformanceObserverConstructor;
    }
    interface Performance {
        mark(name: string): void;
        measure(name: string, startMark?: string, endMark?: string): void;
        now(): number;
        timeOrigin: number;
    }
    interface PerformanceEntry {
        name: string;
        entryType: string;
        startTime: number;
        duration: number;
    }
    interface PerformanceObserverEntryList {
        getEntries(): PerformanceEntryList;
        getEntriesByName(name: string, type?: string): PerformanceEntryList;
        getEntriesByType(type: string): PerformanceEntryList;
    }
    interface PerformanceObserver {
        disconnect(): void;
        observe(options: {
            entryTypes: readonly string[];
        }): void;
    }
    type PerformanceObserverConstructor = new (callback: (list: PerformanceObserverEntryList, observer: PerformanceObserver) => void) => PerformanceObserver;
    type PerformanceEntryList = PerformanceEntry[];
    function tryGetNativePerformanceHooks(): PerformanceHooks | undefined;
    /** Gets a timestamp with (at least) ms resolution */
    const timestamp: () => number;
}
/** Performance measurements for the compiler. */
declare namespace ts.performance {
    interface Timer {
        enter(): void;
        exit(): void;
    }
    function createTimerIf(condition: boolean, measureName: string, startMarkName: string, endMarkName: string): Timer;
    function createTimer(measureName: string, startMarkName: string, endMarkName: string): Timer;
    const nullTimer: Timer;
    /**
     * Marks a performance event.
     *
     * @param markName The name of the mark.
     */
    function mark(markName: string): void;
    /**
     * Adds a performance measurement with the specified name.
     *
     * @param measureName The name of the performance measurement.
     * @param startMarkName The name of the starting mark. If not supplied, the point at which the
     *      profiler was enabled is used.
     * @param endMarkName The name of the ending mark. If not supplied, the current timestamp is
     *      used.
     */
    function measure(measureName: string, startMarkName?: string, endMarkName?: string): void;
    /**
     * Gets the number of times a marker was encountered.
     *
     * @param markName The name of the mark.
     */
    function getCount(markName: string): number;
    /**
     * Gets the total duration of all measurements with the supplied name.
     *
     * @param measureName The name of the measure whose durations should be accumulated.
     */
    function getDuration(measureName: string): number;
    /**
     * Iterate over each measure, performing some action
     *
     * @param cb The action to perform for each measure
     */
    function forEachMeasure(cb: (measureName: string, duration: number) => void): void;
    /**
     * Indicates whether the performance API is enabled.
     */
    function isEnabled(): boolean;
    /** Enables (and resets) performance measurements for the compiler. */
    function enable(system?: System): boolean;
    /** Disables performance measurements for the compiler. */
    function disable(): void;
}
declare namespace ts {
    type PerfLogger = typeof import("@microsoft/typescript-etw");
    /** Performance logger that will generate ETW events if possible - check for `logEvent` member, as `etwModule` will be `{}` when browserified */
    export const perfLogger: PerfLogger;
    export {};
}
declare namespace ts {
    let tracing: typeof tracingEnabled | undefined;
}
declare namespace ts.tracingEnabled {
    export const enum Mode {
        Project = 0,
        Build = 1,
        Server = 2
    }
    interface Args {
        [key: string]: string | number | boolean | null | undefined | Args | readonly (string | number | boolean | null | undefined | Args)[];
    }
    /** Starts tracing for the given project. */
    export function startTracing(tracingMode: Mode, traceDir: string, configFilePath?: string): void;
    /** Stops tracing for the in-progress project and dumps the type catalog. */
    export function stopTracing(typeCatalog?: readonly Type[]): void;
    export const enum Phase {
        Parse = "parse",
        Program = "program",
        Bind = "bind",
        Check = "check",
        CheckTypes = "checkTypes",
        Emit = "emit",
        Session = "session"
    }
    export function instant(phase: Phase, name: string, args?: Args): void;
    /**
     * @param separateBeginAndEnd - used for special cases where we need the trace point even if the event
     * never terminates (typically for reducing a scenario too big to trace to one that can be completed).
     * In the future we might implement an exit handler to dump unfinished events which would deprecate
     * these operations.
     */
    export function push(phase: Phase, name: string, args?: Args, separateBeginAndEnd?: boolean): void;
    export function pop(): void;
    export function popAll(): void;
    export function dumpLegend(): void;
    export {};
}
declare namespace ts {
    const startTracing: typeof tracingEnabled.startTracing;
}
declare namespace ts {
    export type Path = string & {
        __pathBrand: any;
    };
    export type MatchingKeys<TRecord, TMatch, K extends keyof TRecord = keyof TRecord> = K extends (TRecord[K] extends TMatch ? K : never) ? K : never;
    export interface TextRange {
        pos: number;
        end: number;
    }
    export interface ReadonlyTextRange {
        readonly pos: number;
        readonly end: number;
    }
    export const enum SyntaxKind {
        Unknown = 0,
        EndOfFileToken = 1,
        SingleLineCommentTrivia = 2,
        MultiLineCommentTrivia = 3,
        NewLineTrivia = 4,
        WhitespaceTrivia = 5,
        ShebangTrivia = 6,
        ConflictMarkerTrivia = 7,
        NumericLiteral = 8,
        BigIntLiteral = 9,
        StringLiteral = 10,
        JsxText = 11,
        JsxTextAllWhiteSpaces = 12,
        RegularExpressionLiteral = 13,
        NoSubstitutionTemplateLiteral = 14,
        TemplateHead = 15,
        TemplateMiddle = 16,
        TemplateTail = 17,
        OpenBraceToken = 18,
        CloseBraceToken = 19,
        OpenParenToken = 20,
        CloseParenToken = 21,
        OpenBracketToken = 22,
        CloseBracketToken = 23,
        DotToken = 24,
        DotDotDotToken = 25,
        SemicolonToken = 26,
        CommaToken = 27,
        QuestionDotToken = 28,
        LessThanToken = 29,
        LessThanSlashToken = 30,
        GreaterThanToken = 31,
        LessThanEqualsToken = 32,
        GreaterThanEqualsToken = 33,
        EqualsEqualsToken = 34,
        ExclamationEqualsToken = 35,
        EqualsEqualsEqualsToken = 36,
        ExclamationEqualsEqualsToken = 37,
        EqualsGreaterThanToken = 38,
        PlusToken = 39,
        MinusToken = 40,
        AsteriskToken = 41,
        AsteriskAsteriskToken = 42,
        SlashToken = 43,
        PercentToken = 44,
        PlusPlusToken = 45,
        MinusMinusToken = 46,
        LessThanLessThanToken = 47,
        GreaterThanGreaterThanToken = 48,
        GreaterThanGreaterThanGreaterThanToken = 49,
        AmpersandToken = 50,
        BarToken = 51,
        CaretToken = 52,
        ExclamationToken = 53,
        TildeToken = 54,
        AmpersandAmpersandToken = 55,
        BarBarToken = 56,
        QuestionToken = 57,
        ColonToken = 58,
        AtToken = 59,
        QuestionQuestionToken = 60,
        /** Only the JSDoc scanner produces BacktickToken. The normal scanner produces NoSubstitutionTemplateLiteral and related kinds. */
        BacktickToken = 61,
        EqualsToken = 62,
        PlusEqualsToken = 63,
        MinusEqualsToken = 64,
        AsteriskEqualsToken = 65,
        AsteriskAsteriskEqualsToken = 66,
        SlashEqualsToken = 67,
        PercentEqualsToken = 68,
        LessThanLessThanEqualsToken = 69,
        GreaterThanGreaterThanEqualsToken = 70,
        GreaterThanGreaterThanGreaterThanEqualsToken = 71,
        AmpersandEqualsToken = 72,
        BarEqualsToken = 73,
        BarBarEqualsToken = 74,
        AmpersandAmpersandEqualsToken = 75,
        QuestionQuestionEqualsToken = 76,
        CaretEqualsToken = 77,
        Identifier = 78,
        PrivateIdentifier = 79,
        BreakKeyword = 80,
        CaseKeyword = 81,
        CatchKeyword = 82,
        ClassKeyword = 83,
        ConstKeyword = 84,
        ContinueKeyword = 85,
        DebuggerKeyword = 86,
        DefaultKeyword = 87,
        DeleteKeyword = 88,
        DoKeyword = 89,
        ElseKeyword = 90,
        EnumKeyword = 91,
        ExportKeyword = 92,
        ExtendsKeyword = 93,
        FalseKeyword = 94,
        FinallyKeyword = 95,
        ForKeyword = 96,
        FunctionKeyword = 97,
        IfKeyword = 98,
        ImportKeyword = 99,
        InKeyword = 100,
        InstanceOfKeyword = 101,
        NewKeyword = 102,
        NullKeyword = 103,
        ReturnKeyword = 104,
        SuperKeyword = 105,
        SwitchKeyword = 106,
        ThisKeyword = 107,
        ThrowKeyword = 108,
        TrueKeyword = 109,
        TryKeyword = 110,
        TypeOfKeyword = 111,
        VarKeyword = 112,
        VoidKeyword = 113,
        WhileKeyword = 114,
        WithKeyword = 115,
        ImplementsKeyword = 116,
        InterfaceKeyword = 117,
        LetKeyword = 118,
        PackageKeyword = 119,
        PrivateKeyword = 120,
        ProtectedKeyword = 121,
        PublicKeyword = 122,
        StaticKeyword = 123,
        YieldKeyword = 124,
        AbstractKeyword = 125,
        AsKeyword = 126,
        AssertsKeyword = 127,
        AnyKeyword = 128,
        AsyncKeyword = 129,
        AwaitKeyword = 130,
        BooleanKeyword = 131,
        ConstructorKeyword = 132,
        DeclareKeyword = 133,
        GetKeyword = 134,
        InferKeyword = 135,
        IntrinsicKeyword = 136,
        IsKeyword = 137,
        KeyOfKeyword = 138,
        ModuleKeyword = 139,
        NamespaceKeyword = 140,
        NeverKeyword = 141,
        ReadonlyKeyword = 142,
        RequireKeyword = 143,
        NumberKeyword = 144,
        ObjectKeyword = 145,
        SetKeyword = 146,
        StringKeyword = 147,
        SymbolKeyword = 148,
        TypeKeyword = 149,
        UndefinedKeyword = 150,
        UniqueKeyword = 151,
        UnknownKeyword = 152,
        FromKeyword = 153,
        GlobalKeyword = 154,
        BigIntKeyword = 155,
        OfKeyword = 156,
        QualifiedName = 157,
        ComputedPropertyName = 158,
        TypeParameter = 159,
        Parameter = 160,
        Decorator = 161,
        PropertySignature = 162,
        PropertyDeclaration = 163,
        MethodSignature = 164,
        MethodDeclaration = 165,
        Constructor = 166,
        GetAccessor = 167,
        SetAccessor = 168,
        CallSignature = 169,
        ConstructSignature = 170,
        IndexSignature = 171,
        TypePredicate = 172,
        TypeReference = 173,
        FunctionType = 174,
        ConstructorType = 175,
        TypeQuery = 176,
        TypeLiteral = 177,
        ArrayType = 178,
        TupleType = 179,
        OptionalType = 180,
        RestType = 181,
        UnionType = 182,
        IntersectionType = 183,
        ConditionalType = 184,
        InferType = 185,
        ParenthesizedType = 186,
        ThisType = 187,
        TypeOperator = 188,
        IndexedAccessType = 189,
        MappedType = 190,
        LiteralType = 191,
        NamedTupleMember = 192,
        TemplateLiteralType = 193,
        TemplateLiteralTypeSpan = 194,
        ImportType = 195,
        ObjectBindingPattern = 196,
        ArrayBindingPattern = 197,
        BindingElement = 198,
        ArrayLiteralExpression = 199,
        ObjectLiteralExpression = 200,
        PropertyAccessExpression = 201,
        ElementAccessExpression = 202,
        CallExpression = 203,
        NewExpression = 204,
        TaggedTemplateExpression = 205,
        TypeAssertionExpression = 206,
        ParenthesizedExpression = 207,
        FunctionExpression = 208,
        ArrowFunction = 209,
        DeleteExpression = 210,
        TypeOfExpression = 211,
        VoidExpression = 212,
        AwaitExpression = 213,
        PrefixUnaryExpression = 214,
        PostfixUnaryExpression = 215,
        BinaryExpression = 216,
        ConditionalExpression = 217,
        TemplateExpression = 218,
        YieldExpression = 219,
        SpreadElement = 220,
        ClassExpression = 221,
        OmittedExpression = 222,
        ExpressionWithTypeArguments = 223,
        AsExpression = 224,
        NonNullExpression = 225,
        MetaProperty = 226,
        SyntheticExpression = 227,
        TemplateSpan = 228,
        SemicolonClassElement = 229,
        Block = 230,
        EmptyStatement = 231,
        VariableStatement = 232,
        ExpressionStatement = 233,
        IfStatement = 234,
        DoStatement = 235,
        WhileStatement = 236,
        ForStatement = 237,
        ForInStatement = 238,
        ForOfStatement = 239,
        ContinueStatement = 240,
        BreakStatement = 241,
        ReturnStatement = 242,
        WithStatement = 243,
        SwitchStatement = 244,
        LabeledStatement = 245,
        ThrowStatement = 246,
        TryStatement = 247,
        DebuggerStatement = 248,
        VariableDeclaration = 249,
        VariableDeclarationList = 250,
        FunctionDeclaration = 251,
        ClassDeclaration = 252,
        InterfaceDeclaration = 253,
        TypeAliasDeclaration = 254,
        EnumDeclaration = 255,
        ModuleDeclaration = 256,
        ModuleBlock = 257,
        CaseBlock = 258,
        NamespaceExportDeclaration = 259,
        ImportEqualsDeclaration = 260,
        ImportDeclaration = 261,
        ImportClause = 262,
        NamespaceImport = 263,
        NamedImports = 264,
        ImportSpecifier = 265,
        ExportAssignment = 266,
        ExportDeclaration = 267,
        NamedExports = 268,
        NamespaceExport = 269,
        ExportSpecifier = 270,
        MissingDeclaration = 271,
        ExternalModuleReference = 272,
        JsxElement = 273,
        JsxSelfClosingElement = 274,
        JsxOpeningElement = 275,
        JsxClosingElement = 276,
        JsxFragment = 277,
        JsxOpeningFragment = 278,
        JsxClosingFragment = 279,
        JsxAttribute = 280,
        JsxAttributes = 281,
        JsxSpreadAttribute = 282,
        JsxExpression = 283,
        CaseClause = 284,
        DefaultClause = 285,
        HeritageClause = 286,
        CatchClause = 287,
        PropertyAssignment = 288,
        ShorthandPropertyAssignment = 289,
        SpreadAssignment = 290,
        EnumMember = 291,
        UnparsedPrologue = 292,
        UnparsedPrepend = 293,
        UnparsedText = 294,
        UnparsedInternalText = 295,
        UnparsedSyntheticReference = 296,
        SourceFile = 297,
        Bundle = 298,
        UnparsedSource = 299,
        InputFiles = 300,
        JSDocTypeExpression = 301,
        JSDocNameReference = 302,
        JSDocAllType = 303,
        JSDocUnknownType = 304,
        JSDocNullableType = 305,
        JSDocNonNullableType = 306,
        JSDocOptionalType = 307,
        JSDocFunctionType = 308,
        JSDocVariadicType = 309,
        JSDocNamepathType = 310,
        JSDocComment = 311,
        JSDocTypeLiteral = 312,
        JSDocSignature = 313,
        JSDocTag = 314,
        JSDocAugmentsTag = 315,
        JSDocImplementsTag = 316,
        JSDocAuthorTag = 317,
        JSDocDeprecatedTag = 318,
        JSDocClassTag = 319,
        JSDocPublicTag = 320,
        JSDocPrivateTag = 321,
        JSDocProtectedTag = 322,
        JSDocReadonlyTag = 323,
        JSDocCallbackTag = 324,
        JSDocEnumTag = 325,
        JSDocParameterTag = 326,
        JSDocReturnTag = 327,
        JSDocThisTag = 328,
        JSDocTypeTag = 329,
        JSDocTemplateTag = 330,
        JSDocTypedefTag = 331,
        JSDocSeeTag = 332,
        JSDocPropertyTag = 333,
        SyntaxList = 334,
        NotEmittedStatement = 335,
        PartiallyEmittedExpression = 336,
        CommaListExpression = 337,
        MergeDeclarationMarker = 338,
        EndOfDeclarationMarker = 339,
        SyntheticReferenceExpression = 340,
        Count = 341,
        FirstAssignment = 62,
        LastAssignment = 77,
        FirstCompoundAssignment = 63,
        LastCompoundAssignment = 77,
        FirstReservedWord = 80,
        LastReservedWord = 115,
        FirstKeyword = 80,
        LastKeyword = 156,
        FirstFutureReservedWord = 116,
        LastFutureReservedWord = 124,
        FirstTypeNode = 172,
        LastTypeNode = 195,
        FirstPunctuation = 18,
        LastPunctuation = 77,
        FirstToken = 0,
        LastToken = 156,
        FirstTriviaToken = 2,
        LastTriviaToken = 7,
        FirstLiteralToken = 8,
        LastLiteralToken = 14,
        FirstTemplateToken = 14,
        LastTemplateToken = 17,
        FirstBinaryOperator = 29,
        LastBinaryOperator = 77,
        FirstStatement = 232,
        LastStatement = 248,
        FirstNode = 157,
        FirstJSDocNode = 301,
        LastJSDocNode = 333,
        FirstJSDocTagNode = 314,
        LastJSDocTagNode = 333,
        FirstContextualKeyword = 125,
        LastContextualKeyword = 156
    }
    export type TriviaSyntaxKind = SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia | SyntaxKind.NewLineTrivia | SyntaxKind.WhitespaceTrivia | SyntaxKind.ShebangTrivia | SyntaxKind.ConflictMarkerTrivia;
    export type LiteralSyntaxKind = SyntaxKind.NumericLiteral | SyntaxKind.BigIntLiteral | SyntaxKind.StringLiteral | SyntaxKind.JsxText | SyntaxKind.JsxTextAllWhiteSpaces | SyntaxKind.RegularExpressionLiteral | SyntaxKind.NoSubstitutionTemplateLiteral;
    export type PseudoLiteralSyntaxKind = SyntaxKind.TemplateHead | SyntaxKind.TemplateMiddle | SyntaxKind.TemplateTail;
    export type PunctuationSyntaxKind = SyntaxKind.OpenBraceToken | SyntaxKind.CloseBraceToken | SyntaxKind.OpenParenToken | SyntaxKind.CloseParenToken | SyntaxKind.OpenBracketToken | SyntaxKind.CloseBracketToken | SyntaxKind.DotToken | SyntaxKind.DotDotDotToken | SyntaxKind.SemicolonToken | SyntaxKind.CommaToken | SyntaxKind.QuestionDotToken | SyntaxKind.LessThanToken | SyntaxKind.LessThanSlashToken | SyntaxKind.GreaterThanToken | SyntaxKind.LessThanEqualsToken | SyntaxKind.GreaterThanEqualsToken | SyntaxKind.EqualsEqualsToken | SyntaxKind.ExclamationEqualsToken | SyntaxKind.EqualsEqualsEqualsToken | SyntaxKind.ExclamationEqualsEqualsToken | SyntaxKind.EqualsGreaterThanToken | SyntaxKind.PlusToken | SyntaxKind.MinusToken | SyntaxKind.AsteriskToken | SyntaxKind.AsteriskAsteriskToken | SyntaxKind.SlashToken | SyntaxKind.PercentToken | SyntaxKind.PlusPlusToken | SyntaxKind.MinusMinusToken | SyntaxKind.LessThanLessThanToken | SyntaxKind.GreaterThanGreaterThanToken | SyntaxKind.GreaterThanGreaterThanGreaterThanToken | SyntaxKind.AmpersandToken | SyntaxKind.BarToken | SyntaxKind.CaretToken | SyntaxKind.ExclamationToken | SyntaxKind.TildeToken | SyntaxKind.AmpersandAmpersandToken | SyntaxKind.BarBarToken | SyntaxKind.QuestionQuestionToken | SyntaxKind.QuestionToken | SyntaxKind.ColonToken | SyntaxKind.AtToken | SyntaxKind.BacktickToken | SyntaxKind.EqualsToken | SyntaxKind.PlusEqualsToken | SyntaxKind.MinusEqualsToken | SyntaxKind.AsteriskEqualsToken | SyntaxKind.AsteriskAsteriskEqualsToken | SyntaxKind.SlashEqualsToken | SyntaxKind.PercentEqualsToken | SyntaxKind.LessThanLessThanEqualsToken | SyntaxKind.GreaterThanGreaterThanEqualsToken | SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken | SyntaxKind.AmpersandEqualsToken | SyntaxKind.BarEqualsToken | SyntaxKind.CaretEqualsToken;
    export type KeywordSyntaxKind = SyntaxKind.AbstractKeyword | SyntaxKind.AnyKeyword | SyntaxKind.AsKeyword | SyntaxKind.AssertsKeyword | SyntaxKind.AsyncKeyword | SyntaxKind.AwaitKeyword | SyntaxKind.BigIntKeyword | SyntaxKind.BooleanKeyword | SyntaxKind.BreakKeyword | SyntaxKind.CaseKeyword | SyntaxKind.CatchKeyword | SyntaxKind.ClassKeyword | SyntaxKind.ConstKeyword | SyntaxKind.ConstructorKeyword | SyntaxKind.ContinueKeyword | SyntaxKind.DebuggerKeyword | SyntaxKind.DeclareKeyword | SyntaxKind.DefaultKeyword | SyntaxKind.DeleteKeyword | SyntaxKind.DoKeyword | SyntaxKind.ElseKeyword | SyntaxKind.EnumKeyword | SyntaxKind.ExportKeyword | SyntaxKind.ExtendsKeyword | SyntaxKind.FalseKeyword | SyntaxKind.FinallyKeyword | SyntaxKind.ForKeyword | SyntaxKind.FromKeyword | SyntaxKind.FunctionKeyword | SyntaxKind.GetKeyword | SyntaxKind.GlobalKeyword | SyntaxKind.IfKeyword | SyntaxKind.ImplementsKeyword | SyntaxKind.ImportKeyword | SyntaxKind.InferKeyword | SyntaxKind.InKeyword | SyntaxKind.InstanceOfKeyword | SyntaxKind.InterfaceKeyword | SyntaxKind.IntrinsicKeyword | SyntaxKind.IsKeyword | SyntaxKind.KeyOfKeyword | SyntaxKind.LetKeyword | SyntaxKind.ModuleKeyword | SyntaxKind.NamespaceKeyword | SyntaxKind.NeverKeyword | SyntaxKind.NewKeyword | SyntaxKind.NullKeyword | SyntaxKind.NumberKeyword | SyntaxKind.ObjectKeyword | SyntaxKind.OfKeyword | SyntaxKind.PackageKeyword | SyntaxKind.PrivateKeyword | SyntaxKind.ProtectedKeyword | SyntaxKind.PublicKeyword | SyntaxKind.ReadonlyKeyword | SyntaxKind.RequireKeyword | SyntaxKind.ReturnKeyword | SyntaxKind.SetKeyword | SyntaxKind.StaticKeyword | SyntaxKind.StringKeyword | SyntaxKind.SuperKeyword | SyntaxKind.SwitchKeyword | SyntaxKind.SymbolKeyword | SyntaxKind.ThisKeyword | SyntaxKind.ThrowKeyword | SyntaxKind.TrueKeyword | SyntaxKind.TryKeyword | SyntaxKind.TypeKeyword | SyntaxKind.TypeOfKeyword | SyntaxKind.UndefinedKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.UnknownKeyword | SyntaxKind.VarKeyword | SyntaxKind.VoidKeyword | SyntaxKind.WhileKeyword | SyntaxKind.WithKeyword | SyntaxKind.YieldKeyword;
    export type ModifierSyntaxKind = SyntaxKind.AbstractKeyword | SyntaxKind.AsyncKeyword | SyntaxKind.ConstKeyword | SyntaxKind.DeclareKeyword | SyntaxKind.DefaultKeyword | SyntaxKind.ExportKeyword | SyntaxKind.PrivateKeyword | SyntaxKind.ProtectedKeyword | SyntaxKind.PublicKeyword | SyntaxKind.ReadonlyKeyword | SyntaxKind.StaticKeyword;
    export type KeywordTypeSyntaxKind = SyntaxKind.AnyKeyword | SyntaxKind.BigIntKeyword | SyntaxKind.BooleanKeyword | SyntaxKind.IntrinsicKeyword | SyntaxKind.NeverKeyword | SyntaxKind.NumberKeyword | SyntaxKind.ObjectKeyword | SyntaxKind.StringKeyword | SyntaxKind.SymbolKeyword | SyntaxKind.UndefinedKeyword | SyntaxKind.UnknownKeyword | SyntaxKind.VoidKeyword;
    export type TypeNodeSyntaxKind = KeywordTypeSyntaxKind | SyntaxKind.TypePredicate | SyntaxKind.TypeReference | SyntaxKind.FunctionType | SyntaxKind.ConstructorType | SyntaxKind.TypeQuery | SyntaxKind.TypeLiteral | SyntaxKind.ArrayType | SyntaxKind.TupleType | SyntaxKind.NamedTupleMember | SyntaxKind.OptionalType | SyntaxKind.RestType | SyntaxKind.UnionType | SyntaxKind.IntersectionType | SyntaxKind.ConditionalType | SyntaxKind.InferType | SyntaxKind.ParenthesizedType | SyntaxKind.ThisType | SyntaxKind.TypeOperator | SyntaxKind.IndexedAccessType | SyntaxKind.MappedType | SyntaxKind.LiteralType | SyntaxKind.TemplateLiteralType | SyntaxKind.TemplateLiteralTypeSpan | SyntaxKind.ImportType | SyntaxKind.ExpressionWithTypeArguments | SyntaxKind.JSDocTypeExpression | SyntaxKind.JSDocAllType | SyntaxKind.JSDocUnknownType | SyntaxKind.JSDocNonNullableType | SyntaxKind.JSDocNullableType | SyntaxKind.JSDocOptionalType | SyntaxKind.JSDocFunctionType | SyntaxKind.JSDocVariadicType | SyntaxKind.JSDocNamepathType | SyntaxKind.JSDocSignature | SyntaxKind.JSDocTypeLiteral;
    export type TokenSyntaxKind = SyntaxKind.Unknown | SyntaxKind.EndOfFileToken | TriviaSyntaxKind | LiteralSyntaxKind | PseudoLiteralSyntaxKind | PunctuationSyntaxKind | SyntaxKind.Identifier | KeywordSyntaxKind;
    export type JsxTokenSyntaxKind = SyntaxKind.LessThanSlashToken | SyntaxKind.EndOfFileToken | SyntaxKind.ConflictMarkerTrivia | SyntaxKind.JsxText | SyntaxKind.JsxTextAllWhiteSpaces | SyntaxKind.OpenBraceToken | SyntaxKind.LessThanToken;
    export type JSDocSyntaxKind = SyntaxKind.EndOfFileToken | SyntaxKind.WhitespaceTrivia | SyntaxKind.AtToken | SyntaxKind.NewLineTrivia | SyntaxKind.AsteriskToken | SyntaxKind.OpenBraceToken | SyntaxKind.CloseBraceToken | SyntaxKind.LessThanToken | SyntaxKind.GreaterThanToken | SyntaxKind.OpenBracketToken | SyntaxKind.CloseBracketToken | SyntaxKind.EqualsToken | SyntaxKind.CommaToken | SyntaxKind.DotToken | SyntaxKind.Identifier | SyntaxKind.BacktickToken | SyntaxKind.Unknown | KeywordSyntaxKind;
    export const enum NodeFlags {
        None = 0,
        Let = 1,
        Const = 2,
        NestedNamespace = 4,
        Synthesized = 8,
        Namespace = 16,
        OptionalChain = 32,
        ExportContext = 64,
        ContainsThis = 128,
        HasImplicitReturn = 256,
        HasExplicitReturn = 512,
        GlobalAugmentation = 1024,
        HasAsyncFunctions = 2048,
        DisallowInContext = 4096,
        YieldContext = 8192,
        DecoratorContext = 16384,
        AwaitContext = 32768,
        ThisNodeHasError = 65536,
        JavaScriptFile = 131072,
        ThisNodeOrAnySubNodesHasError = 262144,
        HasAggregatedChildData = 524288,
        PossiblyContainsDynamicImport = 1048576,
        PossiblyContainsImportMeta = 2097152,
        JSDoc = 4194304,
        Ambient = 8388608,
        InWithStatement = 16777216,
        JsonFile = 33554432,
        TypeCached = 67108864,
        Deprecated = 134217728,
        BlockScoped = 3,
        ReachabilityCheckFlags = 768,
        ReachabilityAndEmitFlags = 2816,
        ContextFlags = 25358336,
        TypeExcludesFlags = 40960,
        PermanentlySetIncrementalFlags = 3145728
    }
    export const enum ModifierFlags {
        None = 0,
        Export = 1,
        Ambient = 2,
        Public = 4,
        Private = 8,
        Protected = 16,
        Static = 32,
        Readonly = 64,
        Abstract = 128,
        Async = 256,
        Default = 512,
        Const = 2048,
        HasComputedJSDocModifiers = 4096,
        Deprecated = 8192,
        HasComputedFlags = 536870912,
        AccessibilityModifier = 28,
        ParameterPropertyModifier = 92,
        NonPublicAccessibilityModifier = 24,
        TypeScriptModifier = 2270,
        ExportDefault = 513,
        All = 11263
    }
    export const enum JsxFlags {
        None = 0,
        /** An element from a named property of the JSX.IntrinsicElements interface */
        IntrinsicNamedElement = 1,
        /** An element inferred from the string index signature of the JSX.IntrinsicElements interface */
        IntrinsicIndexedElement = 2,
        IntrinsicElement = 3
    }
    export const enum RelationComparisonResult {
        Succeeded = 1,
        Failed = 2,
        Reported = 4,
        ReportsUnmeasurable = 8,
        ReportsUnreliable = 16,
        ReportsMask = 24
    }
    export type NodeId = number;
    export interface Node extends ReadonlyTextRange {
        readonly kind: SyntaxKind;
        readonly flags: NodeFlags;
        modifierFlagsCache: ModifierFlags;
        readonly transformFlags: TransformFlags;
        readonly decorators?: NodeArray<Decorator>;
        readonly modifiers?: ModifiersArray;
        id?: NodeId;
        readonly parent: Node;
        original?: Node;
        symbol: Symbol;
        locals?: SymbolTable;
        nextContainer?: Node;
        localSymbol?: Symbol;
        flowNode?: FlowNode;
        emitNode?: EmitNode;
        contextualType?: Type;
        inferenceContext?: InferenceContext;
    }
    export interface JSDocContainer {
        jsDoc?: JSDoc[];
        jsDocCache?: readonly JSDocTag[];
    }
    export type HasJSDoc = ParameterDeclaration | CallSignatureDeclaration | ConstructSignatureDeclaration | MethodSignature | PropertySignature | ArrowFunction | ParenthesizedExpression | SpreadAssignment | ShorthandPropertyAssignment | PropertyAssignment | FunctionExpression | LabeledStatement | ExpressionStatement | VariableStatement | FunctionDeclaration | ConstructorDeclaration | MethodDeclaration | PropertyDeclaration | AccessorDeclaration | ClassLikeDeclaration | InterfaceDeclaration | TypeAliasDeclaration | EnumMember | EnumDeclaration | ModuleDeclaration | ImportEqualsDeclaration | ImportDeclaration | NamespaceExportDeclaration | ExportAssignment | IndexSignatureDeclaration | FunctionTypeNode | ConstructorTypeNode | JSDocFunctionType | ExportDeclaration | NamedTupleMember | EndOfFileToken;
    export type HasType = SignatureDeclaration | VariableDeclaration | ParameterDeclaration | PropertySignature | PropertyDeclaration | TypePredicateNode | ParenthesizedTypeNode | TypeOperatorNode | MappedTypeNode | AssertionExpression | TypeAliasDeclaration | JSDocTypeExpression | JSDocNonNullableType | JSDocNullableType | JSDocOptionalType | JSDocVariadicType;
    export type HasTypeArguments = CallExpression | NewExpression | TaggedTemplateExpression | JsxOpeningElement | JsxSelfClosingElement;
    export type HasInitializer = HasExpressionInitializer | ForStatement | ForInStatement | ForOfStatement | JsxAttribute;
    export type HasExpressionInitializer = VariableDeclaration | ParameterDeclaration | BindingElement | PropertySignature | PropertyDeclaration | PropertyAssignment | EnumMember;
    export type HasModifiers = ParameterDeclaration | PropertySignature | PropertyDeclaration | MethodSignature | MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | IndexSignatureDeclaration | FunctionExpression | ArrowFunction | ClassExpression | VariableStatement | FunctionDeclaration | ClassDeclaration | InterfaceDeclaration | TypeAliasDeclaration | EnumDeclaration | ModuleDeclaration | ImportEqualsDeclaration | ImportDeclaration | ExportAssignment | ExportDeclaration;
    export type MutableNodeArray<T extends Node> = NodeArray<T> & T[];
    export interface NodeArray<T extends Node> extends ReadonlyArray<T>, ReadonlyTextRange {
        hasTrailingComma?: boolean;
        transformFlags: TransformFlags;
    }
    export interface Token<TKind extends SyntaxKind> extends Node {
        readonly kind: TKind;
    }
    export type EndOfFileToken = Token<SyntaxKind.EndOfFileToken> & JSDocContainer;
    export interface PunctuationToken<TKind extends PunctuationSyntaxKind> extends Token<TKind> {
    }
    export type DotToken = PunctuationToken<SyntaxKind.DotToken>;
    export type DotDotDotToken = PunctuationToken<SyntaxKind.DotDotDotToken>;
    export type QuestionToken = PunctuationToken<SyntaxKind.QuestionToken>;
    export type ExclamationToken = PunctuationToken<SyntaxKind.ExclamationToken>;
    export type ColonToken = PunctuationToken<SyntaxKind.ColonToken>;
    export type EqualsToken = PunctuationToken<SyntaxKind.EqualsToken>;
    export type AsteriskToken = PunctuationToken<SyntaxKind.AsteriskToken>;
    export type EqualsGreaterThanToken = PunctuationToken<SyntaxKind.EqualsGreaterThanToken>;
    export type PlusToken = PunctuationToken<SyntaxKind.PlusToken>;
    export type MinusToken = PunctuationToken<SyntaxKind.MinusToken>;
    export type QuestionDotToken = PunctuationToken<SyntaxKind.QuestionDotToken>;
    export interface KeywordToken<TKind extends KeywordSyntaxKind> extends Token<TKind> {
    }
    export type AssertsKeyword = KeywordToken<SyntaxKind.AssertsKeyword>;
    export type AwaitKeyword = KeywordToken<SyntaxKind.AwaitKeyword>;
    /** @deprecated Use `AwaitKeyword` instead. */
    export type AwaitKeywordToken = AwaitKeyword;
    /** @deprecated Use `AssertsKeyword` instead. */
    export type AssertsToken = AssertsKeyword;
    export interface ModifierToken<TKind extends ModifierSyntaxKind> extends KeywordToken<TKind> {
    }
    export type AbstractKeyword = ModifierToken<SyntaxKind.AbstractKeyword>;
    export type AsyncKeyword = ModifierToken<SyntaxKind.AsyncKeyword>;
    export type ConstKeyword = ModifierToken<SyntaxKind.ConstKeyword>;
    export type DeclareKeyword = ModifierToken<SyntaxKind.DeclareKeyword>;
    export type DefaultKeyword = ModifierToken<SyntaxKind.DefaultKeyword>;
    export type ExportKeyword = ModifierToken<SyntaxKind.ExportKeyword>;
    export type PrivateKeyword = ModifierToken<SyntaxKind.PrivateKeyword>;
    export type ProtectedKeyword = ModifierToken<SyntaxKind.ProtectedKeyword>;
    export type PublicKeyword = ModifierToken<SyntaxKind.PublicKeyword>;
    export type ReadonlyKeyword = ModifierToken<SyntaxKind.ReadonlyKeyword>;
    export type StaticKeyword = ModifierToken<SyntaxKind.StaticKeyword>;
    /** @deprecated Use `ReadonlyKeyword` instead. */
    export type ReadonlyToken = ReadonlyKeyword;
    export type Modifier = AbstractKeyword | AsyncKeyword | ConstKeyword | DeclareKeyword | DefaultKeyword | ExportKeyword | PrivateKeyword | ProtectedKeyword | PublicKeyword | ReadonlyKeyword | StaticKeyword;
    export type AccessibilityModifier = PublicKeyword | PrivateKeyword | ProtectedKeyword;
    export type ParameterPropertyModifier = AccessibilityModifier | ReadonlyKeyword;
    export type ClassMemberModifier = AccessibilityModifier | ReadonlyKeyword | StaticKeyword;
    export type ModifiersArray = NodeArray<Modifier>;
    export const enum GeneratedIdentifierFlags {
        None = 0,
        Auto = 1,
        Loop = 2,
        Unique = 3,
        Node = 4,
        KindMask = 7,
        ReservedInNestedScopes = 8,
        Optimistic = 16,
        FileLevel = 32,
        AllowNameSubstitution = 64
    }
    export interface Identifier extends PrimaryExpression, Declaration {
        readonly kind: SyntaxKind.Identifier;
        /**
         * Prefer to use `id.unescapedText`. (Note: This is available only in services, not internally to the TypeScript compiler.)
         * Text of identifier, but if the identifier begins with two underscores, this will begin with three.
         */
        readonly escapedText: __String;
        readonly originalKeywordKind?: SyntaxKind;
        readonly autoGenerateFlags?: GeneratedIdentifierFlags;
        readonly autoGenerateId?: number;
        generatedImportReference?: ImportSpecifier;
        isInJSDocNamespace?: boolean;
        typeArguments?: NodeArray<TypeNode | TypeParameterDeclaration>;
        jsdocDotPos?: number;
    }
    export interface TransientIdentifier extends Identifier {
        resolvedSymbol: Symbol;
    }
    export interface GeneratedIdentifier extends Identifier {
        autoGenerateFlags: GeneratedIdentifierFlags;
    }
    export interface QualifiedName extends Node {
        readonly kind: SyntaxKind.QualifiedName;
        readonly left: EntityName;
        readonly right: Identifier;
        jsdocDotPos?: number;
    }
    export type EntityName = Identifier | QualifiedName;
    export type PropertyName = Identifier | StringLiteral | NumericLiteral | ComputedPropertyName | PrivateIdentifier;
    export type DeclarationName = Identifier | PrivateIdentifier | StringLiteralLike | NumericLiteral | ComputedPropertyName | ElementAccessExpression | BindingPattern | EntityNameExpression;
    export interface Declaration extends Node {
        _declarationBrand: any;
    }
    export interface NamedDeclaration extends Declaration {
        readonly name?: DeclarationName;
    }
    export interface DynamicNamedDeclaration extends NamedDeclaration {
        readonly name: ComputedPropertyName;
    }
    export interface DynamicNamedBinaryExpression extends BinaryExpression {
        readonly left: ElementAccessExpression;
    }
    export interface LateBoundDeclaration extends DynamicNamedDeclaration {
        readonly name: LateBoundName;
    }
    export interface LateBoundBinaryExpressionDeclaration extends DynamicNamedBinaryExpression {
        readonly left: LateBoundElementAccessExpression;
    }
    export interface LateBoundElementAccessExpression extends ElementAccessExpression {
        readonly argumentExpression: EntityNameExpression;
    }
    export interface DeclarationStatement extends NamedDeclaration, Statement {
        readonly name?: Identifier | StringLiteral | NumericLiteral;
    }
    export interface ComputedPropertyName extends Node {
        readonly kind: SyntaxKind.ComputedPropertyName;
        readonly parent: Declaration;
        readonly expression: Expression;
    }
    export interface PrivateIdentifier extends Node {
        readonly kind: SyntaxKind.PrivateIdentifier;
        readonly escapedText: __String;
    }
    export interface LateBoundName extends ComputedPropertyName {
        readonly expression: EntityNameExpression;
    }
    export interface Decorator extends Node {
        readonly kind: SyntaxKind.Decorator;
        readonly parent: NamedDeclaration;
        readonly expression: LeftHandSideExpression;
    }
    export interface TypeParameterDeclaration extends NamedDeclaration {
        readonly kind: SyntaxKind.TypeParameter;
        readonly parent: DeclarationWithTypeParameterChildren | InferTypeNode;
        readonly name: Identifier;
        /** Note: Consider calling `getEffectiveConstraintOfTypeParameter` */
        readonly constraint?: TypeNode;
        readonly default?: TypeNode;
        expression?: Expression;
    }
    export interface SignatureDeclarationBase extends NamedDeclaration, JSDocContainer {
        readonly kind: SignatureDeclaration["kind"];
        readonly name?: PropertyName;
        readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
        readonly parameters: NodeArray<ParameterDeclaration>;
        readonly type?: TypeNode;
        typeArguments?: NodeArray<TypeNode>;
    }
    export type SignatureDeclaration = CallSignatureDeclaration | ConstructSignatureDeclaration | MethodSignature | IndexSignatureDeclaration | FunctionTypeNode | ConstructorTypeNode | JSDocFunctionType | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | AccessorDeclaration | FunctionExpression | ArrowFunction;
    export interface CallSignatureDeclaration extends SignatureDeclarationBase, TypeElement {
        readonly kind: SyntaxKind.CallSignature;
    }
    export interface ConstructSignatureDeclaration extends SignatureDeclarationBase, TypeElement {
        readonly kind: SyntaxKind.ConstructSignature;
    }
    export type BindingName = Identifier | BindingPattern;
    export interface VariableDeclaration extends NamedDeclaration {
        readonly kind: SyntaxKind.VariableDeclaration;
        readonly parent: VariableDeclarationList | CatchClause;
        readonly name: BindingName;
        readonly exclamationToken?: ExclamationToken;
        readonly type?: TypeNode;
        readonly initializer?: Expression;
    }
    export type InitializedVariableDeclaration = VariableDeclaration & {
        readonly initializer: Expression;
    };
    export interface VariableDeclarationList extends Node {
        readonly kind: SyntaxKind.VariableDeclarationList;
        readonly parent: VariableStatement | ForStatement | ForOfStatement | ForInStatement;
        readonly declarations: NodeArray<VariableDeclaration>;
    }
    export interface ParameterDeclaration extends NamedDeclaration, JSDocContainer {
        readonly kind: SyntaxKind.Parameter;
        readonly parent: SignatureDeclaration;
        readonly dotDotDotToken?: DotDotDotToken;
        readonly name: BindingName;
        readonly questionToken?: QuestionToken;
        readonly type?: TypeNode;
        readonly initializer?: Expression;
    }
    export interface BindingElement extends NamedDeclaration {
        readonly kind: SyntaxKind.BindingElement;
        readonly parent: BindingPattern;
        readonly propertyName?: PropertyName;
        readonly dotDotDotToken?: DotDotDotToken;
        readonly name: BindingName;
        readonly initializer?: Expression;
    }
    export type BindingElementGrandparent = BindingElement["parent"]["parent"];
    export interface PropertySignature extends TypeElement, JSDocContainer {
        readonly kind: SyntaxKind.PropertySignature;
        readonly name: PropertyName;
        readonly questionToken?: QuestionToken;
        readonly type?: TypeNode;
        initializer?: Expression;
    }
    export interface PropertyDeclaration extends ClassElement, JSDocContainer {
        readonly kind: SyntaxKind.PropertyDeclaration;
        readonly parent: ClassLikeDeclaration;
        readonly name: PropertyName;
        readonly questionToken?: QuestionToken;
        readonly exclamationToken?: ExclamationToken;
        readonly type?: TypeNode;
        readonly initializer?: Expression;
    }
    export interface PrivateIdentifierPropertyDeclaration extends PropertyDeclaration {
        name: PrivateIdentifier;
    }
    export type InitializedPropertyDeclaration = PropertyDeclaration & {
        readonly initializer: Expression;
    };
    export interface ObjectLiteralElement extends NamedDeclaration {
        _objectLiteralBrand: any;
        readonly name?: PropertyName;
    }
    /** Unlike ObjectLiteralElement, excludes JSXAttribute and JSXSpreadAttribute. */
    export type ObjectLiteralElementLike = PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment | MethodDeclaration | AccessorDeclaration;
    export interface PropertyAssignment extends ObjectLiteralElement, JSDocContainer {
        readonly kind: SyntaxKind.PropertyAssignment;
        readonly parent: ObjectLiteralExpression;
        readonly name: PropertyName;
        readonly questionToken?: QuestionToken;
        readonly exclamationToken?: ExclamationToken;
        readonly initializer: Expression;
    }
    export interface ShorthandPropertyAssignment extends ObjectLiteralElement, JSDocContainer {
        readonly kind: SyntaxKind.ShorthandPropertyAssignment;
        readonly parent: ObjectLiteralExpression;
        readonly name: Identifier;
        readonly questionToken?: QuestionToken;
        readonly exclamationToken?: ExclamationToken;
        readonly equalsToken?: EqualsToken;
        readonly objectAssignmentInitializer?: Expression;
    }
    export interface SpreadAssignment extends ObjectLiteralElement, JSDocContainer {
        readonly kind: SyntaxKind.SpreadAssignment;
        readonly parent: ObjectLiteralExpression;
        readonly expression: Expression;
    }
    export type VariableLikeDeclaration = VariableDeclaration | ParameterDeclaration | BindingElement | PropertyDeclaration | PropertyAssignment | PropertySignature | JsxAttribute | ShorthandPropertyAssignment | EnumMember | JSDocPropertyTag | JSDocParameterTag;
    export interface PropertyLikeDeclaration extends NamedDeclaration {
        readonly name: PropertyName;
    }
    export interface ObjectBindingPattern extends Node {
        readonly kind: SyntaxKind.ObjectBindingPattern;
        readonly parent: VariableDeclaration | ParameterDeclaration | BindingElement;
        readonly elements: NodeArray<BindingElement>;
    }
    export interface ArrayBindingPattern extends Node {
        readonly kind: SyntaxKind.ArrayBindingPattern;
        readonly parent: VariableDeclaration | ParameterDeclaration | BindingElement;
        readonly elements: NodeArray<ArrayBindingElement>;
    }
    export type BindingPattern = ObjectBindingPattern | ArrayBindingPattern;
    export type ArrayBindingElement = BindingElement | OmittedExpression;
    /**
     * Several node kinds share function-like features such as a signature,
     * a name, and a body. These nodes should extend FunctionLikeDeclarationBase.
     * Examples:
     * - FunctionDeclaration
     * - MethodDeclaration
     * - AccessorDeclaration
     */
    export interface FunctionLikeDeclarationBase extends SignatureDeclarationBase {
        _functionLikeDeclarationBrand: any;
        readonly asteriskToken?: AsteriskToken;
        readonly questionToken?: QuestionToken;
        readonly exclamationToken?: ExclamationToken;
        readonly body?: Block | Expression;
        endFlowNode?: FlowNode;
        returnFlowNode?: FlowNode;
    }
    export type FunctionLikeDeclaration = FunctionDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ConstructorDeclaration | FunctionExpression | ArrowFunction;
    /** @deprecated Use SignatureDeclaration */
    export type FunctionLike = SignatureDeclaration;
    export interface FunctionDeclaration extends FunctionLikeDeclarationBase, DeclarationStatement {
        readonly kind: SyntaxKind.FunctionDeclaration;
        readonly name?: Identifier;
        readonly body?: FunctionBody;
    }
    export interface MethodSignature extends SignatureDeclarationBase, TypeElement {
        readonly kind: SyntaxKind.MethodSignature;
        readonly parent: ObjectTypeDeclaration;
        readonly name: PropertyName;
    }
    export interface MethodDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
        readonly kind: SyntaxKind.MethodDeclaration;
        readonly parent: ClassLikeDeclaration | ObjectLiteralExpression;
        readonly name: PropertyName;
        readonly body?: FunctionBody;
        exclamationToken?: ExclamationToken;
    }
    export interface ConstructorDeclaration extends FunctionLikeDeclarationBase, ClassElement, JSDocContainer {
        readonly kind: SyntaxKind.Constructor;
        readonly parent: ClassLikeDeclaration;
        readonly body?: FunctionBody;
        typeParameters?: NodeArray<TypeParameterDeclaration>;
        type?: TypeNode;
    }
    /** For when we encounter a semicolon in a class declaration. ES6 allows these as class elements. */
    export interface SemicolonClassElement extends ClassElement {
        readonly kind: SyntaxKind.SemicolonClassElement;
        readonly parent: ClassLikeDeclaration;
    }
    export interface GetAccessorDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
        readonly kind: SyntaxKind.GetAccessor;
        readonly parent: ClassLikeDeclaration | ObjectLiteralExpression;
        readonly name: PropertyName;
        readonly body?: FunctionBody;
        typeParameters?: NodeArray<TypeParameterDeclaration>;
    }
    export interface SetAccessorDeclaration extends FunctionLikeDeclarationBase, ClassElement, ObjectLiteralElement, JSDocContainer {
        readonly kind: SyntaxKind.SetAccessor;
        readonly parent: ClassLikeDeclaration | ObjectLiteralExpression;
        readonly name: PropertyName;
        readonly body?: FunctionBody;
        typeParameters?: NodeArray<TypeParameterDeclaration>;
        type?: TypeNode;
    }
    export type AccessorDeclaration = GetAccessorDeclaration | SetAccessorDeclaration;
    export interface IndexSignatureDeclaration extends SignatureDeclarationBase, ClassElement, TypeElement {
        readonly kind: SyntaxKind.IndexSignature;
        readonly parent: ObjectTypeDeclaration;
        readonly type: TypeNode;
    }
    export interface TypeNode extends Node {
        _typeNodeBrand: any;
    }
    export interface TypeNode extends Node {
        readonly kind: TypeNodeSyntaxKind;
    }
    export interface KeywordTypeNode<TKind extends KeywordTypeSyntaxKind = KeywordTypeSyntaxKind> extends KeywordToken<TKind>, TypeNode {
        readonly kind: TKind;
    }
    export interface ImportTypeNode extends NodeWithTypeArguments {
        readonly kind: SyntaxKind.ImportType;
        readonly isTypeOf: boolean;
        readonly argument: TypeNode;
        readonly qualifier?: EntityName;
    }
    export type LiteralImportTypeNode = ImportTypeNode & {
        readonly argument: LiteralTypeNode & {
            readonly literal: StringLiteral;
        };
    };
    export interface ThisTypeNode extends TypeNode {
        readonly kind: SyntaxKind.ThisType;
    }
    export type FunctionOrConstructorTypeNode = FunctionTypeNode | ConstructorTypeNode;
    export interface FunctionOrConstructorTypeNodeBase extends TypeNode, SignatureDeclarationBase {
        readonly kind: SyntaxKind.FunctionType | SyntaxKind.ConstructorType;
        readonly type: TypeNode;
    }
    export interface FunctionTypeNode extends FunctionOrConstructorTypeNodeBase {
        readonly kind: SyntaxKind.FunctionType;
    }
    export interface ConstructorTypeNode extends FunctionOrConstructorTypeNodeBase {
        readonly kind: SyntaxKind.ConstructorType;
    }
    export interface NodeWithTypeArguments extends TypeNode {
        readonly typeArguments?: NodeArray<TypeNode>;
    }
    export type TypeReferenceType = TypeReferenceNode | ExpressionWithTypeArguments;
    export interface TypeReferenceNode extends NodeWithTypeArguments {
        readonly kind: SyntaxKind.TypeReference;
        readonly typeName: EntityName;
    }
    export interface TypePredicateNode extends TypeNode {
        readonly kind: SyntaxKind.TypePredicate;
        readonly parent: SignatureDeclaration | JSDocTypeExpression;
        readonly assertsModifier?: AssertsToken;
        readonly parameterName: Identifier | ThisTypeNode;
        readonly type?: TypeNode;
    }
    export interface TypeQueryNode extends TypeNode {
        readonly kind: SyntaxKind.TypeQuery;
        readonly exprName: EntityName;
    }
    export interface TypeLiteralNode extends TypeNode, Declaration {
        readonly kind: SyntaxKind.TypeLiteral;
        readonly members: NodeArray<TypeElement>;
    }
    export interface ArrayTypeNode extends TypeNode {
        readonly kind: SyntaxKind.ArrayType;
        readonly elementType: TypeNode;
    }
    export interface TupleTypeNode extends TypeNode {
        readonly kind: SyntaxKind.TupleType;
        readonly elements: NodeArray<TypeNode | NamedTupleMember>;
    }
    export interface NamedTupleMember extends TypeNode, JSDocContainer, Declaration {
        readonly kind: SyntaxKind.NamedTupleMember;
        readonly dotDotDotToken?: Token<SyntaxKind.DotDotDotToken>;
        readonly name: Identifier;
        readonly questionToken?: Token<SyntaxKind.QuestionToken>;
        readonly type: TypeNode;
    }
    export interface OptionalTypeNode extends TypeNode {
        readonly kind: SyntaxKind.OptionalType;
        readonly type: TypeNode;
    }
    export interface RestTypeNode extends TypeNode {
        readonly kind: SyntaxKind.RestType;
        readonly type: TypeNode;
    }
    export type UnionOrIntersectionTypeNode = UnionTypeNode | IntersectionTypeNode;
    export interface UnionTypeNode extends TypeNode {
        readonly kind: SyntaxKind.UnionType;
        readonly types: NodeArray<TypeNode>;
    }
    export interface IntersectionTypeNode extends TypeNode {
        readonly kind: SyntaxKind.IntersectionType;
        readonly types: NodeArray<TypeNode>;
    }
    export interface ConditionalTypeNode extends TypeNode {
        readonly kind: SyntaxKind.ConditionalType;
        readonly checkType: TypeNode;
        readonly extendsType: TypeNode;
        readonly trueType: TypeNode;
        readonly falseType: TypeNode;
    }
    export interface InferTypeNode extends TypeNode {
        readonly kind: SyntaxKind.InferType;
        readonly typeParameter: TypeParameterDeclaration;
    }
    export interface ParenthesizedTypeNode extends TypeNode {
        readonly kind: SyntaxKind.ParenthesizedType;
        readonly type: TypeNode;
    }
    export interface TypeOperatorNode extends TypeNode {
        readonly kind: SyntaxKind.TypeOperator;
        readonly operator: SyntaxKind.KeyOfKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.ReadonlyKeyword;
        readonly type: TypeNode;
    }
    export interface UniqueTypeOperatorNode extends TypeOperatorNode {
        readonly operator: SyntaxKind.UniqueKeyword;
    }
    export interface IndexedAccessTypeNode extends TypeNode {
        readonly kind: SyntaxKind.IndexedAccessType;
        readonly objectType: TypeNode;
        readonly indexType: TypeNode;
    }
    export interface MappedTypeNode extends TypeNode, Declaration {
        readonly kind: SyntaxKind.MappedType;
        readonly readonlyToken?: ReadonlyToken | PlusToken | MinusToken;
        readonly typeParameter: TypeParameterDeclaration;
        readonly nameType?: TypeNode;
        readonly questionToken?: QuestionToken | PlusToken | MinusToken;
        readonly type?: TypeNode;
    }
    export interface LiteralTypeNode extends TypeNode {
        readonly kind: SyntaxKind.LiteralType;
        readonly literal: NullLiteral | BooleanLiteral | LiteralExpression | PrefixUnaryExpression;
    }
    export interface StringLiteral extends LiteralExpression, Declaration {
        readonly kind: SyntaxKind.StringLiteral;
        readonly textSourceNode?: Identifier | StringLiteralLike | NumericLiteral;
        /** Note: this is only set when synthesizing a node, not during parsing. */
        readonly singleQuote?: boolean;
    }
    export type StringLiteralLike = StringLiteral | NoSubstitutionTemplateLiteral;
    export type PropertyNameLiteral = Identifier | StringLiteralLike | NumericLiteral;
    export interface TemplateLiteralTypeNode extends TypeNode {
        kind: SyntaxKind.TemplateLiteralType;
        readonly head: TemplateHead;
        readonly templateSpans: NodeArray<TemplateLiteralTypeSpan>;
    }
    export interface TemplateLiteralTypeSpan extends TypeNode {
        readonly kind: SyntaxKind.TemplateLiteralTypeSpan;
        readonly parent: TemplateLiteralTypeNode;
        readonly type: TypeNode;
        readonly literal: TemplateMiddle | TemplateTail;
    }
    export interface Expression extends Node {
        _expressionBrand: any;
    }
    export interface OmittedExpression extends Expression {
        readonly kind: SyntaxKind.OmittedExpression;
    }
    export interface PartiallyEmittedExpression extends LeftHandSideExpression {
        readonly kind: SyntaxKind.PartiallyEmittedExpression;
        readonly expression: Expression;
    }
    export interface UnaryExpression extends Expression {
        _unaryExpressionBrand: any;
    }
    /** Deprecated, please use UpdateExpression */
    export type IncrementExpression = UpdateExpression;
    export interface UpdateExpression extends UnaryExpression {
        _updateExpressionBrand: any;
    }
    export type PrefixUnaryOperator = SyntaxKind.PlusPlusToken | SyntaxKind.MinusMinusToken | SyntaxKind.PlusToken | SyntaxKind.MinusToken | SyntaxKind.TildeToken | SyntaxKind.ExclamationToken;
    export interface PrefixUnaryExpression extends UpdateExpression {
        readonly kind: SyntaxKind.PrefixUnaryExpression;
        readonly operator: PrefixUnaryOperator;
        readonly operand: UnaryExpression;
    }
    export type PostfixUnaryOperator = SyntaxKind.PlusPlusToken | SyntaxKind.MinusMinusToken;
    export interface PostfixUnaryExpression extends UpdateExpression {
        readonly kind: SyntaxKind.PostfixUnaryExpression;
        readonly operand: LeftHandSideExpression;
        readonly operator: PostfixUnaryOperator;
    }
    export interface LeftHandSideExpression extends UpdateExpression {
        _leftHandSideExpressionBrand: any;
    }
    export interface MemberExpression extends LeftHandSideExpression {
        _memberExpressionBrand: any;
    }
    export interface PrimaryExpression extends MemberExpression {
        _primaryExpressionBrand: any;
    }
    export interface NullLiteral extends PrimaryExpression {
        readonly kind: SyntaxKind.NullKeyword;
    }
    export interface TrueLiteral extends PrimaryExpression {
        readonly kind: SyntaxKind.TrueKeyword;
    }
    export interface FalseLiteral extends PrimaryExpression {
        readonly kind: SyntaxKind.FalseKeyword;
    }
    export type BooleanLiteral = TrueLiteral | FalseLiteral;
    export interface ThisExpression extends PrimaryExpression {
        readonly kind: SyntaxKind.ThisKeyword;
    }
    export interface SuperExpression extends PrimaryExpression {
        readonly kind: SyntaxKind.SuperKeyword;
    }
    export interface ImportExpression extends PrimaryExpression {
        readonly kind: SyntaxKind.ImportKeyword;
    }
    export interface DeleteExpression extends UnaryExpression {
        readonly kind: SyntaxKind.DeleteExpression;
        readonly expression: UnaryExpression;
    }
    export interface TypeOfExpression extends UnaryExpression {
        readonly kind: SyntaxKind.TypeOfExpression;
        readonly expression: UnaryExpression;
    }
    export interface VoidExpression extends UnaryExpression {
        readonly kind: SyntaxKind.VoidExpression;
        readonly expression: UnaryExpression;
    }
    export interface AwaitExpression extends UnaryExpression {
        readonly kind: SyntaxKind.AwaitExpression;
        readonly expression: UnaryExpression;
    }
    export interface YieldExpression extends Expression {
        readonly kind: SyntaxKind.YieldExpression;
        readonly asteriskToken?: AsteriskToken;
        readonly expression?: Expression;
    }
    export interface SyntheticExpression extends Expression {
        readonly kind: SyntaxKind.SyntheticExpression;
        readonly isSpread: boolean;
        readonly type: Type;
        readonly tupleNameSource?: ParameterDeclaration | NamedTupleMember;
    }
    export type ExponentiationOperator = SyntaxKind.AsteriskAsteriskToken;
    export type MultiplicativeOperator = SyntaxKind.AsteriskToken | SyntaxKind.SlashToken | SyntaxKind.PercentToken;
    export type MultiplicativeOperatorOrHigher = ExponentiationOperator | MultiplicativeOperator;
    export type AdditiveOperator = SyntaxKind.PlusToken | SyntaxKind.MinusToken;
    export type AdditiveOperatorOrHigher = MultiplicativeOperatorOrHigher | AdditiveOperator;
    export type ShiftOperator = SyntaxKind.LessThanLessThanToken | SyntaxKind.GreaterThanGreaterThanToken | SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
    export type ShiftOperatorOrHigher = AdditiveOperatorOrHigher | ShiftOperator;
    export type RelationalOperator = SyntaxKind.LessThanToken | SyntaxKind.LessThanEqualsToken | SyntaxKind.GreaterThanToken | SyntaxKind.GreaterThanEqualsToken | SyntaxKind.InstanceOfKeyword | SyntaxKind.InKeyword;
    export type RelationalOperatorOrHigher = ShiftOperatorOrHigher | RelationalOperator;
    export type EqualityOperator = SyntaxKind.EqualsEqualsToken | SyntaxKind.EqualsEqualsEqualsToken | SyntaxKind.ExclamationEqualsEqualsToken | SyntaxKind.ExclamationEqualsToken;
    export type EqualityOperatorOrHigher = RelationalOperatorOrHigher | EqualityOperator;
    export type BitwiseOperator = SyntaxKind.AmpersandToken | SyntaxKind.BarToken | SyntaxKind.CaretToken;
    export type BitwiseOperatorOrHigher = EqualityOperatorOrHigher | BitwiseOperator;
    export type LogicalOperator = SyntaxKind.AmpersandAmpersandToken | SyntaxKind.BarBarToken;
    export type LogicalOperatorOrHigher = BitwiseOperatorOrHigher | LogicalOperator;
    export type CompoundAssignmentOperator = SyntaxKind.PlusEqualsToken | SyntaxKind.MinusEqualsToken | SyntaxKind.AsteriskAsteriskEqualsToken | SyntaxKind.AsteriskEqualsToken | SyntaxKind.SlashEqualsToken | SyntaxKind.PercentEqualsToken | SyntaxKind.AmpersandEqualsToken | SyntaxKind.BarEqualsToken | SyntaxKind.CaretEqualsToken | SyntaxKind.LessThanLessThanEqualsToken | SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken | SyntaxKind.GreaterThanGreaterThanEqualsToken | SyntaxKind.BarBarEqualsToken | SyntaxKind.AmpersandAmpersandEqualsToken | SyntaxKind.QuestionQuestionEqualsToken;
    export type AssignmentOperator = SyntaxKind.EqualsToken | CompoundAssignmentOperator;
    export type AssignmentOperatorOrHigher = SyntaxKind.QuestionQuestionToken | LogicalOperatorOrHigher | AssignmentOperator;
    export type BinaryOperator = AssignmentOperatorOrHigher | SyntaxKind.CommaToken;
    export type LogicalOrCoalescingAssignmentOperator = SyntaxKind.AmpersandAmpersandEqualsToken | SyntaxKind.BarBarEqualsToken | SyntaxKind.QuestionQuestionEqualsToken;
    export type BinaryOperatorToken = Token<BinaryOperator>;
    export interface BinaryExpression extends Expression, Declaration {
        readonly kind: SyntaxKind.BinaryExpression;
        readonly left: Expression;
        readonly operatorToken: BinaryOperatorToken;
        readonly right: Expression;
    }
    export type AssignmentOperatorToken = Token<AssignmentOperator>;
    export interface AssignmentExpression<TOperator extends AssignmentOperatorToken> extends BinaryExpression {
        readonly left: LeftHandSideExpression;
        readonly operatorToken: TOperator;
    }
    export interface ObjectDestructuringAssignment extends AssignmentExpression<EqualsToken> {
        readonly left: ObjectLiteralExpression;
    }
    export interface ArrayDestructuringAssignment extends AssignmentExpression<EqualsToken> {
        readonly left: ArrayLiteralExpression;
    }
    export type DestructuringAssignment = ObjectDestructuringAssignment | ArrayDestructuringAssignment;
    export type BindingOrAssignmentElement = VariableDeclaration | ParameterDeclaration | ObjectBindingOrAssignmentElement | ArrayBindingOrAssignmentElement;
    export type ObjectBindingOrAssignmentElement = BindingElement | PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment;
    export type ArrayBindingOrAssignmentElement = BindingElement | OmittedExpression | SpreadElement | ArrayLiteralExpression | ObjectLiteralExpression | AssignmentExpression<EqualsToken> | Identifier | PropertyAccessExpression | ElementAccessExpression;
    export type BindingOrAssignmentElementRestIndicator = DotDotDotToken | SpreadElement | SpreadAssignment;
    export type BindingOrAssignmentElementTarget = BindingOrAssignmentPattern | Identifier | PropertyAccessExpression | ElementAccessExpression | OmittedExpression;
    export type ObjectBindingOrAssignmentPattern = ObjectBindingPattern | ObjectLiteralExpression;
    export type ArrayBindingOrAssignmentPattern = ArrayBindingPattern | ArrayLiteralExpression;
    export type AssignmentPattern = ObjectLiteralExpression | ArrayLiteralExpression;
    export type BindingOrAssignmentPattern = ObjectBindingOrAssignmentPattern | ArrayBindingOrAssignmentPattern;
    export interface ConditionalExpression extends Expression {
        readonly kind: SyntaxKind.ConditionalExpression;
        readonly condition: Expression;
        readonly questionToken: QuestionToken;
        readonly whenTrue: Expression;
        readonly colonToken: ColonToken;
        readonly whenFalse: Expression;
    }
    export type FunctionBody = Block;
    export type ConciseBody = FunctionBody | Expression;
    export interface FunctionExpression extends PrimaryExpression, FunctionLikeDeclarationBase, JSDocContainer {
        readonly kind: SyntaxKind.FunctionExpression;
        readonly name?: Identifier;
        readonly body: FunctionBody;
    }
    export interface ArrowFunction extends Expression, FunctionLikeDeclarationBase, JSDocContainer {
        readonly kind: SyntaxKind.ArrowFunction;
        readonly equalsGreaterThanToken: EqualsGreaterThanToken;
        readonly body: ConciseBody;
        readonly name: never;
    }
    export interface LiteralLikeNode extends Node {
        text: string;
        isUnterminated?: boolean;
        hasExtendedUnicodeEscape?: boolean;
    }
    export interface TemplateLiteralLikeNode extends LiteralLikeNode {
        rawText?: string;
        templateFlags?: TokenFlags;
    }
    export interface LiteralExpression extends LiteralLikeNode, PrimaryExpression {
        _literalExpressionBrand: any;
    }
    export interface RegularExpressionLiteral extends LiteralExpression {
        readonly kind: SyntaxKind.RegularExpressionLiteral;
    }
    export interface NoSubstitutionTemplateLiteral extends LiteralExpression, TemplateLiteralLikeNode, Declaration {
        readonly kind: SyntaxKind.NoSubstitutionTemplateLiteral;
        templateFlags?: TokenFlags;
    }
    export const enum TokenFlags {
        None = 0,
        PrecedingLineBreak = 1,
        PrecedingJSDocComment = 2,
        Unterminated = 4,
        ExtendedUnicodeEscape = 8,
        Scientific = 16,
        Octal = 32,
        HexSpecifier = 64,
        BinarySpecifier = 128,
        OctalSpecifier = 256,
        ContainsSeparator = 512,
        UnicodeEscape = 1024,
        ContainsInvalidEscape = 2048,
        BinaryOrOctalSpecifier = 384,
        NumericLiteralFlags = 1008,
        TemplateLiteralLikeFlags = 2048
    }
    export interface NumericLiteral extends LiteralExpression, Declaration {
        readonly kind: SyntaxKind.NumericLiteral;
        readonly numericLiteralFlags: TokenFlags;
    }
    export interface BigIntLiteral extends LiteralExpression {
        readonly kind: SyntaxKind.BigIntLiteral;
    }
    export type LiteralToken = NumericLiteral | BigIntLiteral | StringLiteral | JsxText | RegularExpressionLiteral | NoSubstitutionTemplateLiteral;
    export interface TemplateHead extends TemplateLiteralLikeNode {
        readonly kind: SyntaxKind.TemplateHead;
        readonly parent: TemplateExpression | TemplateLiteralTypeNode;
        templateFlags?: TokenFlags;
    }
    export interface TemplateMiddle extends TemplateLiteralLikeNode {
        readonly kind: SyntaxKind.TemplateMiddle;
        readonly parent: TemplateSpan | TemplateLiteralTypeSpan;
        templateFlags?: TokenFlags;
    }
    export interface TemplateTail extends TemplateLiteralLikeNode {
        readonly kind: SyntaxKind.TemplateTail;
        readonly parent: TemplateSpan | TemplateLiteralTypeSpan;
        templateFlags?: TokenFlags;
    }
    export type PseudoLiteralToken = TemplateHead | TemplateMiddle | TemplateTail;
    export type TemplateLiteralToken = NoSubstitutionTemplateLiteral | PseudoLiteralToken;
    export interface TemplateExpression extends PrimaryExpression {
        readonly kind: SyntaxKind.TemplateExpression;
        readonly head: TemplateHead;
        readonly templateSpans: NodeArray<TemplateSpan>;
    }
    export type TemplateLiteral = TemplateExpression | NoSubstitutionTemplateLiteral;
    export interface TemplateSpan extends Node {
        readonly kind: SyntaxKind.TemplateSpan;
        readonly parent: TemplateExpression;
        readonly expression: Expression;
        readonly literal: TemplateMiddle | TemplateTail;
    }
    export interface ParenthesizedExpression extends PrimaryExpression, JSDocContainer {
        readonly kind: SyntaxKind.ParenthesizedExpression;
        readonly expression: Expression;
    }
    export interface ArrayLiteralExpression extends PrimaryExpression {
        readonly kind: SyntaxKind.ArrayLiteralExpression;
        readonly elements: NodeArray<Expression>;
        multiLine?: boolean;
    }
    export interface SpreadElement extends Expression {
        readonly kind: SyntaxKind.SpreadElement;
        readonly parent: ArrayLiteralExpression | CallExpression | NewExpression;
        readonly expression: Expression;
    }
    /**
     * This interface is a base interface for ObjectLiteralExpression and JSXAttributes to extend from. JSXAttributes is similar to
     * ObjectLiteralExpression in that it contains array of properties; however, JSXAttributes' properties can only be
     * JSXAttribute or JSXSpreadAttribute. ObjectLiteralExpression, on the other hand, can only have properties of type
     * ObjectLiteralElement (e.g. PropertyAssignment, ShorthandPropertyAssignment etc.)
     */
    export interface ObjectLiteralExpressionBase<T extends ObjectLiteralElement> extends PrimaryExpression, Declaration {
        readonly properties: NodeArray<T>;
    }
    export interface ObjectLiteralExpression extends ObjectLiteralExpressionBase<ObjectLiteralElementLike> {
        readonly kind: SyntaxKind.ObjectLiteralExpression;
        multiLine?: boolean;
    }
    export type EntityNameExpression = Identifier | PropertyAccessEntityNameExpression;
    export type EntityNameOrEntityNameExpression = EntityName | EntityNameExpression;
    export type AccessExpression = PropertyAccessExpression | ElementAccessExpression;
    export interface PropertyAccessExpression extends MemberExpression, NamedDeclaration {
        readonly kind: SyntaxKind.PropertyAccessExpression;
        readonly expression: LeftHandSideExpression;
        readonly questionDotToken?: QuestionDotToken;
        readonly name: Identifier | PrivateIdentifier;
    }
    export interface PrivateIdentifierPropertyAccessExpression extends PropertyAccessExpression {
        readonly name: PrivateIdentifier;
    }
    export interface PropertyAccessChain extends PropertyAccessExpression {
        _optionalChainBrand: any;
        readonly name: Identifier | PrivateIdentifier;
    }
    export interface PropertyAccessChainRoot extends PropertyAccessChain {
        readonly questionDotToken: QuestionDotToken;
    }
    export interface SuperPropertyAccessExpression extends PropertyAccessExpression {
        readonly expression: SuperExpression;
    }
    /** Brand for a PropertyAccessExpression which, like a QualifiedName, consists of a sequence of identifiers separated by dots. */
    export interface PropertyAccessEntityNameExpression extends PropertyAccessExpression {
        _propertyAccessExpressionLikeQualifiedNameBrand?: any;
        readonly expression: EntityNameExpression;
        readonly name: Identifier;
    }
    export interface ElementAccessExpression extends MemberExpression {
        readonly kind: SyntaxKind.ElementAccessExpression;
        readonly expression: LeftHandSideExpression;
        readonly questionDotToken?: QuestionDotToken;
        readonly argumentExpression: Expression;
    }
    export interface ElementAccessChain extends ElementAccessExpression {
        _optionalChainBrand: any;
    }
    export interface ElementAccessChainRoot extends ElementAccessChain {
        readonly questionDotToken: QuestionDotToken;
    }
    export interface SuperElementAccessExpression extends ElementAccessExpression {
        readonly expression: SuperExpression;
    }
    export type SuperProperty = SuperPropertyAccessExpression | SuperElementAccessExpression;
    export interface CallExpression extends LeftHandSideExpression, Declaration {
        readonly kind: SyntaxKind.CallExpression;
        readonly expression: LeftHandSideExpression;
        readonly questionDotToken?: QuestionDotToken;
        readonly typeArguments?: NodeArray<TypeNode>;
        readonly arguments: NodeArray<Expression>;
    }
    export interface CallChain extends CallExpression {
        _optionalChainBrand: any;
    }
    export interface CallChainRoot extends CallChain {
        readonly questionDotToken: QuestionDotToken;
    }
    export type OptionalChain = PropertyAccessChain | ElementAccessChain | CallChain | NonNullChain;
    export type OptionalChainRoot = PropertyAccessChainRoot | ElementAccessChainRoot | CallChainRoot;
    /** @internal */
    export interface WellKnownSymbolExpression extends PropertyAccessExpression {
        readonly expression: Identifier & {
            readonly escapedText: __String & "Symbol";
        };
        readonly name: Identifier;
    }
    /** @internal */
    export type BindableObjectDefinePropertyCall = CallExpression & {
        readonly arguments: readonly [BindableStaticNameExpression, StringLiteralLike | NumericLiteral, ObjectLiteralExpression] & Readonly<TextRange>;
    };
    /** @internal */
    export type BindableStaticNameExpression = EntityNameExpression | BindableStaticElementAccessExpression;
    /** @internal */
    export type LiteralLikeElementAccessExpression = ElementAccessExpression & Declaration & {
        readonly argumentExpression: StringLiteralLike | NumericLiteral | WellKnownSymbolExpression;
    };
    /** @internal */
    export type BindableStaticElementAccessExpression = LiteralLikeElementAccessExpression & {
        readonly expression: BindableStaticNameExpression;
    };
    /** @internal */
    export type BindableElementAccessExpression = ElementAccessExpression & {
        readonly expression: BindableStaticNameExpression;
    };
    /** @internal */
    export type BindableStaticAccessExpression = PropertyAccessEntityNameExpression | BindableStaticElementAccessExpression;
    /** @internal */
    export type BindableAccessExpression = PropertyAccessEntityNameExpression | BindableElementAccessExpression;
    /** @internal */
    export interface BindableStaticPropertyAssignmentExpression extends BinaryExpression {
        readonly left: BindableStaticAccessExpression;
    }
    /** @internal */
    export interface BindablePropertyAssignmentExpression extends BinaryExpression {
        readonly left: BindableAccessExpression;
    }
    export interface SuperCall extends CallExpression {
        readonly expression: SuperExpression;
    }
    export interface ImportCall extends CallExpression {
        readonly expression: ImportExpression;
    }
    export interface ExpressionWithTypeArguments extends NodeWithTypeArguments {
        readonly kind: SyntaxKind.ExpressionWithTypeArguments;
        readonly parent: HeritageClause | JSDocAugmentsTag | JSDocImplementsTag;
        readonly expression: LeftHandSideExpression;
    }
    export interface NewExpression extends PrimaryExpression, Declaration {
        readonly kind: SyntaxKind.NewExpression;
        readonly expression: LeftHandSideExpression;
        readonly typeArguments?: NodeArray<TypeNode>;
        readonly arguments?: NodeArray<Expression>;
    }
    export interface TaggedTemplateExpression extends MemberExpression {
        readonly kind: SyntaxKind.TaggedTemplateExpression;
        readonly tag: LeftHandSideExpression;
        readonly typeArguments?: NodeArray<TypeNode>;
        readonly template: TemplateLiteral;
        questionDotToken?: QuestionDotToken;
    }
    export type CallLikeExpression = CallExpression | NewExpression | TaggedTemplateExpression | Decorator | JsxOpeningLikeElement;
    export interface AsExpression extends Expression {
        readonly kind: SyntaxKind.AsExpression;
        readonly expression: Expression;
        readonly type: TypeNode;
    }
    export interface TypeAssertion extends UnaryExpression {
        readonly kind: SyntaxKind.TypeAssertionExpression;
        readonly type: TypeNode;
        readonly expression: UnaryExpression;
    }
    export type AssertionExpression = TypeAssertion | AsExpression;
    export interface NonNullExpression extends LeftHandSideExpression {
        readonly kind: SyntaxKind.NonNullExpression;
        readonly expression: Expression;
    }
    export interface NonNullChain extends NonNullExpression {
        _optionalChainBrand: any;
    }
    export interface MetaProperty extends PrimaryExpression {
        readonly kind: SyntaxKind.MetaProperty;
        readonly keywordToken: SyntaxKind.NewKeyword | SyntaxKind.ImportKeyword;
        readonly name: Identifier;
    }
    export interface ImportMetaProperty extends MetaProperty {
        readonly keywordToken: SyntaxKind.ImportKeyword;
        readonly name: Identifier & {
            readonly escapedText: __String & "meta";
        };
    }
    export interface JsxElement extends PrimaryExpression {
        readonly kind: SyntaxKind.JsxElement;
        readonly openingElement: JsxOpeningElement;
        readonly children: NodeArray<JsxChild>;
        readonly closingElement: JsxClosingElement;
    }
    export type JsxOpeningLikeElement = JsxSelfClosingElement | JsxOpeningElement;
    export type JsxAttributeLike = JsxAttribute | JsxSpreadAttribute;
    export type JsxTagNameExpression = Identifier | ThisExpression | JsxTagNamePropertyAccess;
    export interface JsxTagNamePropertyAccess extends PropertyAccessExpression {
        readonly expression: JsxTagNameExpression;
    }
    export interface JsxAttributes extends ObjectLiteralExpressionBase<JsxAttributeLike> {
        readonly kind: SyntaxKind.JsxAttributes;
        readonly parent: JsxOpeningLikeElement;
    }
    export interface JsxOpeningElement extends Expression {
        readonly kind: SyntaxKind.JsxOpeningElement;
        readonly parent: JsxElement;
        readonly tagName: JsxTagNameExpression;
        readonly typeArguments?: NodeArray<TypeNode>;
        readonly attributes: JsxAttributes;
    }
    export interface JsxSelfClosingElement extends PrimaryExpression {
        readonly kind: SyntaxKind.JsxSelfClosingElement;
        readonly tagName: JsxTagNameExpression;
        readonly typeArguments?: NodeArray<TypeNode>;
        readonly attributes: JsxAttributes;
    }
    export interface JsxFragment extends PrimaryExpression {
        readonly kind: SyntaxKind.JsxFragment;
        readonly openingFragment: JsxOpeningFragment;
        readonly children: NodeArray<JsxChild>;
        readonly closingFragment: JsxClosingFragment;
    }
    export interface JsxOpeningFragment extends Expression {
        readonly kind: SyntaxKind.JsxOpeningFragment;
        readonly parent: JsxFragment;
    }
    export interface JsxClosingFragment extends Expression {
        readonly kind: SyntaxKind.JsxClosingFragment;
        readonly parent: JsxFragment;
    }
    export interface JsxAttribute extends ObjectLiteralElement {
        readonly kind: SyntaxKind.JsxAttribute;
        readonly parent: JsxAttributes;
        readonly name: Identifier;
        readonly initializer?: StringLiteral | JsxExpression;
    }
    export interface JsxSpreadAttribute extends ObjectLiteralElement {
        readonly kind: SyntaxKind.JsxSpreadAttribute;
        readonly parent: JsxAttributes;
        readonly expression: Expression;
    }
    export interface JsxClosingElement extends Node {
        readonly kind: SyntaxKind.JsxClosingElement;
        readonly parent: JsxElement;
        readonly tagName: JsxTagNameExpression;
    }
    export interface JsxExpression extends Expression {
        readonly kind: SyntaxKind.JsxExpression;
        readonly parent: JsxElement | JsxAttributeLike;
        readonly dotDotDotToken?: Token<SyntaxKind.DotDotDotToken>;
        readonly expression?: Expression;
    }
    export interface JsxText extends LiteralLikeNode {
        readonly kind: SyntaxKind.JsxText;
        readonly parent: JsxElement;
        readonly containsOnlyTriviaWhiteSpaces: boolean;
    }
    export type JsxChild = JsxText | JsxExpression | JsxElement | JsxSelfClosingElement | JsxFragment;
    export interface Statement extends Node {
        _statementBrand: any;
    }
    export interface NotEmittedStatement extends Statement {
        readonly kind: SyntaxKind.NotEmittedStatement;
    }
    /**
     * Marks the end of transformed declaration to properly emit exports.
     */
    export interface EndOfDeclarationMarker extends Statement {
        readonly kind: SyntaxKind.EndOfDeclarationMarker;
    }
    /**
     * A list of comma-separated expressions. This node is only created by transformations.
     */
    export interface CommaListExpression extends Expression {
        readonly kind: SyntaxKind.CommaListExpression;
        readonly elements: NodeArray<Expression>;
    }
    /**
     * Marks the beginning of a merged transformed declaration.
     */
    export interface MergeDeclarationMarker extends Statement {
        readonly kind: SyntaxKind.MergeDeclarationMarker;
    }
    export interface SyntheticReferenceExpression extends LeftHandSideExpression {
        readonly kind: SyntaxKind.SyntheticReferenceExpression;
        readonly expression: Expression;
        readonly thisArg: Expression;
    }
    export interface EmptyStatement extends Statement {
        readonly kind: SyntaxKind.EmptyStatement;
    }
    export interface DebuggerStatement extends Statement {
        readonly kind: SyntaxKind.DebuggerStatement;
    }
    export interface MissingDeclaration extends DeclarationStatement {
        decorators?: NodeArray<Decorator>;
        modifiers?: ModifiersArray;
        readonly kind: SyntaxKind.MissingDeclaration;
        readonly name?: Identifier;
    }
    export type BlockLike = SourceFile | Block | ModuleBlock | CaseOrDefaultClause;
    export interface Block extends Statement {
        readonly kind: SyntaxKind.Block;
        readonly statements: NodeArray<Statement>;
        multiLine?: boolean;
    }
    export interface VariableStatement extends Statement, JSDocContainer {
        decorators?: NodeArray<Decorator>;
        readonly kind: SyntaxKind.VariableStatement;
        readonly declarationList: VariableDeclarationList;
    }
    export interface ExpressionStatement extends Statement, JSDocContainer {
        readonly kind: SyntaxKind.ExpressionStatement;
        readonly expression: Expression;
    }
    export interface PrologueDirective extends ExpressionStatement {
        readonly expression: StringLiteral;
    }
    export interface IfStatement extends Statement {
        readonly kind: SyntaxKind.IfStatement;
        readonly expression: Expression;
        readonly thenStatement: Statement;
        readonly elseStatement?: Statement;
    }
    export interface IterationStatement extends Statement {
        readonly statement: Statement;
    }
    export interface DoStatement extends IterationStatement {
        readonly kind: SyntaxKind.DoStatement;
        readonly expression: Expression;
    }
    export interface WhileStatement extends IterationStatement {
        readonly kind: SyntaxKind.WhileStatement;
        readonly expression: Expression;
    }
    export type ForInitializer = VariableDeclarationList | Expression;
    export interface ForStatement extends IterationStatement {
        readonly kind: SyntaxKind.ForStatement;
        readonly initializer?: ForInitializer;
        readonly condition?: Expression;
        readonly incrementor?: Expression;
    }
    export type ForInOrOfStatement = ForInStatement | ForOfStatement;
    export interface ForInStatement extends IterationStatement {
        readonly kind: SyntaxKind.ForInStatement;
        readonly initializer: ForInitializer;
        readonly expression: Expression;
    }
    export interface ForOfStatement extends IterationStatement {
        readonly kind: SyntaxKind.ForOfStatement;
        readonly awaitModifier?: AwaitKeywordToken;
        readonly initializer: ForInitializer;
        readonly expression: Expression;
    }
    export interface BreakStatement extends Statement {
        readonly kind: SyntaxKind.BreakStatement;
        readonly label?: Identifier;
    }
    export interface ContinueStatement extends Statement {
        readonly kind: SyntaxKind.ContinueStatement;
        readonly label?: Identifier;
    }
    export type BreakOrContinueStatement = BreakStatement | ContinueStatement;
    export interface ReturnStatement extends Statement {
        readonly kind: SyntaxKind.ReturnStatement;
        readonly expression?: Expression;
    }
    export interface WithStatement extends Statement {
        readonly kind: SyntaxKind.WithStatement;
        readonly expression: Expression;
        readonly statement: Statement;
    }
    export interface SwitchStatement extends Statement {
        readonly kind: SyntaxKind.SwitchStatement;
        readonly expression: Expression;
        readonly caseBlock: CaseBlock;
        possiblyExhaustive?: boolean;
    }
    export interface CaseBlock extends Node {
        readonly kind: SyntaxKind.CaseBlock;
        readonly parent: SwitchStatement;
        readonly clauses: NodeArray<CaseOrDefaultClause>;
    }
    export interface CaseClause extends Node {
        readonly kind: SyntaxKind.CaseClause;
        readonly parent: CaseBlock;
        readonly expression: Expression;
        readonly statements: NodeArray<Statement>;
        fallthroughFlowNode?: FlowNode;
    }
    export interface DefaultClause extends Node {
        readonly kind: SyntaxKind.DefaultClause;
        readonly parent: CaseBlock;
        readonly statements: NodeArray<Statement>;
        fallthroughFlowNode?: FlowNode;
    }
    export type CaseOrDefaultClause = CaseClause | DefaultClause;
    export interface LabeledStatement extends Statement, JSDocContainer {
        readonly kind: SyntaxKind.LabeledStatement;
        readonly label: Identifier;
        readonly statement: Statement;
    }
    export interface ThrowStatement extends Statement {
        readonly kind: SyntaxKind.ThrowStatement;
        readonly expression: Expression;
    }
    export interface TryStatement extends Statement {
        readonly kind: SyntaxKind.TryStatement;
        readonly tryBlock: Block;
        readonly catchClause?: CatchClause;
        readonly finallyBlock?: Block;
    }
    export interface CatchClause extends Node {
        readonly kind: SyntaxKind.CatchClause;
        readonly parent: TryStatement;
        readonly variableDeclaration?: VariableDeclaration;
        readonly block: Block;
    }
    export type ObjectTypeDeclaration = ClassLikeDeclaration | InterfaceDeclaration | TypeLiteralNode;
    export type DeclarationWithTypeParameters = DeclarationWithTypeParameterChildren | JSDocTypedefTag | JSDocCallbackTag | JSDocSignature;
    export type DeclarationWithTypeParameterChildren = SignatureDeclaration | ClassLikeDeclaration | InterfaceDeclaration | TypeAliasDeclaration | JSDocTemplateTag;
    export interface ClassLikeDeclarationBase extends NamedDeclaration, JSDocContainer {
        readonly kind: SyntaxKind.ClassDeclaration | SyntaxKind.ClassExpression;
        readonly name?: Identifier;
        readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
        readonly heritageClauses?: NodeArray<HeritageClause>;
        readonly members: NodeArray<ClassElement>;
    }
    export interface ClassDeclaration extends ClassLikeDeclarationBase, DeclarationStatement {
        readonly kind: SyntaxKind.ClassDeclaration;
        /** May be undefined in `export default class { ... }`. */
        readonly name?: Identifier;
    }
    export interface ClassExpression extends ClassLikeDeclarationBase, PrimaryExpression {
        readonly kind: SyntaxKind.ClassExpression;
    }
    export type ClassLikeDeclaration = ClassDeclaration | ClassExpression;
    export interface ClassElement extends NamedDeclaration {
        _classElementBrand: any;
        readonly name?: PropertyName;
    }
    export interface TypeElement extends NamedDeclaration {
        _typeElementBrand: any;
        readonly name?: PropertyName;
        readonly questionToken?: QuestionToken;
    }
    export interface InterfaceDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.InterfaceDeclaration;
        readonly name: Identifier;
        readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
        readonly heritageClauses?: NodeArray<HeritageClause>;
        readonly members: NodeArray<TypeElement>;
    }
    export interface HeritageClause extends Node {
        readonly kind: SyntaxKind.HeritageClause;
        readonly parent: InterfaceDeclaration | ClassLikeDeclaration;
        readonly token: SyntaxKind.ExtendsKeyword | SyntaxKind.ImplementsKeyword;
        readonly types: NodeArray<ExpressionWithTypeArguments>;
    }
    export interface TypeAliasDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.TypeAliasDeclaration;
        readonly name: Identifier;
        readonly typeParameters?: NodeArray<TypeParameterDeclaration>;
        readonly type: TypeNode;
    }
    export interface EnumMember extends NamedDeclaration, JSDocContainer {
        readonly kind: SyntaxKind.EnumMember;
        readonly parent: EnumDeclaration;
        readonly name: PropertyName;
        readonly initializer?: Expression;
    }
    export interface EnumDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.EnumDeclaration;
        readonly name: Identifier;
        readonly members: NodeArray<EnumMember>;
    }
    export type ModuleName = Identifier | StringLiteral;
    export type ModuleBody = NamespaceBody | JSDocNamespaceBody;
    export interface AmbientModuleDeclaration extends ModuleDeclaration {
        readonly body?: ModuleBlock;
    }
    export interface ModuleDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.ModuleDeclaration;
        readonly parent: ModuleBody | SourceFile;
        readonly name: ModuleName;
        readonly body?: ModuleBody | JSDocNamespaceDeclaration;
    }
    export type NamespaceBody = ModuleBlock | NamespaceDeclaration;
    export interface NamespaceDeclaration extends ModuleDeclaration {
        readonly name: Identifier;
        readonly body: NamespaceBody;
    }
    export type JSDocNamespaceBody = Identifier | JSDocNamespaceDeclaration;
    export interface JSDocNamespaceDeclaration extends ModuleDeclaration {
        readonly name: Identifier;
        readonly body?: JSDocNamespaceBody;
    }
    export interface ModuleBlock extends Node, Statement {
        readonly kind: SyntaxKind.ModuleBlock;
        readonly parent: ModuleDeclaration;
        readonly statements: NodeArray<Statement>;
    }
    export type ModuleReference = EntityName | ExternalModuleReference;
    /**
     * One of:
     * - import x = require("mod");
     * - import x = M.x;
     */
    export interface ImportEqualsDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.ImportEqualsDeclaration;
        readonly parent: SourceFile | ModuleBlock;
        readonly name: Identifier;
        readonly isTypeOnly: boolean;
        readonly moduleReference: ModuleReference;
    }
    export interface ExternalModuleReference extends Node {
        readonly kind: SyntaxKind.ExternalModuleReference;
        readonly parent: ImportEqualsDeclaration;
        readonly expression: Expression;
    }
    export interface ImportDeclaration extends Statement, JSDocContainer {
        readonly kind: SyntaxKind.ImportDeclaration;
        readonly parent: SourceFile | ModuleBlock;
        readonly importClause?: ImportClause;
        /** If this is not a StringLiteral it will be a grammar error. */
        readonly moduleSpecifier: Expression;
    }
    export type NamedImportBindings = NamespaceImport | NamedImports;
    export type NamedExportBindings = NamespaceExport | NamedExports;
    export interface ImportClause extends NamedDeclaration {
        readonly kind: SyntaxKind.ImportClause;
        readonly parent: ImportDeclaration;
        readonly isTypeOnly: boolean;
        readonly name?: Identifier;
        readonly namedBindings?: NamedImportBindings;
    }
    export interface NamespaceImport extends NamedDeclaration {
        readonly kind: SyntaxKind.NamespaceImport;
        readonly parent: ImportClause;
        readonly name: Identifier;
    }
    export interface NamespaceExport extends NamedDeclaration {
        readonly kind: SyntaxKind.NamespaceExport;
        readonly parent: ExportDeclaration;
        readonly name: Identifier;
    }
    export interface NamespaceExportDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.NamespaceExportDeclaration;
        readonly name: Identifier;
        decorators?: NodeArray<Decorator>;
        modifiers?: ModifiersArray;
    }
    export interface ExportDeclaration extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.ExportDeclaration;
        readonly parent: SourceFile | ModuleBlock;
        readonly isTypeOnly: boolean;
        /** Will not be assigned in the case of `export * from "foo";` */
        readonly exportClause?: NamedExportBindings;
        /** If this is not a StringLiteral it will be a grammar error. */
        readonly moduleSpecifier?: Expression;
    }
    export interface NamedImports extends Node {
        readonly kind: SyntaxKind.NamedImports;
        readonly parent: ImportClause;
        readonly elements: NodeArray<ImportSpecifier>;
    }
    export interface NamedExports extends Node {
        readonly kind: SyntaxKind.NamedExports;
        readonly parent: ExportDeclaration;
        readonly elements: NodeArray<ExportSpecifier>;
    }
    export type NamedImportsOrExports = NamedImports | NamedExports;
    export interface ImportSpecifier extends NamedDeclaration {
        readonly kind: SyntaxKind.ImportSpecifier;
        readonly parent: NamedImports;
        readonly propertyName?: Identifier;
        readonly name: Identifier;
    }
    export interface ExportSpecifier extends NamedDeclaration {
        readonly kind: SyntaxKind.ExportSpecifier;
        readonly parent: NamedExports;
        readonly propertyName?: Identifier;
        readonly name: Identifier;
    }
    export type ImportOrExportSpecifier = ImportSpecifier | ExportSpecifier;
    export type TypeOnlyCompatibleAliasDeclaration = ImportClause | ImportEqualsDeclaration | NamespaceImport | ImportOrExportSpecifier;
    /**
     * This is either an `export =` or an `export default` declaration.
     * Unless `isExportEquals` is set, this node was parsed as an `export default`.
     */
    export interface ExportAssignment extends DeclarationStatement, JSDocContainer {
        readonly kind: SyntaxKind.ExportAssignment;
        readonly parent: SourceFile;
        readonly isExportEquals?: boolean;
        readonly expression: Expression;
    }
    export interface FileReference extends TextRange {
        fileName: string;
    }
    export interface CheckJsDirective extends TextRange {
        enabled: boolean;
    }
    export type CommentKind = SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia;
    export interface CommentRange extends TextRange {
        hasTrailingNewLine?: boolean;
        kind: CommentKind;
    }
    export interface SynthesizedComment extends CommentRange {
        text: string;
        pos: -1;
        end: -1;
        hasLeadingNewline?: boolean;
    }
    export interface JSDocTypeExpression extends TypeNode {
        readonly kind: SyntaxKind.JSDocTypeExpression;
        readonly type: TypeNode;
    }
    export interface JSDocNameReference extends Node {
        readonly kind: SyntaxKind.JSDocNameReference;
        readonly name: EntityName;
    }
    export interface JSDocType extends TypeNode {
        _jsDocTypeBrand: any;
    }
    export interface JSDocAllType extends JSDocType {
        readonly kind: SyntaxKind.JSDocAllType;
    }
    export interface JSDocUnknownType extends JSDocType {
        readonly kind: SyntaxKind.JSDocUnknownType;
    }
    export interface JSDocNonNullableType extends JSDocType {
        readonly kind: SyntaxKind.JSDocNonNullableType;
        readonly type: TypeNode;
    }
    export interface JSDocNullableType extends JSDocType {
        readonly kind: SyntaxKind.JSDocNullableType;
        readonly type: TypeNode;
    }
    export interface JSDocOptionalType extends JSDocType {
        readonly kind: SyntaxKind.JSDocOptionalType;
        readonly type: TypeNode;
    }
    export interface JSDocFunctionType extends JSDocType, SignatureDeclarationBase {
        readonly kind: SyntaxKind.JSDocFunctionType;
    }
    export interface JSDocVariadicType extends JSDocType {
        readonly kind: SyntaxKind.JSDocVariadicType;
        readonly type: TypeNode;
    }
    export interface JSDocNamepathType extends JSDocType {
        readonly kind: SyntaxKind.JSDocNamepathType;
        readonly type: TypeNode;
    }
    export type JSDocTypeReferencingNode = JSDocVariadicType | JSDocOptionalType | JSDocNullableType | JSDocNonNullableType;
    export interface JSDoc extends Node {
        readonly kind: SyntaxKind.JSDocComment;
        readonly parent: HasJSDoc;
        readonly tags?: NodeArray<JSDocTag>;
        readonly comment?: string;
    }
    export interface JSDocTag extends Node {
        readonly parent: JSDoc | JSDocTypeLiteral;
        readonly tagName: Identifier;
        readonly comment?: string;
    }
    export interface JSDocUnknownTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocTag;
    }
    /**
     * Note that `@extends` is a synonym of `@augments`.
     * Both tags are represented by this interface.
     */
    export interface JSDocAugmentsTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocAugmentsTag;
        readonly class: ExpressionWithTypeArguments & {
            readonly expression: Identifier | PropertyAccessEntityNameExpression;
        };
    }
    export interface JSDocImplementsTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocImplementsTag;
        readonly class: ExpressionWithTypeArguments & {
            readonly expression: Identifier | PropertyAccessEntityNameExpression;
        };
    }
    export interface JSDocAuthorTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocAuthorTag;
    }
    export interface JSDocDeprecatedTag extends JSDocTag {
        kind: SyntaxKind.JSDocDeprecatedTag;
    }
    export interface JSDocClassTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocClassTag;
    }
    export interface JSDocPublicTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocPublicTag;
    }
    export interface JSDocPrivateTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocPrivateTag;
    }
    export interface JSDocProtectedTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocProtectedTag;
    }
    export interface JSDocReadonlyTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocReadonlyTag;
    }
    export interface JSDocEnumTag extends JSDocTag, Declaration {
        readonly kind: SyntaxKind.JSDocEnumTag;
        readonly parent: JSDoc;
        readonly typeExpression: JSDocTypeExpression;
    }
    export interface JSDocThisTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocThisTag;
        readonly typeExpression: JSDocTypeExpression;
    }
    export interface JSDocTemplateTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocTemplateTag;
        readonly constraint: JSDocTypeExpression | undefined;
        readonly typeParameters: NodeArray<TypeParameterDeclaration>;
    }
    export interface JSDocSeeTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocSeeTag;
        readonly name?: JSDocNameReference;
    }
    export interface JSDocReturnTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocReturnTag;
        readonly typeExpression?: JSDocTypeExpression;
    }
    export interface JSDocTypeTag extends JSDocTag {
        readonly kind: SyntaxKind.JSDocTypeTag;
        readonly typeExpression: JSDocTypeExpression;
    }
    export interface JSDocTypedefTag extends JSDocTag, NamedDeclaration {
        readonly kind: SyntaxKind.JSDocTypedefTag;
        readonly parent: JSDoc;
        readonly fullName?: JSDocNamespaceDeclaration | Identifier;
        readonly name?: Identifier;
        readonly typeExpression?: JSDocTypeExpression | JSDocTypeLiteral;
    }
    export interface JSDocCallbackTag extends JSDocTag, NamedDeclaration {
        readonly kind: SyntaxKind.JSDocCallbackTag;
        readonly parent: JSDoc;
        readonly fullName?: JSDocNamespaceDeclaration | Identifier;
        readonly name?: Identifier;
        readonly typeExpression: JSDocSignature;
    }
    export interface JSDocSignature extends JSDocType, Declaration {
        readonly kind: SyntaxKind.JSDocSignature;
        readonly typeParameters?: readonly JSDocTemplateTag[];
        readonly parameters: readonly JSDocParameterTag[];
        readonly type: JSDocReturnTag | undefined;
    }
    export interface JSDocPropertyLikeTag extends JSDocTag, Declaration {
        readonly parent: JSDoc;
        readonly name: EntityName;
        readonly typeExpression?: JSDocTypeExpression;
        /** Whether the property name came before the type -- non-standard for JSDoc, but Typescript-like */
        readonly isNameFirst: boolean;
        readonly isBracketed: boolean;
    }
    export interface JSDocPropertyTag extends JSDocPropertyLikeTag {
        readonly kind: SyntaxKind.JSDocPropertyTag;
    }
    export interface JSDocParameterTag extends JSDocPropertyLikeTag {
        readonly kind: SyntaxKind.JSDocParameterTag;
    }
    export interface JSDocTypeLiteral extends JSDocType {
        readonly kind: SyntaxKind.JSDocTypeLiteral;
        readonly jsDocPropertyTags?: readonly JSDocPropertyLikeTag[];
        /** If true, then this type literal represents an *array* of its type. */
        readonly isArrayType: boolean;
    }
    export const enum FlowFlags {
        Unreachable = 1,
        Start = 2,
        BranchLabel = 4,
        LoopLabel = 8,
        Assignment = 16,
        TrueCondition = 32,
        FalseCondition = 64,
        SwitchClause = 128,
        ArrayMutation = 256,
        Call = 512,
        ReduceLabel = 1024,
        Referenced = 2048,
        Shared = 4096,
        Label = 12,
        Condition = 96
    }
    export type FlowNode = FlowStart | FlowLabel | FlowAssignment | FlowCall | FlowCondition | FlowSwitchClause | FlowArrayMutation | FlowCall | FlowReduceLabel;
    export interface FlowNodeBase {
        flags: FlowFlags;
        id?: number;
    }
    export interface FlowStart extends FlowNodeBase {
        node?: FunctionExpression | ArrowFunction | MethodDeclaration;
    }
    export interface FlowLabel extends FlowNodeBase {
        antecedents: FlowNode[] | undefined;
    }
    export interface FlowAssignment extends FlowNodeBase {
        node: Expression | VariableDeclaration | BindingElement;
        antecedent: FlowNode;
    }
    export interface FlowCall extends FlowNodeBase {
        node: CallExpression;
        antecedent: FlowNode;
    }
    export interface FlowCondition extends FlowNodeBase {
        node: Expression;
        antecedent: FlowNode;
    }
    export interface FlowSwitchClause extends FlowNodeBase {
        switchStatement: SwitchStatement;
        clauseStart: number;
        clauseEnd: number;
        antecedent: FlowNode;
    }
    export interface FlowArrayMutation extends FlowNodeBase {
        node: CallExpression | BinaryExpression;
        antecedent: FlowNode;
    }
    export interface FlowReduceLabel extends FlowNodeBase {
        target: FlowLabel;
        antecedents: FlowNode[];
        antecedent: FlowNode;
    }
    export type FlowType = Type | IncompleteType;
    export interface IncompleteType {
        flags: TypeFlags;
        type: Type;
    }
    export interface AmdDependency {
        path: string;
        name?: string;
    }
    /**
     * Subset of properties from SourceFile that are used in multiple utility functions
     */
    export interface SourceFileLike {
        readonly text: string;
        lineMap?: readonly number[];
        getPositionOfLineAndCharacter?(line: number, character: number, allowEdits?: true): number;
    }
    export interface RedirectInfo {
        /** Source file this redirects to. */
        readonly redirectTarget: SourceFile;
        /**
         * Source file for the duplicate package. This will not be used by the Program,
         * but we need to keep this around so we can watch for changes in underlying.
         */
        readonly unredirected: SourceFile;
    }
    export interface SourceFile extends Declaration {
        readonly kind: SyntaxKind.SourceFile;
        readonly statements: NodeArray<Statement>;
        readonly endOfFileToken: Token<SyntaxKind.EndOfFileToken>;
        fileName: string;
        path: Path;
        text: string;
        /** Resolved path can be different from path property,
         * when file is included through project reference is mapped to its output instead of source
         * in that case resolvedPath = path to output file
         * path = input file's path
         */
        resolvedPath: Path;
        /** Original file name that can be different from fileName,
         * when file is included through project reference is mapped to its output instead of source
         * in that case originalFileName = name of input file
         * fileName = output file's name
         */
        originalFileName: string;
        /**
         * If two source files are for the same version of the same package, one will redirect to the other.
         * (See `createRedirectSourceFile` in program.ts.)
         * The redirect will have this set. The redirected-to source file will be in `redirectTargetsMap`.
         */
        redirectInfo?: RedirectInfo;
        amdDependencies: readonly AmdDependency[];
        moduleName?: string;
        referencedFiles: readonly FileReference[];
        typeReferenceDirectives: readonly FileReference[];
        libReferenceDirectives: readonly FileReference[];
        languageVariant: LanguageVariant;
        isDeclarationFile: boolean;
        renamedDependencies?: ReadonlyESMap<string, string>;
        /**
         * lib.d.ts should have a reference comment like
         *
         *  /// <reference no-default-lib="true"/>
         *
         * If any other file has this comment, it signals not to include lib.d.ts
         * because this containing file is intended to act as a default library.
         */
        hasNoDefaultLib: boolean;
        languageVersion: ScriptTarget;
        scriptKind: ScriptKind;
        /**
         * The first "most obvious" node that makes a file an external module.
         * This is intended to be the first top-level import/export,
         * but could be arbitrarily nested (e.g. `import.meta`).
         */
        externalModuleIndicator?: Node;
        commonJsModuleIndicator?: Node;
        jsGlobalAugmentations?: SymbolTable;
        identifiers: ESMap<string, string>;
        nodeCount: number;
        identifierCount: number;
        symbolCount: number;
        parseDiagnostics: DiagnosticWithLocation[];
        bindDiagnostics: DiagnosticWithLocation[];
        bindSuggestionDiagnostics?: DiagnosticWithLocation[];
        jsDocDiagnostics?: DiagnosticWithLocation[];
        additionalSyntacticDiagnostics?: readonly DiagnosticWithLocation[];
        lineMap: readonly number[];
        classifiableNames?: ReadonlySet<__String>;
        commentDirectives?: CommentDirective[];
        resolvedModules?: ESMap<string, ResolvedModuleFull | undefined>;
        resolvedTypeReferenceDirectiveNames: ESMap<string, ResolvedTypeReferenceDirective | undefined>;
        imports: readonly StringLiteralLike[];
        moduleAugmentations: readonly (StringLiteral | Identifier)[];
        patternAmbientModules?: PatternAmbientModule[];
        ambientModuleNames: readonly string[];
        checkJsDirective?: CheckJsDirective;
        version: string;
        pragmas: ReadonlyPragmaMap;
        localJsxNamespace?: __String;
        localJsxFragmentNamespace?: __String;
        localJsxFactory?: EntityName;
        localJsxFragmentFactory?: EntityName;
        exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
    }
    export interface CommentDirective {
        range: TextRange;
        type: CommentDirectiveType;
    }
    export const enum CommentDirectiveType {
        ExpectError = 0,
        Ignore = 1
    }
    export type ExportedModulesFromDeclarationEmit = readonly Symbol[];
    export interface Bundle extends Node {
        readonly kind: SyntaxKind.Bundle;
        readonly prepends: readonly (InputFiles | UnparsedSource)[];
        readonly sourceFiles: readonly SourceFile[];
        syntheticFileReferences?: readonly FileReference[];
        syntheticTypeReferences?: readonly FileReference[];
        syntheticLibReferences?: readonly FileReference[];
        hasNoDefaultLib?: boolean;
    }
    export interface InputFiles extends Node {
        readonly kind: SyntaxKind.InputFiles;
        javascriptPath?: string;
        javascriptText: string;
        javascriptMapPath?: string;
        javascriptMapText?: string;
        declarationPath?: string;
        declarationText: string;
        declarationMapPath?: string;
        declarationMapText?: string;
        buildInfoPath?: string;
        buildInfo?: BuildInfo;
        oldFileOfCurrentEmit?: boolean;
    }
    export interface UnparsedSource extends Node {
        readonly kind: SyntaxKind.UnparsedSource;
        fileName: string;
        text: string;
        readonly prologues: readonly UnparsedPrologue[];
        helpers: readonly UnscopedEmitHelper[] | undefined;
        referencedFiles: readonly FileReference[];
        typeReferenceDirectives: readonly string[] | undefined;
        libReferenceDirectives: readonly FileReference[];
        hasNoDefaultLib?: boolean;
        sourceMapPath?: string;
        sourceMapText?: string;
        readonly syntheticReferences?: readonly UnparsedSyntheticReference[];
        readonly texts: readonly UnparsedSourceText[];
        oldFileOfCurrentEmit?: boolean;
        parsedSourceMap?: RawSourceMap | false | undefined;
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
    }
    export type UnparsedSourceText = UnparsedPrepend | UnparsedTextLike;
    export type UnparsedNode = UnparsedPrologue | UnparsedSourceText | UnparsedSyntheticReference;
    export interface UnparsedSection extends Node {
        readonly kind: SyntaxKind;
        readonly parent: UnparsedSource;
        readonly data?: string;
    }
    export interface UnparsedPrologue extends UnparsedSection {
        readonly kind: SyntaxKind.UnparsedPrologue;
        readonly parent: UnparsedSource;
        readonly data: string;
    }
    export interface UnparsedPrepend extends UnparsedSection {
        readonly kind: SyntaxKind.UnparsedPrepend;
        readonly parent: UnparsedSource;
        readonly data: string;
        readonly texts: readonly UnparsedTextLike[];
    }
    export interface UnparsedTextLike extends UnparsedSection {
        readonly kind: SyntaxKind.UnparsedText | SyntaxKind.UnparsedInternalText;
        readonly parent: UnparsedSource;
    }
    export interface UnparsedSyntheticReference extends UnparsedSection {
        readonly kind: SyntaxKind.UnparsedSyntheticReference;
        readonly parent: UnparsedSource;
        readonly section: BundleFileHasNoDefaultLib | BundleFileReference;
    }
    export interface JsonSourceFile extends SourceFile {
        readonly statements: NodeArray<JsonObjectExpressionStatement>;
    }
    export interface TsConfigSourceFile extends JsonSourceFile {
        extendedSourceFiles?: string[];
        configFileSpecs?: ConfigFileSpecs;
    }
    export interface JsonMinusNumericLiteral extends PrefixUnaryExpression {
        readonly kind: SyntaxKind.PrefixUnaryExpression;
        readonly operator: SyntaxKind.MinusToken;
        readonly operand: NumericLiteral;
    }
    export type JsonObjectExpression = ObjectLiteralExpression | ArrayLiteralExpression | JsonMinusNumericLiteral | NumericLiteral | StringLiteral | BooleanLiteral | NullLiteral;
    export interface JsonObjectExpressionStatement extends ExpressionStatement {
        readonly expression: JsonObjectExpression;
    }
    export interface ScriptReferenceHost {
        getCompilerOptions(): CompilerOptions;
        getSourceFile(fileName: string): SourceFile | undefined;
        getSourceFileByPath(path: Path): SourceFile | undefined;
        getCurrentDirectory(): string;
    }
    export interface ParseConfigHost {
        useCaseSensitiveFileNames: boolean;
        readDirectory(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[], depth?: number): readonly string[];
        /**
         * Gets a value indicating whether the specified path exists and is a file.
         * @param path The path to test.
         */
        fileExists(path: string): boolean;
        readFile(path: string): string | undefined;
        trace?(s: string): void;
    }
    /**
     * Branded string for keeping track of when we've turned an ambiguous path
     * specified like "./blah" to an absolute path to an actual
     * tsconfig file, e.g. "/root/blah/tsconfig.json"
     */
    export type ResolvedConfigFileName = string & {
        _isResolvedConfigFileName: never;
    };
    export type WriteFileCallback = (fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly SourceFile[]) => void;
    export class OperationCanceledException {
    }
    export interface CancellationToken {
        isCancellationRequested(): boolean;
        /** @throws OperationCanceledException if isCancellationRequested is true */
        throwIfCancellationRequested(): void;
    }
    export enum FileIncludeKind {
        RootFile = 0,
        SourceFromProjectReference = 1,
        OutputFromProjectReference = 2,
        Import = 3,
        ReferenceFile = 4,
        TypeReferenceDirective = 5,
        LibFile = 6,
        LibReferenceDirective = 7,
        AutomaticTypeDirectiveFile = 8
    }
    export interface RootFile {
        kind: FileIncludeKind.RootFile;
        index: number;
    }
    export interface LibFile {
        kind: FileIncludeKind.LibFile;
        index?: number;
    }
    export type ProjectReferenceFileKind = FileIncludeKind.SourceFromProjectReference | FileIncludeKind.OutputFromProjectReference;
    export interface ProjectReferenceFile {
        kind: ProjectReferenceFileKind;
        index: number;
    }
    export type ReferencedFileKind = FileIncludeKind.Import | FileIncludeKind.ReferenceFile | FileIncludeKind.TypeReferenceDirective | FileIncludeKind.LibReferenceDirective;
    export interface ReferencedFile {
        kind: ReferencedFileKind;
        file: Path;
        index: number;
    }
    export interface AutomaticTypeDirectiveFile {
        kind: FileIncludeKind.AutomaticTypeDirectiveFile;
        typeReference: string;
        packageId: PackageId | undefined;
    }
    export type FileIncludeReason = RootFile | LibFile | ProjectReferenceFile | ReferencedFile | AutomaticTypeDirectiveFile;
    export const enum FilePreprocessingDiagnosticsKind {
        FilePreprocessingReferencedDiagnostic = 0,
        FilePreprocessingFileExplainingDiagnostic = 1
    }
    export interface FilePreprocessingReferencedDiagnostic {
        kind: FilePreprocessingDiagnosticsKind.FilePreprocessingReferencedDiagnostic;
        reason: ReferencedFile;
        diagnostic: DiagnosticMessage;
        args?: (string | number | undefined)[];
    }
    export interface FilePreprocessingFileExplainingDiagnostic {
        kind: FilePreprocessingDiagnosticsKind.FilePreprocessingFileExplainingDiagnostic;
        file?: Path;
        fileProcessingReason: FileIncludeReason;
        diagnostic: DiagnosticMessage;
        args?: (string | number | undefined)[];
    }
    export type FilePreprocessingDiagnostics = FilePreprocessingReferencedDiagnostic | FilePreprocessingFileExplainingDiagnostic;
    export interface Program extends ScriptReferenceHost {
        getCurrentDirectory(): string;
        /**
         * Get a list of root file names that were passed to a 'createProgram'
         */
        getRootFileNames(): readonly string[];
        /**
         * Get a list of files in the program
         */
        getSourceFiles(): readonly SourceFile[];
        /**
         * Get a list of file names that were passed to 'createProgram' or referenced in a
         * program source file but could not be located.
         */
        getMissingFilePaths(): readonly Path[];
        getFilesByNameMap(): ESMap<string, SourceFile | false | undefined>;
        /**
         * Emits the JavaScript and declaration files.  If targetSourceFile is not specified, then
         * the JavaScript and declaration files will be produced for all the files in this program.
         * If targetSourceFile is specified, then only the JavaScript and declaration for that
         * specific file will be generated.
         *
         * If writeFile is not specified then the writeFile callback from the compiler host will be
         * used for writing the JavaScript and declaration files.  Otherwise, the writeFile parameter
         * will be invoked when writing the JavaScript and declaration files.
         */
        emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
        emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers, forceDtsEmit?: boolean): EmitResult;
        getOptionsDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        getGlobalDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly DiagnosticWithLocation[];
        /** The first time this is called, it will return global diagnostics (no location). */
        getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        getDeclarationDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly DiagnosticWithLocation[];
        getConfigFileParsingDiagnostics(): readonly Diagnostic[];
        getSuggestionDiagnostics(sourceFile: SourceFile, cancellationToken?: CancellationToken): readonly DiagnosticWithLocation[];
        getBindAndCheckDiagnostics(sourceFile: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        getProgramDiagnostics(sourceFile: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        /**
         * Gets a type checker that can be used to semantically analyze source files in the program.
         */
        getTypeChecker(): TypeChecker;
        getCommonSourceDirectory(): string;
        getDiagnosticsProducingTypeChecker(): TypeChecker;
        dropDiagnosticsProducingTypeChecker(): void;
        getCachedSemanticDiagnostics(sourceFile?: SourceFile): readonly Diagnostic[] | undefined;
        getClassifiableNames(): Set<__String>;
        getTypeCatalog(): readonly Type[];
        getNodeCount(): number;
        getIdentifierCount(): number;
        getSymbolCount(): number;
        getTypeCount(): number;
        getInstantiationCount(): number;
        getRelationCacheSizes(): {
            assignable: number;
            identity: number;
            subtype: number;
            strictSubtype: number;
        };
        getFileProcessingDiagnostics(): FilePreprocessingDiagnostics[] | undefined;
        getResolvedTypeReferenceDirectives(): ESMap<string, ResolvedTypeReferenceDirective | undefined>;
        isSourceFileFromExternalLibrary(file: SourceFile): boolean;
        isSourceFileDefaultLibrary(file: SourceFile): boolean;
        readonly structureIsReused: StructureIsReused;
        getSourceFileFromReference(referencingFile: SourceFile | UnparsedSource, ref: FileReference): SourceFile | undefined;
        getLibFileFromReference(ref: FileReference): SourceFile | undefined;
        /** Given a source file, get the name of the package it was imported from. */
        sourceFileToPackageName: ESMap<string, string>;
        /** Set of all source files that some other source file redirects to. */
        redirectTargetsMap: MultiMap<string, string>;
        /** Is the file emitted file */
        isEmittedFile(file: string): boolean;
        getFileIncludeReasons(): MultiMap<Path, FileIncludeReason>;
        useCaseSensitiveFileNames(): boolean;
        getResolvedModuleWithFailedLookupLocationsFromCache(moduleName: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
        getProjectReferences(): readonly ProjectReference[] | undefined;
        getResolvedProjectReferences(): readonly (ResolvedProjectReference | undefined)[] | undefined;
        getProjectReferenceRedirect(fileName: string): string | undefined;
        getResolvedProjectReferenceToRedirect(fileName: string): ResolvedProjectReference | undefined;
        forEachResolvedProjectReference<T>(cb: (resolvedProjectReference: ResolvedProjectReference) => T | undefined): T | undefined;
        getResolvedProjectReferenceByPath(projectReferencePath: Path): ResolvedProjectReference | undefined;
        isSourceOfProjectReferenceRedirect(fileName: string): boolean;
        getProgramBuildInfo?(): ProgramBuildInfo | undefined;
        emitBuildInfo(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken): EmitResult;
        /**
         * This implementation handles file exists to be true if file is source of project reference redirect when program is created using useSourceOfProjectReferenceRedirect
         */
        fileExists(fileName: string): boolean;
    }
    export interface Program extends TypeCheckerHost, ModuleSpecifierResolutionHost {
    }
    export type RedirectTargetsMap = ReadonlyESMap<string, readonly string[]>;
    export interface ResolvedProjectReference {
        commandLine: ParsedCommandLine;
        sourceFile: SourceFile;
        references?: readonly (ResolvedProjectReference | undefined)[];
    }
    export const enum StructureIsReused {
        Not = 0,
        SafeModules = 1,
        Completely = 2
    }
    export type CustomTransformerFactory = (context: TransformationContext) => CustomTransformer;
    export interface CustomTransformer {
        transformSourceFile(node: SourceFile): SourceFile;
        transformBundle(node: Bundle): Bundle;
    }
    export interface CustomTransformers {
        /** Custom transformers to evaluate before built-in .js transformations. */
        before?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
        /** Custom transformers to evaluate after built-in .js transformations. */
        after?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
        /** Custom transformers to evaluate after built-in .d.ts transformations. */
        afterDeclarations?: (TransformerFactory<Bundle | SourceFile> | CustomTransformerFactory)[];
    }
    export interface EmitTransformers {
        scriptTransformers: readonly TransformerFactory<SourceFile | Bundle>[];
        declarationTransformers: readonly TransformerFactory<SourceFile | Bundle>[];
    }
    export interface SourceMapSpan {
        /** Line number in the .js file. */
        emittedLine: number;
        /** Column number in the .js file. */
        emittedColumn: number;
        /** Line number in the .ts file. */
        sourceLine: number;
        /** Column number in the .ts file. */
        sourceColumn: number;
        /** Optional name (index into names array) associated with this span. */
        nameIndex?: number;
        /** .ts file (index into sources array) associated with this span */
        sourceIndex: number;
    }
    export interface SourceMapEmitResult {
        inputSourceFileNames: readonly string[];
        sourceMap: RawSourceMap;
    }
    /** Return code used by getEmitOutput function to indicate status of the function */
    export enum ExitStatus {
        Success = 0,
        DiagnosticsPresent_OutputsSkipped = 1,
        DiagnosticsPresent_OutputsGenerated = 2,
        InvalidProject_OutputsSkipped = 3,
        ProjectReferenceCycle_OutputsSkipped = 4,
        /** @deprecated Use ProjectReferenceCycle_OutputsSkipped instead. */
        ProjectReferenceCycle_OutputsSkupped = 4
    }
    export interface EmitResult {
        emitSkipped: boolean;
        /** Contains declaration emit diagnostics */
        diagnostics: readonly Diagnostic[];
        emittedFiles?: string[];
        sourceMaps?: SourceMapEmitResult[];
        exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
    }
    export interface TypeCheckerHost extends ModuleSpecifierResolutionHost {
        getCompilerOptions(): CompilerOptions;
        getSourceFiles(): readonly SourceFile[];
        getSourceFile(fileName: string): SourceFile | undefined;
        getResolvedTypeReferenceDirectives(): ReadonlyESMap<string, ResolvedTypeReferenceDirective | undefined>;
        getProjectReferenceRedirect(fileName: string): string | undefined;
        isSourceOfProjectReferenceRedirect(fileName: string): boolean;
        readonly redirectTargetsMap: RedirectTargetsMap;
    }
    export interface TypeChecker {
        getTypeOfSymbolAtLocation(symbol: Symbol, node: Node): Type;
        getDeclaredTypeOfSymbol(symbol: Symbol): Type;
        getPropertiesOfType(type: Type): Symbol[];
        getPropertyOfType(type: Type, propertyName: string): Symbol | undefined;
        getPrivateIdentifierPropertyOfType(leftType: Type, name: string, location: Node): Symbol | undefined;
        getTypeOfPropertyOfType(type: Type, propertyName: string): Type | undefined;
        getIndexInfoOfType(type: Type, kind: IndexKind): IndexInfo | undefined;
        getSignaturesOfType(type: Type, kind: SignatureKind): readonly Signature[];
        getIndexTypeOfType(type: Type, kind: IndexKind): Type | undefined;
        getBaseTypes(type: InterfaceType): BaseType[];
        getBaseTypeOfLiteralType(type: Type): Type;
        getWidenedType(type: Type): Type;
        getPromisedTypeOfPromise(promise: Type, errorNode?: Node): Type | undefined;
        getAwaitedType(type: Type): Type | undefined;
        getReturnTypeOfSignature(signature: Signature): Type;
        /**
         * Gets the type of a parameter at a given position in a signature.
         * Returns `any` if the index is not valid.
         */
        getParameterType(signature: Signature, parameterIndex: number): Type;
        getNullableType(type: Type, flags: TypeFlags): Type;
        getNonNullableType(type: Type): Type;
        getNonOptionalType(type: Type): Type;
        isNullableType(type: Type): boolean;
        getTypeArguments(type: TypeReference): readonly Type[];
        /** Note that the resulting nodes cannot be checked. */
        typeToTypeNode(type: Type, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): TypeNode | undefined;
        typeToTypeNode(type: Type, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined, tracker?: SymbolTracker): TypeNode | undefined;
        /** Note that the resulting nodes cannot be checked. */
        signatureToSignatureDeclaration(signature: Signature, kind: SyntaxKind, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): SignatureDeclaration & {
            typeArguments?: NodeArray<TypeNode>;
        } | undefined;
        signatureToSignatureDeclaration(signature: Signature, kind: SyntaxKind, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined, tracker?: SymbolTracker): SignatureDeclaration & {
            typeArguments?: NodeArray<TypeNode>;
        } | undefined;
        /** Note that the resulting nodes cannot be checked. */
        indexInfoToIndexSignatureDeclaration(indexInfo: IndexInfo, kind: IndexKind, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): IndexSignatureDeclaration | undefined;
        indexInfoToIndexSignatureDeclaration(indexInfo: IndexInfo, kind: IndexKind, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined, tracker?: SymbolTracker): IndexSignatureDeclaration | undefined;
        /** Note that the resulting nodes cannot be checked. */
        symbolToEntityName(symbol: Symbol, meaning: SymbolFlags, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): EntityName | undefined;
        /** Note that the resulting nodes cannot be checked. */
        symbolToExpression(symbol: Symbol, meaning: SymbolFlags, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): Expression | undefined;
        /** Note that the resulting nodes cannot be checked. */
        symbolToTypeParameterDeclarations(symbol: Symbol, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): NodeArray<TypeParameterDeclaration> | undefined;
        /** Note that the resulting nodes cannot be checked. */
        symbolToParameterDeclaration(symbol: Symbol, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): ParameterDeclaration | undefined;
        /** Note that the resulting nodes cannot be checked. */
        typeParameterToDeclaration(parameter: TypeParameter, enclosingDeclaration: Node | undefined, flags: NodeBuilderFlags | undefined): TypeParameterDeclaration | undefined;
        getSymbolsInScope(location: Node, meaning: SymbolFlags): Symbol[];
        getSymbolAtLocation(node: Node): Symbol | undefined;
        getSymbolsOfParameterPropertyDeclaration(parameter: ParameterDeclaration, parameterName: string): Symbol[];
        /**
         * The function returns the value (local variable) symbol of an identifier in the short-hand property assignment.
         * This is necessary as an identifier in short-hand property assignment can contains two meaning: property name and property value.
         */
        getShorthandAssignmentValueSymbol(location: Node): Symbol | undefined;
        getExportSpecifierLocalTargetSymbol(location: ExportSpecifier | Identifier): Symbol | undefined;
        /**
         * If a symbol is a local symbol with an associated exported symbol, returns the exported symbol.
         * Otherwise returns its input.
         * For example, at `export type T = number;`:
         *     - `getSymbolAtLocation` at the location `T` will return the exported symbol for `T`.
         *     - But the result of `getSymbolsInScope` will contain the *local* symbol for `T`, not the exported symbol.
         *     - Calling `getExportSymbolOfSymbol` on that local symbol will return the exported symbol.
         */
        getExportSymbolOfSymbol(symbol: Symbol): Symbol;
        getPropertySymbolOfDestructuringAssignment(location: Identifier): Symbol | undefined;
        getTypeOfAssignmentPattern(pattern: AssignmentPattern): Type;
        getTypeAtLocation(node: Node): Type;
        getTypeFromTypeNode(node: TypeNode): Type;
        signatureToString(signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags, kind?: SignatureKind): string;
        typeToString(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags): string;
        symbolToString(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags): string;
        typePredicateToString(predicate: TypePredicate, enclosingDeclaration?: Node, flags?: TypeFormatFlags): string;
        writeSignature(signature: Signature, enclosingDeclaration?: Node, flags?: TypeFormatFlags, kind?: SignatureKind, writer?: EmitTextWriter): string;
        writeType(type: Type, enclosingDeclaration?: Node, flags?: TypeFormatFlags, writer?: EmitTextWriter): string;
        writeSymbol(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags, flags?: SymbolFormatFlags, writer?: EmitTextWriter): string;
        writeTypePredicate(predicate: TypePredicate, enclosingDeclaration?: Node, flags?: TypeFormatFlags, writer?: EmitTextWriter): string;
        getFullyQualifiedName(symbol: Symbol): string;
        getAugmentedPropertiesOfType(type: Type): Symbol[];
        getRootSymbols(symbol: Symbol): readonly Symbol[];
        getSymbolOfExpando(node: Node, allowDeclaration: boolean): Symbol | undefined;
        getContextualType(node: Expression): Type | undefined;
        getContextualType(node: Expression, contextFlags?: ContextFlags): Type | undefined;
        getContextualTypeForObjectLiteralElement(element: ObjectLiteralElementLike): Type | undefined;
        getContextualTypeForArgumentAtIndex(call: CallLikeExpression, argIndex: number): Type | undefined;
        getContextualTypeForJsxAttribute(attribute: JsxAttribute | JsxSpreadAttribute): Type | undefined;
        isContextSensitive(node: Expression | MethodDeclaration | ObjectLiteralElementLike | JsxAttributeLike): boolean;
        /**
         * returns unknownSignature in the case of an error.
         * returns undefined if the node is not valid.
         * @param argumentCount Apparent number of arguments, passed in case of a possibly incomplete call. This should come from an ArgumentListInfo. See `signatureHelp.ts`.
         */
        getResolvedSignature(node: CallLikeExpression, candidatesOutArray?: Signature[], argumentCount?: number): Signature | undefined;
        getResolvedSignatureForSignatureHelp(node: CallLikeExpression, candidatesOutArray?: Signature[], argumentCount?: number): Signature | undefined;
        getExpandedParameters(sig: Signature): readonly (readonly Symbol[])[];
        hasEffectiveRestParameter(sig: Signature): boolean;
        getSignatureFromDeclaration(declaration: SignatureDeclaration): Signature | undefined;
        isImplementationOfOverload(node: SignatureDeclaration): boolean | undefined;
        isUndefinedSymbol(symbol: Symbol): boolean;
        isArgumentsSymbol(symbol: Symbol): boolean;
        isUnknownSymbol(symbol: Symbol): boolean;
        getMergedSymbol(symbol: Symbol): Symbol;
        getConstantValue(node: EnumMember | PropertyAccessExpression | ElementAccessExpression): string | number | undefined;
        isValidPropertyAccess(node: PropertyAccessExpression | QualifiedName | ImportTypeNode, propertyName: string): boolean;
        /** Exclude accesses to private properties or methods with a `this` parameter that `type` doesn't satisfy. */
        isValidPropertyAccessForCompletions(node: PropertyAccessExpression | ImportTypeNode | QualifiedName, type: Type, property: Symbol): boolean;
        /** Follow all aliases to get the original symbol. */
        getAliasedSymbol(symbol: Symbol): Symbol;
        /** Follow a *single* alias to get the immediately aliased symbol. */
        getImmediateAliasedSymbol(symbol: Symbol): Symbol | undefined;
        getExportsOfModule(moduleSymbol: Symbol): Symbol[];
        /** Unlike `getExportsOfModule`, this includes properties of an `export =` value. */
        getExportsAndPropertiesOfModule(moduleSymbol: Symbol): Symbol[];
        getJsxIntrinsicTagNamesAt(location: Node): Symbol[];
        isOptionalParameter(node: ParameterDeclaration): boolean;
        getAmbientModules(): Symbol[];
        tryGetMemberInModuleExports(memberName: string, moduleSymbol: Symbol): Symbol | undefined;
        /**
         * Unlike `tryGetMemberInModuleExports`, this includes properties of an `export =` value.
         * Does *not* return properties of primitive types.
         */
        tryGetMemberInModuleExportsAndProperties(memberName: string, moduleSymbol: Symbol): Symbol | undefined;
        getApparentType(type: Type): Type;
        getSuggestedSymbolForNonexistentProperty(name: Identifier | PrivateIdentifier | string, containingType: Type): Symbol | undefined;
        getSuggestedSymbolForNonexistentJSXAttribute(name: Identifier | string, containingType: Type): Symbol | undefined;
        getSuggestionForNonexistentProperty(name: Identifier | PrivateIdentifier | string, containingType: Type): string | undefined;
        getSuggestedSymbolForNonexistentSymbol(location: Node, name: string, meaning: SymbolFlags): Symbol | undefined;
        getSuggestionForNonexistentSymbol(location: Node, name: string, meaning: SymbolFlags): string | undefined;
        getSuggestedSymbolForNonexistentModule(node: Identifier, target: Symbol): Symbol | undefined;
        getSuggestionForNonexistentExport(node: Identifier, target: Symbol): string | undefined;
        getBaseConstraintOfType(type: Type): Type | undefined;
        getDefaultFromTypeParameter(type: Type): Type | undefined;
        getAnyType(): Type;
        getStringType(): Type;
        getNumberType(): Type;
        getBooleanType(): Type;
        getFalseType(fresh?: boolean): Type;
        getTrueType(fresh?: boolean): Type;
        getVoidType(): Type;
        getUndefinedType(): Type;
        getNullType(): Type;
        getESSymbolType(): Type;
        getNeverType(): Type;
        getOptionalType(): Type;
        getUnionType(types: Type[], subtypeReduction?: UnionReduction): Type;
        createArrayType(elementType: Type): Type;
        getElementTypeOfArrayType(arrayType: Type): Type | undefined;
        createPromiseType(type: Type): Type;
        isTypeAssignableTo(source: Type, target: Type): boolean;
        createAnonymousType(symbol: Symbol | undefined, members: SymbolTable, callSignatures: Signature[], constructSignatures: Signature[], stringIndexInfo: IndexInfo | undefined, numberIndexInfo: IndexInfo | undefined): Type;
        createSignature(declaration: SignatureDeclaration, typeParameters: readonly TypeParameter[] | undefined, thisParameter: Symbol | undefined, parameters: readonly Symbol[], resolvedReturnType: Type, typePredicate: TypePredicate | undefined, minArgumentCount: number, flags: SignatureFlags): Signature;
        createSymbol(flags: SymbolFlags, name: __String): TransientSymbol;
        createIndexInfo(type: Type, isReadonly: boolean, declaration?: SignatureDeclaration): IndexInfo;
        isSymbolAccessible(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags, shouldComputeAliasToMarkVisible: boolean): SymbolAccessibilityResult;
        tryFindAmbientModuleWithoutAugmentations(moduleName: string): Symbol | undefined;
        getSymbolWalker(accept?: (symbol: Symbol) => boolean): SymbolWalker;
        getDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): Diagnostic[];
        getGlobalDiagnostics(): Diagnostic[];
        getEmitResolver(sourceFile?: SourceFile, cancellationToken?: CancellationToken): EmitResolver;
        getTypeCatalog(): readonly Type[];
        getNodeCount(): number;
        getIdentifierCount(): number;
        getSymbolCount(): number;
        getTypeCount(): number;
        getInstantiationCount(): number;
        getRelationCacheSizes(): {
            assignable: number;
            identity: number;
            subtype: number;
            strictSubtype: number;
        };
        getRecursionIdentity(type: Type): object | undefined;
        isArrayType(type: Type): boolean;
        isTupleType(type: Type): boolean;
        isArrayLikeType(type: Type): boolean;
        /**
         * True if `contextualType` should not be considered for completions because
         * e.g. it specifies `kind: "a"` and obj has `kind: "b"`.
         */
        isTypeInvalidDueToUnionDiscriminant(contextualType: Type, obj: ObjectLiteralExpression | JsxAttributes): boolean;
        /**
         * For a union, will include a property if it's defined in *any* of the member types.
         * So for `{ a } | { b }`, this will include both `a` and `b`.
         * Does not include properties of primitive types.
         */
        getAllPossiblePropertiesOfTypes(type: readonly Type[]): Symbol[];
        resolveName(name: string, location: Node | undefined, meaning: SymbolFlags, excludeGlobals: boolean): Symbol | undefined;
        getJsxNamespace(location?: Node): string;
        getJsxFragmentFactory(location: Node): string | undefined;
        /**
         * Note that this will return undefined in the following case:
         *     // a.ts
         *     export namespace N { export class C { } }
         *     // b.ts
         *     <<enclosingDeclaration>>
         * Where `C` is the symbol we're looking for.
         * This should be called in a loop climbing parents of the symbol, so we'll get `N`.
         */
        getAccessibleSymbolChain(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags, useOnlyExternalAliasing: boolean): Symbol[] | undefined;
        getTypePredicateOfSignature(signature: Signature): TypePredicate | undefined;
        resolveExternalModuleName(moduleSpecifier: Expression): Symbol | undefined;
        /**
         * An external module with an 'export =' declaration resolves to the target of the 'export =' declaration,
         * and an external module with no 'export =' declaration resolves to the module itself.
         */
        resolveExternalModuleSymbol(symbol: Symbol): Symbol;
        /** @param node A location where we might consider accessing `this`. Not necessarily a ThisExpression. */
        tryGetThisTypeAt(node: Node, includeGlobalThis?: boolean): Type | undefined;
        getTypeArgumentConstraint(node: TypeNode): Type | undefined;
        /**
         * Does *not* get *all* suggestion diagnostics, just the ones that were convenient to report in the checker.
         * Others are added in computeSuggestionDiagnostics.
         */
        getSuggestionDiagnostics(file: SourceFile, cancellationToken?: CancellationToken): readonly DiagnosticWithLocation[];
        /**
         * Depending on the operation performed, it may be appropriate to throw away the checker
         * if the cancellation token is triggered. Typically, if it is used for error checking
         * and the operation is cancelled, then it should be discarded, otherwise it is safe to keep.
         */
        runWithCancellationToken<T>(token: CancellationToken, cb: (checker: TypeChecker) => T): T;
        getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol: Symbol): readonly TypeParameter[] | undefined;
        isDeclarationVisible(node: Declaration | AnyImportSyntax): boolean;
    }
    export const enum UnionReduction {
        None = 0,
        Literal = 1,
        Subtype = 2
    }
    export const enum ContextFlags {
        None = 0,
        Signature = 1,
        NoConstraints = 2,
        Completions = 4,
        SkipBindingPatterns = 8
    }
    export const enum NodeBuilderFlags {
        None = 0,
        NoTruncation = 1,
        WriteArrayAsGenericType = 2,
        GenerateNamesForShadowedTypeParams = 4,
        UseStructuralFallback = 8,
        ForbidIndexedAccessSymbolReferences = 16,
        WriteTypeArgumentsOfSignature = 32,
        UseFullyQualifiedType = 64,
        UseOnlyExternalAliasing = 128,
        SuppressAnyReturnType = 256,
        WriteTypeParametersInQualifiedName = 512,
        MultilineObjectLiterals = 1024,
        WriteClassExpressionAsTypeLiteral = 2048,
        UseTypeOfFunction = 4096,
        OmitParameterModifiers = 8192,
        UseAliasDefinedOutsideCurrentScope = 16384,
        UseSingleQuotesForStringLiteralType = 268435456,
        NoTypeReduction = 536870912,
        NoUndefinedOptionalParameterType = 1073741824,
        AllowThisInObjectLiteral = 32768,
        AllowQualifedNameInPlaceOfIdentifier = 65536,
        AllowAnonymousIdentifier = 131072,
        AllowEmptyUnionOrIntersection = 262144,
        AllowEmptyTuple = 524288,
        AllowUniqueESSymbolType = 1048576,
        AllowEmptyIndexInfoType = 2097152,
        AllowNodeModulesRelativePaths = 67108864,
        DoNotIncludeSymbolChain = 134217728,
        IgnoreErrors = 70221824,
        InObjectTypeLiteral = 4194304,
        InTypeAlias = 8388608,
        InInitialEntityName = 16777216,
        InReverseMappedType = 33554432
    }
    export const enum TypeFormatFlags {
        None = 0,
        NoTruncation = 1,
        WriteArrayAsGenericType = 2,
        UseStructuralFallback = 8,
        WriteTypeArgumentsOfSignature = 32,
        UseFullyQualifiedType = 64,
        SuppressAnyReturnType = 256,
        MultilineObjectLiterals = 1024,
        WriteClassExpressionAsTypeLiteral = 2048,
        UseTypeOfFunction = 4096,
        OmitParameterModifiers = 8192,
        UseAliasDefinedOutsideCurrentScope = 16384,
        UseSingleQuotesForStringLiteralType = 268435456,
        NoTypeReduction = 536870912,
        AllowUniqueESSymbolType = 1048576,
        AddUndefined = 131072,
        WriteArrowStyleSignature = 262144,
        InArrayType = 524288,
        InElementType = 2097152,
        InFirstTypeArgument = 4194304,
        InTypeAlias = 8388608,
        /** @deprecated */ WriteOwnNameForAnyLike = 0,
        NodeBuilderFlagsMask = 814775659
    }
    export const enum SymbolFormatFlags {
        None = 0,
        WriteTypeParametersOrArguments = 1,
        UseOnlyExternalAliasing = 2,
        AllowAnyNodeKind = 4,
        UseAliasDefinedOutsideCurrentScope = 8,
        DoNotIncludeSymbolChain = 16
    }
    export interface SymbolWalker {
        /** Note: Return values are not ordered. */
        walkType(root: Type): {
            visitedTypes: readonly Type[];
            visitedSymbols: readonly Symbol[];
        };
        /** Note: Return values are not ordered. */
        walkSymbol(root: Symbol): {
            visitedTypes: readonly Type[];
            visitedSymbols: readonly Symbol[];
        };
    }
    interface SymbolWriter extends SymbolTracker {
        writeKeyword(text: string): void;
        writeOperator(text: string): void;
        writePunctuation(text: string): void;
        writeSpace(text: string): void;
        writeStringLiteral(text: string): void;
        writeParameter(text: string): void;
        writeProperty(text: string): void;
        writeSymbol(text: string, symbol: Symbol): void;
        writeLine(force?: boolean): void;
        increaseIndent(): void;
        decreaseIndent(): void;
        clear(): void;
    }
    export const enum SymbolAccessibility {
        Accessible = 0,
        NotAccessible = 1,
        CannotBeNamed = 2
    }
    export const enum SyntheticSymbolKind {
        UnionOrIntersection = 0,
        Spread = 1
    }
    export const enum TypePredicateKind {
        This = 0,
        Identifier = 1,
        AssertsThis = 2,
        AssertsIdentifier = 3
    }
    export interface TypePredicateBase {
        kind: TypePredicateKind;
        type: Type | undefined;
    }
    export interface ThisTypePredicate extends TypePredicateBase {
        kind: TypePredicateKind.This;
        parameterName: undefined;
        parameterIndex: undefined;
        type: Type;
    }
    export interface IdentifierTypePredicate extends TypePredicateBase {
        kind: TypePredicateKind.Identifier;
        parameterName: string;
        parameterIndex: number;
        type: Type;
    }
    export interface AssertsThisTypePredicate extends TypePredicateBase {
        kind: TypePredicateKind.AssertsThis;
        parameterName: undefined;
        parameterIndex: undefined;
        type: Type | undefined;
    }
    export interface AssertsIdentifierTypePredicate extends TypePredicateBase {
        kind: TypePredicateKind.AssertsIdentifier;
        parameterName: string;
        parameterIndex: number;
        type: Type | undefined;
    }
    export type TypePredicate = ThisTypePredicate | IdentifierTypePredicate | AssertsThisTypePredicate | AssertsIdentifierTypePredicate;
    export type AnyImportSyntax = ImportDeclaration | ImportEqualsDeclaration;
    export type AnyImportOrRequire = AnyImportSyntax | RequireVariableDeclaration;
    export type AnyImportOrRequireStatement = AnyImportSyntax | RequireVariableStatement;
    export type AnyImportOrReExport = AnyImportSyntax | ExportDeclaration;
    export interface ValidImportTypeNode extends ImportTypeNode {
        argument: LiteralTypeNode & {
            literal: StringLiteral;
        };
    }
    export type AnyValidImportOrReExport = (ImportDeclaration | ExportDeclaration) & {
        moduleSpecifier: StringLiteral;
    } | ImportEqualsDeclaration & {
        moduleReference: ExternalModuleReference & {
            expression: StringLiteral;
        };
    } | RequireOrImportCall | ValidImportTypeNode;
    export type RequireOrImportCall = CallExpression & {
        expression: Identifier;
        arguments: [StringLiteralLike];
    };
    export interface RequireVariableDeclaration extends VariableDeclaration {
        readonly initializer: RequireOrImportCall;
    }
    export interface RequireVariableStatement extends VariableStatement {
        readonly declarationList: RequireVariableDeclarationList;
    }
    export interface RequireVariableDeclarationList extends VariableDeclarationList {
        readonly declarations: NodeArray<RequireVariableDeclaration>;
    }
    export type LateVisibilityPaintedStatement = AnyImportSyntax | VariableStatement | ClassDeclaration | FunctionDeclaration | ModuleDeclaration | TypeAliasDeclaration | InterfaceDeclaration | EnumDeclaration;
    export interface SymbolVisibilityResult {
        accessibility: SymbolAccessibility;
        aliasesToMakeVisible?: LateVisibilityPaintedStatement[];
        errorSymbolName?: string;
        errorNode?: Node;
    }
    export interface SymbolAccessibilityResult extends SymbolVisibilityResult {
        errorModuleName?: string;
    }
    export interface AllAccessorDeclarations {
        firstAccessor: AccessorDeclaration;
        secondAccessor: AccessorDeclaration | undefined;
        getAccessor: GetAccessorDeclaration | undefined;
        setAccessor: SetAccessorDeclaration | undefined;
    }
    /** Indicates how to serialize the name for a TypeReferenceNode when emitting decorator metadata */
    export enum TypeReferenceSerializationKind {
        Unknown = 0,
        TypeWithConstructSignatureAndValue = 1,
        VoidNullableOrNeverType = 2,
        NumberLikeType = 3,
        BigIntLikeType = 4,
        StringLikeType = 5,
        BooleanType = 6,
        ArrayLikeType = 7,
        ESSymbolType = 8,
        Promise = 9,
        TypeWithCallSignature = 10,
        ObjectType = 11
    }
    export interface EmitResolver {
        hasGlobalName(name: string): boolean;
        getReferencedExportContainer(node: Identifier, prefixLocals?: boolean): SourceFile | ModuleDeclaration | EnumDeclaration | undefined;
        getReferencedImportDeclaration(node: Identifier): Declaration | undefined;
        getReferencedDeclarationWithCollidingName(node: Identifier): Declaration | undefined;
        isDeclarationWithCollidingName(node: Declaration): boolean;
        isValueAliasDeclaration(node: Node): boolean;
        isReferencedAliasDeclaration(node: Node, checkChildren?: boolean): boolean;
        isTopLevelValueImportEqualsWithEntityName(node: ImportEqualsDeclaration): boolean;
        getNodeCheckFlags(node: Node): NodeCheckFlags;
        isDeclarationVisible(node: Declaration | AnyImportSyntax): boolean;
        isLateBound(node: Declaration): node is LateBoundDeclaration;
        collectLinkedAliases(node: Identifier, setVisibility?: boolean): Node[] | undefined;
        isImplementationOfOverload(node: SignatureDeclaration): boolean | undefined;
        isRequiredInitializedParameter(node: ParameterDeclaration): boolean;
        isOptionalUninitializedParameterProperty(node: ParameterDeclaration): boolean;
        isExpandoFunctionDeclaration(node: FunctionDeclaration): boolean;
        getPropertiesOfContainerFunction(node: Declaration): Symbol[];
        createTypeOfDeclaration(declaration: AccessorDeclaration | VariableLikeDeclaration | PropertyAccessExpression, enclosingDeclaration: Node, flags: NodeBuilderFlags, tracker: SymbolTracker, addUndefined?: boolean): TypeNode | undefined;
        createReturnTypeOfSignatureDeclaration(signatureDeclaration: SignatureDeclaration, enclosingDeclaration: Node, flags: NodeBuilderFlags, tracker: SymbolTracker): TypeNode | undefined;
        createTypeOfExpression(expr: Expression, enclosingDeclaration: Node, flags: NodeBuilderFlags, tracker: SymbolTracker): TypeNode | undefined;
        createLiteralConstValue(node: VariableDeclaration | PropertyDeclaration | PropertySignature | ParameterDeclaration, tracker: SymbolTracker): Expression;
        isSymbolAccessible(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags | undefined, shouldComputeAliasToMarkVisible: boolean): SymbolAccessibilityResult;
        isEntityNameVisible(entityName: EntityNameOrEntityNameExpression, enclosingDeclaration: Node): SymbolVisibilityResult;
        getConstantValue(node: EnumMember | PropertyAccessExpression | ElementAccessExpression): string | number | undefined;
        getReferencedValueDeclaration(reference: Identifier): Declaration | undefined;
        getTypeReferenceSerializationKind(typeName: EntityName, location?: Node): TypeReferenceSerializationKind;
        isOptionalParameter(node: ParameterDeclaration): boolean;
        moduleExportsSomeValue(moduleReferenceExpression: Expression): boolean;
        isArgumentsLocalBinding(node: Identifier): boolean;
        getExternalModuleFileFromDeclaration(declaration: ImportEqualsDeclaration | ImportDeclaration | ExportDeclaration | ModuleDeclaration | ImportTypeNode | ImportCall): SourceFile | undefined;
        getTypeReferenceDirectivesForEntityName(name: EntityNameOrEntityNameExpression): string[] | undefined;
        getTypeReferenceDirectivesForSymbol(symbol: Symbol, meaning?: SymbolFlags): string[] | undefined;
        isLiteralConstDeclaration(node: VariableDeclaration | PropertyDeclaration | PropertySignature | ParameterDeclaration): boolean;
        getJsxFactoryEntity(location?: Node): EntityName | undefined;
        getJsxFragmentFactoryEntity(location?: Node): EntityName | undefined;
        getAllAccessorDeclarations(declaration: AccessorDeclaration): AllAccessorDeclarations;
        getSymbolOfExternalModuleSpecifier(node: StringLiteralLike): Symbol | undefined;
        isBindingCapturedByNode(node: Node, decl: VariableDeclaration | BindingElement): boolean;
        getDeclarationStatementsForSourceFile(node: SourceFile, flags: NodeBuilderFlags, tracker: SymbolTracker, bundled?: boolean): Statement[] | undefined;
        isImportRequiredByAugmentation(decl: ImportDeclaration): boolean;
    }
    export const enum SymbolFlags {
        None = 0,
        FunctionScopedVariable = 1,
        BlockScopedVariable = 2,
        Property = 4,
        EnumMember = 8,
        Function = 16,
        Class = 32,
        Interface = 64,
        ConstEnum = 128,
        RegularEnum = 256,
        ValueModule = 512,
        NamespaceModule = 1024,
        TypeLiteral = 2048,
        ObjectLiteral = 4096,
        Method = 8192,
        Constructor = 16384,
        GetAccessor = 32768,
        SetAccessor = 65536,
        Signature = 131072,
        TypeParameter = 262144,
        TypeAlias = 524288,
        ExportValue = 1048576,
        Alias = 2097152,
        Prototype = 4194304,
        ExportStar = 8388608,
        Optional = 16777216,
        Transient = 33554432,
        Assignment = 67108864,
        ModuleExports = 134217728,
        All = 67108863,
        Enum = 384,
        Variable = 3,
        Value = 111551,
        Type = 788968,
        Namespace = 1920,
        Module = 1536,
        Accessor = 98304,
        FunctionScopedVariableExcludes = 111550,
        BlockScopedVariableExcludes = 111551,
        ParameterExcludes = 111551,
        PropertyExcludes = 0,
        EnumMemberExcludes = 900095,
        FunctionExcludes = 110991,
        ClassExcludes = 899503,
        InterfaceExcludes = 788872,
        RegularEnumExcludes = 899327,
        ConstEnumExcludes = 899967,
        ValueModuleExcludes = 110735,
        NamespaceModuleExcludes = 0,
        MethodExcludes = 103359,
        GetAccessorExcludes = 46015,
        SetAccessorExcludes = 78783,
        TypeParameterExcludes = 526824,
        TypeAliasExcludes = 788968,
        AliasExcludes = 2097152,
        ModuleMember = 2623475,
        ExportHasLocal = 944,
        BlockScoped = 418,
        PropertyOrAccessor = 98308,
        ClassMember = 106500,
        ExportSupportsDefaultModifier = 112,
        ExportDoesNotSupportDefaultModifier = -113,
        Classifiable = 2885600,
        LateBindingContainer = 6256
    }
    export type SymbolId = number;
    export interface Symbol {
        flags: SymbolFlags;
        escapedName: __String;
        declarations: Declaration[];
        valueDeclaration: Declaration;
        members?: SymbolTable;
        exports?: SymbolTable;
        globalExports?: SymbolTable;
        id?: SymbolId;
        mergeId?: number;
        parent?: Symbol;
        exportSymbol?: Symbol;
        constEnumOnlyModule?: boolean;
        isReferenced?: SymbolFlags;
        isReplaceableByMethod?: boolean;
        isAssigned?: boolean;
        assignmentDeclarationMembers?: ESMap<number, Declaration>;
    }
    export interface SymbolLinks {
        immediateTarget?: Symbol;
        target?: Symbol;
        type?: Type;
        nameType?: Type;
        uniqueESSymbolType?: Type;
        declaredType?: Type;
        typeParameters?: TypeParameter[];
        outerTypeParameters?: TypeParameter[];
        instantiations?: ESMap<string, Type>;
        aliasSymbol?: Symbol;
        aliasTypeArguments?: readonly Type[];
        inferredClassSymbol?: ESMap<SymbolId, TransientSymbol>;
        mapper?: TypeMapper;
        referenced?: boolean;
        constEnumReferenced?: boolean;
        containingType?: UnionOrIntersectionType;
        leftSpread?: Symbol;
        rightSpread?: Symbol;
        syntheticOrigin?: Symbol;
        isDiscriminantProperty?: boolean;
        resolvedExports?: SymbolTable;
        resolvedMembers?: SymbolTable;
        exportsChecked?: boolean;
        typeParametersChecked?: boolean;
        isDeclarationWithCollidingName?: boolean;
        bindingElement?: BindingElement;
        exportsSomeValue?: boolean;
        enumKind?: EnumKind;
        originatingImport?: ImportDeclaration | ImportCall;
        lateSymbol?: Symbol;
        specifierCache?: ESMap<string, string>;
        extendedContainers?: Symbol[];
        extendedContainersByFile?: ESMap<NodeId, Symbol[]>;
        variances?: VarianceFlags[];
        deferralConstituents?: Type[];
        deferralParent?: Type;
        cjsExportMerged?: Symbol;
        typeOnlyDeclaration?: TypeOnlyCompatibleAliasDeclaration | false;
        isConstructorDeclaredProperty?: boolean;
        tupleLabelDeclaration?: NamedTupleMember | ParameterDeclaration;
    }
    export const enum EnumKind {
        Numeric = 0,
        Literal = 1
    }
    export const enum CheckFlags {
        Instantiated = 1,
        SyntheticProperty = 2,
        SyntheticMethod = 4,
        Readonly = 8,
        ReadPartial = 16,
        WritePartial = 32,
        HasNonUniformType = 64,
        HasLiteralType = 128,
        ContainsPublic = 256,
        ContainsProtected = 512,
        ContainsPrivate = 1024,
        ContainsStatic = 2048,
        Late = 4096,
        ReverseMapped = 8192,
        OptionalParameter = 16384,
        RestParameter = 32768,
        DeferredType = 65536,
        HasNeverType = 131072,
        Mapped = 262144,
        StripOptional = 524288,
        Synthetic = 6,
        Discriminant = 192,
        Partial = 48
    }
    export interface TransientSymbol extends Symbol, SymbolLinks {
        checkFlags: CheckFlags;
    }
    export interface MappedSymbol extends TransientSymbol {
        mappedType: MappedType;
        keyType: Type;
    }
    export interface ReverseMappedSymbol extends TransientSymbol {
        propertyType: Type;
        mappedType: MappedType;
        constraintType: IndexType;
    }
    export const enum InternalSymbolName {
        Call = "__call",
        Constructor = "__constructor",
        New = "__new",
        Index = "__index",
        ExportStar = "__export",
        Global = "__global",
        Missing = "__missing",
        Type = "__type",
        Object = "__object",
        JSXAttributes = "__jsxAttributes",
        Class = "__class",
        Function = "__function",
        Computed = "__computed",
        Resolving = "__resolving__",
        ExportEquals = "export=",
        Default = "default",
        This = "this"
    }
    /**
     * This represents a string whose leading underscore have been escaped by adding extra leading underscores.
     * The shape of this brand is rather unique compared to others we've used.
     * Instead of just an intersection of a string and an object, it is that union-ed
     * with an intersection of void and an object. This makes it wholly incompatible
     * with a normal string (which is good, it cannot be misused on assignment or on usage),
     * while still being comparable with a normal string via === (also good) and castable from a string.
     */
    export type __String = (string & {
        __escapedIdentifier: void;
    }) | (void & {
        __escapedIdentifier: void;
    }) | InternalSymbolName;
    /** ReadonlyMap where keys are `__String`s. */
    export interface ReadonlyUnderscoreEscapedMap<T> extends ReadonlyESMap<__String, T> {
    }
    /** Map where keys are `__String`s. */
    export interface UnderscoreEscapedMap<T> extends ESMap<__String, T>, ReadonlyUnderscoreEscapedMap<T> {
    }
    /** SymbolTable based on ES6 Map interface. */
    export type SymbolTable = UnderscoreEscapedMap<Symbol>;
    /** Used to track a `declare module "foo*"`-like declaration. */
    export interface PatternAmbientModule {
        pattern: Pattern;
        symbol: Symbol;
    }
    export const enum NodeCheckFlags {
        TypeChecked = 1,
        LexicalThis = 2,
        CaptureThis = 4,
        CaptureNewTarget = 8,
        SuperInstance = 256,
        SuperStatic = 512,
        ContextChecked = 1024,
        AsyncMethodWithSuper = 2048,
        AsyncMethodWithSuperBinding = 4096,
        CaptureArguments = 8192,
        EnumValuesComputed = 16384,
        LexicalModuleMergesWithClass = 32768,
        LoopWithCapturedBlockScopedBinding = 65536,
        ContainsCapturedBlockScopeBinding = 131072,
        CapturedBlockScopedBinding = 262144,
        BlockScopedBindingInLoop = 524288,
        ClassWithBodyScopedClassBinding = 1048576,
        BodyScopedClassBinding = 2097152,
        NeedsLoopOutParameter = 4194304,
        AssignmentsMarked = 8388608,
        ClassWithConstructorReference = 16777216,
        ConstructorReferenceInClass = 33554432,
        ContainsClassWithPrivateIdentifiers = 67108864
    }
    export interface NodeLinks {
        flags: NodeCheckFlags;
        resolvedType?: Type;
        resolvedEnumType?: Type;
        resolvedSignature?: Signature;
        resolvedSymbol?: Symbol;
        resolvedIndexInfo?: IndexInfo;
        effectsSignature?: Signature;
        enumMemberValue?: string | number;
        isVisible?: boolean;
        containsArgumentsReference?: boolean;
        hasReportedStatementInAmbientContext?: boolean;
        jsxFlags: JsxFlags;
        resolvedJsxElementAttributesType?: Type;
        resolvedJsxElementAllAttributesType?: Type;
        resolvedJSDocType?: Type;
        switchTypes?: Type[];
        jsxNamespace?: Symbol | false;
        jsxImplicitImportContainer?: Symbol | false;
        contextFreeType?: Type;
        deferredNodes?: ESMap<NodeId, Node>;
        capturedBlockScopeBindings?: Symbol[];
        outerTypeParameters?: TypeParameter[];
        isExhaustive?: boolean;
        skipDirectInference?: true;
        declarationRequiresScopeChange?: boolean;
    }
    export const enum TypeFlags {
        Any = 1,
        Unknown = 2,
        String = 4,
        Number = 8,
        Boolean = 16,
        Enum = 32,
        BigInt = 64,
        StringLiteral = 128,
        NumberLiteral = 256,
        BooleanLiteral = 512,
        EnumLiteral = 1024,
        BigIntLiteral = 2048,
        ESSymbol = 4096,
        UniqueESSymbol = 8192,
        Void = 16384,
        Undefined = 32768,
        Null = 65536,
        Never = 131072,
        TypeParameter = 262144,
        Object = 524288,
        Union = 1048576,
        Intersection = 2097152,
        Index = 4194304,
        IndexedAccess = 8388608,
        Conditional = 16777216,
        Substitution = 33554432,
        NonPrimitive = 67108864,
        TemplateLiteral = 134217728,
        StringMapping = 268435456,
        AnyOrUnknown = 3,
        Nullable = 98304,
        Literal = 2944,
        Unit = 109440,
        StringOrNumberLiteral = 384,
        StringOrNumberLiteralOrUnique = 8576,
        DefinitelyFalsy = 117632,
        PossiblyFalsy = 117724,
        Intrinsic = 67359327,
        Primitive = 131068,
        StringLike = 402653316,
        NumberLike = 296,
        BigIntLike = 2112,
        BooleanLike = 528,
        EnumLike = 1056,
        ESSymbolLike = 12288,
        VoidLike = 49152,
        DisjointDomains = 469892092,
        UnionOrIntersection = 3145728,
        StructuredType = 3670016,
        TypeVariable = 8650752,
        InstantiableNonPrimitive = 58982400,
        InstantiablePrimitive = 406847488,
        Instantiable = 465829888,
        StructuredOrInstantiable = 469499904,
        ObjectFlagsType = 3899393,
        Simplifiable = 25165824,
        Substructure = 469237760,
        Narrowable = 536624127,
        NotPrimitiveUnion = 468598819,
        IncludesMask = 205258751,
        IncludesStructuredOrInstantiable = 262144,
        IncludesNonWideningType = 4194304,
        IncludesWildcard = 8388608,
        IncludesEmptyObject = 16777216
    }
    export type DestructuringPattern = BindingPattern | ObjectLiteralExpression | ArrayLiteralExpression;
    export type TypeId = number;
    export interface Type {
        flags: TypeFlags;
        id: TypeId;
        checker: TypeChecker;
        symbol: Symbol;
        pattern?: DestructuringPattern;
        aliasSymbol?: Symbol;
        aliasTypeArguments?: readonly Type[];
        aliasTypeArgumentsContainsMarker?: boolean;
        permissiveInstantiation?: Type;
        restrictiveInstantiation?: Type;
        immediateBaseConstraint?: Type;
        widened?: Type;
    }
    export interface IntrinsicType extends Type {
        intrinsicName: string;
        objectFlags: ObjectFlags;
    }
    export interface NullableType extends IntrinsicType {
        objectFlags: ObjectFlags;
    }
    export interface FreshableIntrinsicType extends IntrinsicType {
        freshType: IntrinsicType;
        regularType: IntrinsicType;
    }
    export type FreshableType = LiteralType | FreshableIntrinsicType;
    export interface LiteralType extends Type {
        value: string | number | PseudoBigInt;
        freshType: LiteralType;
        regularType: LiteralType;
    }
    export interface UniqueESSymbolType extends Type {
        symbol: Symbol;
        escapedName: __String;
    }
    export interface StringLiteralType extends LiteralType {
        value: string;
    }
    export interface NumberLiteralType extends LiteralType {
        value: number;
    }
    export interface BigIntLiteralType extends LiteralType {
        value: PseudoBigInt;
    }
    export interface EnumType extends Type {
    }
    export const enum ObjectFlags {
        Class = 1,
        Interface = 2,
        Reference = 4,
        Tuple = 8,
        Anonymous = 16,
        Mapped = 32,
        Instantiated = 64,
        ObjectLiteral = 128,
        EvolvingArray = 256,
        ObjectLiteralPatternWithComputedProperties = 512,
        ContainsSpread = 1024,
        ReverseMapped = 2048,
        JsxAttributes = 4096,
        MarkerType = 8192,
        JSLiteral = 16384,
        FreshLiteral = 32768,
        ArrayLiteral = 65536,
        ObjectRestType = 131072,
        PrimitiveUnion = 262144,
        ContainsWideningType = 524288,
        ContainsObjectOrArrayLiteral = 1048576,
        NonInferrableType = 2097152,
        IsGenericObjectTypeComputed = 4194304,
        IsGenericObjectType = 8388608,
        IsGenericIndexTypeComputed = 16777216,
        IsGenericIndexType = 33554432,
        CouldContainTypeVariablesComputed = 67108864,
        CouldContainTypeVariables = 134217728,
        ContainsIntersections = 268435456,
        IsNeverIntersectionComputed = 268435456,
        IsNeverIntersection = 536870912,
        IsClassInstanceClone = 1073741824,
        ClassOrInterface = 3,
        RequiresWidening = 1572864,
        PropagatingFlags = 3670016,
        ObjectTypeKindMask = 2367
    }
    export type ObjectFlagsType = NullableType | ObjectType | UnionType | IntersectionType;
    export interface ObjectType extends Type {
        objectFlags: ObjectFlags;
        members?: SymbolTable;
        properties?: Symbol[];
        callSignatures?: readonly Signature[];
        constructSignatures?: readonly Signature[];
        stringIndexInfo?: IndexInfo;
        numberIndexInfo?: IndexInfo;
        objectTypeWithoutAbstractConstructSignatures?: ObjectType;
    }
    /** Class and interface types (ObjectFlags.Class and ObjectFlags.Interface). */
    export interface InterfaceType extends ObjectType {
        typeParameters: TypeParameter[] | undefined;
        outerTypeParameters: TypeParameter[] | undefined;
        localTypeParameters: TypeParameter[] | undefined;
        thisType: TypeParameter | undefined;
        resolvedBaseConstructorType?: Type;
        resolvedBaseTypes: BaseType[];
        baseTypesResolved?: boolean;
    }
    export type BaseType = ObjectType | IntersectionType | TypeVariable;
    export interface InterfaceTypeWithDeclaredMembers extends InterfaceType {
        declaredProperties: Symbol[];
        declaredCallSignatures: Signature[];
        declaredConstructSignatures: Signature[];
        declaredStringIndexInfo?: IndexInfo;
        declaredNumberIndexInfo?: IndexInfo;
    }
    /**
     * Type references (ObjectFlags.Reference). When a class or interface has type parameters or
     * a "this" type, references to the class or interface are made using type references. The
     * typeArguments property specifies the types to substitute for the type parameters of the
     * class or interface and optionally includes an extra element that specifies the type to
     * substitute for "this" in the resulting instantiation. When no extra argument is present,
     * the type reference itself is substituted for "this". The typeArguments property is undefined
     * if the class or interface has no type parameters and the reference isn't specifying an
     * explicit "this" argument.
     */
    export interface TypeReference extends ObjectType {
        target: GenericType;
        node?: TypeReferenceNode | ArrayTypeNode | TupleTypeNode;
        mapper?: TypeMapper;
        resolvedTypeArguments?: readonly Type[];
        literalType?: TypeReference;
    }
    export interface DeferredTypeReference extends TypeReference {
        node: TypeReferenceNode | ArrayTypeNode | TupleTypeNode;
        mapper?: TypeMapper;
        instantiations?: ESMap<string, Type>;
    }
    export const enum VarianceFlags {
        Invariant = 0,
        Covariant = 1,
        Contravariant = 2,
        Bivariant = 3,
        Independent = 4,
        VarianceMask = 7,
        Unmeasurable = 8,
        Unreliable = 16,
        AllowsStructuralFallback = 24
    }
    export interface GenericType extends InterfaceType, TypeReference {
        instantiations: ESMap<string, TypeReference>;
        variances?: VarianceFlags[];
    }
    export const enum ElementFlags {
        Required = 1,
        Optional = 2,
        Rest = 4,
        Variadic = 8,
        Fixed = 3,
        Variable = 12,
        NonRequired = 14,
        NonRest = 11
    }
    export interface TupleType extends GenericType {
        elementFlags: readonly ElementFlags[];
        minLength: number;
        fixedLength: number;
        hasRestElement: boolean;
        combinedFlags: ElementFlags;
        readonly: boolean;
        labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration)[];
    }
    export interface TupleTypeReference extends TypeReference {
        target: TupleType;
    }
    export interface UnionOrIntersectionType extends Type {
        types: Type[];
        objectFlags: ObjectFlags;
        propertyCache?: SymbolTable;
        propertyCacheWithoutObjectFunctionPropertyAugment?: SymbolTable;
        resolvedProperties: Symbol[];
        resolvedIndexType: IndexType;
        resolvedStringIndexType: IndexType;
        resolvedBaseConstraint: Type;
    }
    export interface UnionType extends UnionOrIntersectionType {
        resolvedReducedType?: Type;
        regularType?: UnionType;
        origin?: Type;
    }
    export interface IntersectionType extends UnionOrIntersectionType {
        resolvedApparentType: Type;
    }
    export type StructuredType = ObjectType | UnionType | IntersectionType;
    export interface AnonymousType extends ObjectType {
        target?: AnonymousType;
        mapper?: TypeMapper;
        instantiations?: ESMap<string, Type>;
    }
    export interface MappedType extends AnonymousType {
        declaration: MappedTypeNode;
        typeParameter?: TypeParameter;
        constraintType?: Type;
        nameType?: Type;
        templateType?: Type;
        modifiersType?: Type;
        resolvedApparentType?: Type;
        containsError?: boolean;
    }
    export interface EvolvingArrayType extends ObjectType {
        elementType: Type;
        finalArrayType?: Type;
    }
    export interface ReverseMappedType extends ObjectType {
        source: Type;
        mappedType: MappedType;
        constraintType: IndexType;
    }
    export interface ResolvedType extends ObjectType, UnionOrIntersectionType {
        members: SymbolTable;
        properties: Symbol[];
        callSignatures: readonly Signature[];
        constructSignatures: readonly Signature[];
    }
    export interface FreshObjectLiteralType extends ResolvedType {
        regularType: ResolvedType;
    }
    export interface IterationTypes {
        readonly yieldType: Type;
        readonly returnType: Type;
        readonly nextType: Type;
    }
    export interface IterableOrIteratorType extends ObjectType, UnionType {
        iterationTypesOfGeneratorReturnType?: IterationTypes;
        iterationTypesOfAsyncGeneratorReturnType?: IterationTypes;
        iterationTypesOfIterable?: IterationTypes;
        iterationTypesOfIterator?: IterationTypes;
        iterationTypesOfAsyncIterable?: IterationTypes;
        iterationTypesOfAsyncIterator?: IterationTypes;
        iterationTypesOfIteratorResult?: IterationTypes;
    }
    export interface PromiseOrAwaitableType extends ObjectType, UnionType {
        promiseTypeOfPromiseConstructor?: Type;
        promisedTypeOfPromise?: Type;
        awaitedTypeOfType?: Type;
    }
    export interface SyntheticDefaultModuleType extends Type {
        syntheticType?: Type;
    }
    export interface InstantiableType extends Type {
        resolvedBaseConstraint?: Type;
        resolvedIndexType?: IndexType;
        resolvedStringIndexType?: IndexType;
    }
    export interface TypeParameter extends InstantiableType {
        /** Retrieve using getConstraintFromTypeParameter */
        constraint?: Type;
        default?: Type;
        target?: TypeParameter;
        mapper?: TypeMapper;
        isThisType?: boolean;
        resolvedDefaultType?: Type;
    }
    export interface IndexedAccessType extends InstantiableType {
        objectType: Type;
        indexType: Type;
        /**
         * @internal
         * Indicates that --noUncheckedIndexedAccess may introduce 'undefined' into
         * the resulting type, depending on how type variable constraints are resolved.
         */
        noUncheckedIndexedAccessCandidate: boolean;
        constraint?: Type;
        simplifiedForReading?: Type;
        simplifiedForWriting?: Type;
    }
    export type TypeVariable = TypeParameter | IndexedAccessType;
    export interface IndexType extends InstantiableType {
        type: InstantiableType | UnionOrIntersectionType;
        stringsOnly: boolean;
    }
    export interface ConditionalRoot {
        node: ConditionalTypeNode;
        checkType: Type;
        extendsType: Type;
        isDistributive: boolean;
        inferTypeParameters?: TypeParameter[];
        outerTypeParameters?: TypeParameter[];
        instantiations?: Map<Type>;
        aliasSymbol?: Symbol;
        aliasTypeArguments?: Type[];
    }
    export interface ConditionalType extends InstantiableType {
        root: ConditionalRoot;
        checkType: Type;
        extendsType: Type;
        resolvedTrueType: Type;
        resolvedFalseType: Type;
        resolvedInferredTrueType?: Type;
        resolvedDefaultConstraint?: Type;
        mapper?: TypeMapper;
        combinedMapper?: TypeMapper;
    }
    export interface TemplateLiteralType extends InstantiableType {
        texts: readonly string[];
        types: readonly Type[];
    }
    export interface StringMappingType extends InstantiableType {
        symbol: Symbol;
        type: Type;
    }
    export interface SubstitutionType extends InstantiableType {
        baseType: Type;
        substitute: Type;
    }
    export const enum JsxReferenceKind {
        Component = 0,
        Function = 1,
        Mixed = 2
    }
    export const enum SignatureKind {
        Call = 0,
        Construct = 1
    }
    export const enum SignatureFlags {
        None = 0,
        HasRestParameter = 1,
        HasLiteralTypes = 2,
        Abstract = 4,
        IsInnerCallChain = 8,
        IsOuterCallChain = 16,
        IsUntypedSignatureInJSFile = 32,
        PropagatingFlags = 39,
        CallChainFlags = 24
    }
    export interface Signature {
        flags: SignatureFlags;
        checker?: TypeChecker;
        declaration?: SignatureDeclaration | JSDocSignature;
        typeParameters?: readonly TypeParameter[];
        parameters: readonly Symbol[];
        thisParameter?: Symbol;
        resolvedReturnType?: Type;
        resolvedTypePredicate?: TypePredicate;
        minArgumentCount: number;
        resolvedMinArgumentCount?: number;
        target?: Signature;
        mapper?: TypeMapper;
        unionSignatures?: Signature[];
        erasedSignatureCache?: Signature;
        canonicalSignatureCache?: Signature;
        optionalCallSignatureCache?: {
            inner?: Signature;
            outer?: Signature;
        };
        isolatedSignatureType?: ObjectType;
        instantiations?: ESMap<string, Signature>;
    }
    export const enum IndexKind {
        String = 0,
        Number = 1
    }
    export interface IndexInfo {
        type: Type;
        isReadonly: boolean;
        declaration?: IndexSignatureDeclaration;
    }
    export const enum TypeMapKind {
        Simple = 0,
        Array = 1,
        Function = 2,
        Composite = 3,
        Merged = 4
    }
    export type TypeMapper = {
        kind: TypeMapKind.Simple;
        source: Type;
        target: Type;
    } | {
        kind: TypeMapKind.Array;
        sources: readonly Type[];
        targets: readonly Type[] | undefined;
    } | {
        kind: TypeMapKind.Function;
        func: (t: Type) => Type;
    } | {
        kind: TypeMapKind.Composite | TypeMapKind.Merged;
        mapper1: TypeMapper;
        mapper2: TypeMapper;
    };
    export const enum InferencePriority {
        NakedTypeVariable = 1,
        SpeculativeTuple = 2,
        HomomorphicMappedType = 4,
        PartialHomomorphicMappedType = 8,
        MappedTypeConstraint = 16,
        ContravariantConditional = 32,
        ReturnType = 64,
        LiteralKeyof = 128,
        NoConstraints = 256,
        AlwaysStrict = 512,
        MaxValue = 1024,
        PriorityImpliesCombination = 208,
        Circularity = -1
    }
    export interface InferenceInfo {
        typeParameter: TypeParameter;
        candidates: Type[] | undefined;
        contraCandidates: Type[] | undefined;
        inferredType?: Type;
        priority?: InferencePriority;
        topLevel: boolean;
        isFixed: boolean;
        impliedArity?: number;
    }
    export const enum InferenceFlags {
        None = 0,
        NoDefault = 1,
        AnyDefault = 2,
        SkippedGenericFunction = 4
    }
    /**
     * Ternary values are defined such that
     * x & y picks the lesser in the order False < Unknown < Maybe < True, and
     * x | y picks the greater in the order False < Unknown < Maybe < True.
     * Generally, Ternary.Maybe is used as the result of a relation that depends on itself, and
     * Ternary.Unknown is used as the result of a variance check that depends on itself. We make
     * a distinction because we don't want to cache circular variance check results.
     */
    export const enum Ternary {
        False = 0,
        Unknown = 1,
        Maybe = 3,
        True = -1
    }
    export type TypeComparer = (s: Type, t: Type, reportErrors?: boolean) => Ternary;
    export interface InferenceContext {
        inferences: InferenceInfo[];
        signature?: Signature;
        flags: InferenceFlags;
        compareTypes: TypeComparer;
        mapper: TypeMapper;
        nonFixingMapper: TypeMapper;
        returnMapper?: TypeMapper;
        inferredTypeParameters?: readonly TypeParameter[];
    }
    export interface WideningContext {
        parent?: WideningContext;
        propertyName?: __String;
        siblings?: Type[];
        resolvedProperties?: Symbol[];
    }
    export const enum AssignmentDeclarationKind {
        None = 0,
        ExportsProperty = 1,
        ModuleExports = 2,
        PrototypeProperty = 3,
        ThisProperty = 4,
        Property = 5,
        Prototype = 6,
        ObjectDefinePropertyValue = 7,
        ObjectDefinePropertyExports = 8,
        ObjectDefinePrototypeProperty = 9
    }
    /** @deprecated Use FileExtensionInfo instead. */
    export type JsFileExtensionInfo = FileExtensionInfo;
    export interface FileExtensionInfo {
        extension: string;
        isMixedContent: boolean;
        scriptKind?: ScriptKind;
    }
    export interface DiagnosticMessage {
        key: string;
        category: DiagnosticCategory;
        code: number;
        message: string;
        reportsUnnecessary?: {};
        reportsDeprecated?: {};
        elidedInCompatabilityPyramid?: boolean;
    }
    /**
     * A linked list of formatted diagnostic messages to be used as part of a multiline message.
     * It is built from the bottom up, leaving the head to be the "main" diagnostic.
     * While it seems that DiagnosticMessageChain is structurally similar to DiagnosticMessage,
     * the difference is that messages are all preformatted in DMC.
     */
    export interface DiagnosticMessageChain {
        messageText: string;
        category: DiagnosticCategory;
        code: number;
        next?: DiagnosticMessageChain[];
    }
    export interface Diagnostic extends DiagnosticRelatedInformation {
        /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
        reportsUnnecessary?: {};
        reportsDeprecated?: {};
        source?: string;
        relatedInformation?: DiagnosticRelatedInformation[];
        skippedOn?: keyof CompilerOptions;
    }
    export interface DiagnosticRelatedInformation {
        category: DiagnosticCategory;
        code: number;
        file: SourceFile | undefined;
        start: number | undefined;
        length: number | undefined;
        messageText: string | DiagnosticMessageChain;
    }
    export interface DiagnosticWithLocation extends Diagnostic {
        file: SourceFile;
        start: number;
        length: number;
    }
    export interface DiagnosticWithDetachedLocation extends Diagnostic {
        file: undefined;
        fileName: string;
        start: number;
        length: number;
    }
    export enum DiagnosticCategory {
        Warning = 0,
        Error = 1,
        Suggestion = 2,
        Message = 3
    }
    export function diagnosticCategoryName(d: {
        category: DiagnosticCategory;
    }, lowerCase?: boolean): string;
    export enum ModuleResolutionKind {
        Classic = 1,
        NodeJs = 2
    }
    export interface PluginImport {
        name: string;
    }
    export interface ProjectReference {
        /** A normalized path on disk */
        path: string;
        /** The path as the user originally wrote it */
        originalPath?: string;
        /** True if the output of this reference should be prepended to the output of this project. Only valid for --outFile compilations */
        prepend?: boolean;
        /** True if it is intended that this reference form a circularity */
        circular?: boolean;
    }
    export enum WatchFileKind {
        FixedPollingInterval = 0,
        PriorityPollingInterval = 1,
        DynamicPriorityPolling = 2,
        UseFsEvents = 3,
        UseFsEventsOnParentDirectory = 4
    }
    export enum WatchDirectoryKind {
        UseFsEvents = 0,
        FixedPollingInterval = 1,
        DynamicPriorityPolling = 2
    }
    export enum PollingWatchKind {
        FixedInterval = 0,
        PriorityInterval = 1,
        DynamicPriority = 2
    }
    export type CompilerOptionsValue = string | number | boolean | (string | number)[] | string[] | MapLike<string[]> | PluginImport[] | ProjectReference[] | null | undefined;
    export interface CompilerOptions {
        all?: boolean;
        allowJs?: boolean;
        allowNonTsExtensions?: boolean;
        allowSyntheticDefaultImports?: boolean;
        allowUmdGlobalAccess?: boolean;
        allowUnreachableCode?: boolean;
        allowUnusedLabels?: boolean;
        alwaysStrict?: boolean;
        baseUrl?: string;
        /** An error if set - this should only go through the -b pipeline and not actually be observed */
        build?: boolean;
        charset?: string;
        checkJs?: boolean;
        configFilePath?: string;
        /** configFile is set as non enumerable property so as to avoid checking of json source files */
        readonly configFile?: TsConfigSourceFile;
        declaration?: boolean;
        declarationMap?: boolean;
        emitDeclarationOnly?: boolean;
        declarationDir?: string;
        diagnostics?: boolean;
        extendedDiagnostics?: boolean;
        disableSizeLimit?: boolean;
        disableSourceOfProjectReferenceRedirect?: boolean;
        disableSolutionSearching?: boolean;
        disableReferencedProjectLoad?: boolean;
        downlevelIteration?: boolean;
        emitBOM?: boolean;
        emitDecoratorMetadata?: boolean;
        experimentalDecorators?: boolean;
        forceConsistentCasingInFileNames?: boolean;
        generateCpuProfile?: string;
        generateTrace?: string;
        help?: boolean;
        importHelpers?: boolean;
        importsNotUsedAsValues?: ImportsNotUsedAsValues;
        init?: boolean;
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        isolatedModules?: boolean;
        jsx?: JsxEmit;
        keyofStringsOnly?: boolean;
        lib?: string[];
        listEmittedFiles?: boolean;
        listFiles?: boolean;
        explainFiles?: boolean;
        listFilesOnly?: boolean;
        locale?: string;
        mapRoot?: string;
        maxNodeModuleJsDepth?: number;
        module?: ModuleKind;
        moduleResolution?: ModuleResolutionKind;
        newLine?: NewLineKind;
        noEmit?: boolean;
        noEmitForJsFiles?: boolean;
        noEmitHelpers?: boolean;
        noEmitOnError?: boolean;
        noErrorTruncation?: boolean;
        noFallthroughCasesInSwitch?: boolean;
        noImplicitAny?: boolean;
        noImplicitReturns?: boolean;
        noImplicitThis?: boolean;
        noStrictGenericChecks?: boolean;
        noUnusedLocals?: boolean;
        noUnusedParameters?: boolean;
        noImplicitUseStrict?: boolean;
        noPropertyAccessFromIndexSignature?: boolean;
        assumeChangesOnlyAffectDirectDependencies?: boolean;
        noLib?: boolean;
        noResolve?: boolean;
        noUncheckedIndexedAccess?: boolean;
        out?: string;
        outDir?: string;
        outFile?: string;
        paths?: MapLike<string[]>;
        /** The directory of the config file that specified 'paths'. Used to resolve relative paths when 'baseUrl' is absent. */
        pathsBasePath?: string;
        plugins?: PluginImport[];
        preserveConstEnums?: boolean;
        preserveSymlinks?: boolean;
        preserveWatchOutput?: boolean;
        project?: string;
        pretty?: boolean;
        reactNamespace?: string;
        jsxFactory?: string;
        jsxFragmentFactory?: string;
        jsxImportSource?: string;
        composite?: boolean;
        incremental?: boolean;
        tsBuildInfoFile?: string;
        removeComments?: boolean;
        rootDir?: string;
        rootDirs?: string[];
        skipLibCheck?: boolean;
        skipDefaultLibCheck?: boolean;
        sourceMap?: boolean;
        sourceRoot?: string;
        strict?: boolean;
        strictFunctionTypes?: boolean;
        strictBindCallApply?: boolean;
        strictNullChecks?: boolean;
        strictPropertyInitialization?: boolean;
        stripInternal?: boolean;
        suppressExcessPropertyErrors?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        suppressOutputPathCheck?: boolean;
        target?: ScriptTarget;
        traceResolution?: boolean;
        resolveJsonModule?: boolean;
        types?: string[];
        /** Paths used to compute primary types search locations */
        typeRoots?: string[];
        version?: boolean;
        watch?: boolean;
        esModuleInterop?: boolean;
        showConfig?: boolean;
        useDefineForClassFields?: boolean;
        [option: string]: CompilerOptionsValue | TsConfigSourceFile | undefined;
    }
    export interface WatchOptions {
        watchFile?: WatchFileKind;
        watchDirectory?: WatchDirectoryKind;
        fallbackPolling?: PollingWatchKind;
        synchronousWatchDirectory?: boolean;
        excludeDirectories?: string[];
        excludeFiles?: string[];
        [option: string]: CompilerOptionsValue | undefined;
    }
    export interface TypeAcquisition {
        /**
         * @deprecated typingOptions.enableAutoDiscovery
         * Use typeAcquisition.enable instead.
         */
        enableAutoDiscovery?: boolean;
        enable?: boolean;
        include?: string[];
        exclude?: string[];
        disableFilenameBasedTypeAcquisition?: boolean;
        [option: string]: CompilerOptionsValue | undefined;
    }
    export enum ModuleKind {
        None = 0,
        CommonJS = 1,
        AMD = 2,
        UMD = 3,
        System = 4,
        ES2015 = 5,
        ES2020 = 6,
        ESNext = 99
    }
    export const enum JsxEmit {
        None = 0,
        Preserve = 1,
        React = 2,
        ReactNative = 3,
        ReactJSX = 4,
        ReactJSXDev = 5
    }
    export const enum ImportsNotUsedAsValues {
        Remove = 0,
        Preserve = 1,
        Error = 2
    }
    export const enum NewLineKind {
        CarriageReturnLineFeed = 0,
        LineFeed = 1
    }
    export interface LineAndCharacter {
        /** 0-based. */
        line: number;
        character: number;
    }
    export const enum ScriptKind {
        Unknown = 0,
        JS = 1,
        JSX = 2,
        TS = 3,
        TSX = 4,
        External = 5,
        JSON = 6,
        /**
         * Used on extensions that doesn't define the ScriptKind but the content defines it.
         * Deferred extensions are going to be included in all project contexts.
         */
        Deferred = 7
    }
    export const enum ScriptTarget {
        ES3 = 0,
        ES5 = 1,
        ES2015 = 2,
        ES2016 = 3,
        ES2017 = 4,
        ES2018 = 5,
        ES2019 = 6,
        ES2020 = 7,
        ESNext = 99,
        JSON = 100,
        Latest = 99
    }
    export const enum LanguageVariant {
        Standard = 0,
        JSX = 1
    }
    /** Either a parsed command line or a parsed tsconfig.json */
    export interface ParsedCommandLine {
        options: CompilerOptions;
        typeAcquisition?: TypeAcquisition;
        fileNames: string[];
        projectReferences?: readonly ProjectReference[];
        watchOptions?: WatchOptions;
        raw?: any;
        errors: Diagnostic[];
        wildcardDirectories?: MapLike<WatchDirectoryFlags>;
        compileOnSave?: boolean;
    }
    export const enum WatchDirectoryFlags {
        None = 0,
        Recursive = 1
    }
    export interface ConfigFileSpecs {
        filesSpecs: readonly string[] | undefined;
        /**
         * Present to report errors (user specified specs), validatedIncludeSpecs are used for file name matching
         */
        includeSpecs: readonly string[] | undefined;
        /**
         * Present to report errors (user specified specs), validatedExcludeSpecs are used for file name matching
         */
        excludeSpecs: readonly string[] | undefined;
        validatedFilesSpec: readonly string[] | undefined;
        validatedIncludeSpecs: readonly string[] | undefined;
        validatedExcludeSpecs: readonly string[] | undefined;
    }
    export type RequireResult<T = {}> = {
        module: T;
        modulePath?: string;
        error: undefined;
    } | {
        module: undefined;
        modulePath?: undefined;
        error: {
            stack?: string;
            message?: string;
        };
    };
    export interface CreateProgramOptions {
        rootNames: readonly string[];
        options: CompilerOptions;
        projectReferences?: readonly ProjectReference[];
        host?: CompilerHost;
        oldProgram?: Program;
        configFileParsingDiagnostics?: readonly Diagnostic[];
    }
    export interface CommandLineOptionBase {
        name: string;
        type: "string" | "number" | "boolean" | "object" | "list" | ESMap<string, number | string>;
        isFilePath?: boolean;
        shortName?: string;
        description?: DiagnosticMessage;
        paramType?: DiagnosticMessage;
        isTSConfigOnly?: boolean;
        isCommandLineOnly?: boolean;
        showInSimplifiedHelpView?: boolean;
        category?: DiagnosticMessage;
        strictFlag?: true;
        affectsSourceFile?: true;
        affectsModuleResolution?: true;
        affectsBindDiagnostics?: true;
        affectsSemanticDiagnostics?: true;
        affectsEmit?: true;
        transpileOptionValue?: boolean | undefined;
        extraValidation?: (value: CompilerOptionsValue) => [DiagnosticMessage, ...string[]] | undefined;
    }
    export interface CommandLineOptionOfPrimitiveType extends CommandLineOptionBase {
        type: "string" | "number" | "boolean";
    }
    export interface CommandLineOptionOfCustomType extends CommandLineOptionBase {
        type: ESMap<string, number | string>;
    }
    export interface DidYouMeanOptionsDiagnostics {
        optionDeclarations: CommandLineOption[];
        unknownOptionDiagnostic: DiagnosticMessage;
        unknownDidYouMeanDiagnostic: DiagnosticMessage;
    }
    export interface TsConfigOnlyOption extends CommandLineOptionBase {
        type: "object";
        elementOptions?: ESMap<string, CommandLineOption>;
        extraKeyDiagnostics?: DidYouMeanOptionsDiagnostics;
    }
    export interface CommandLineOptionOfListType extends CommandLineOptionBase {
        type: "list";
        element: CommandLineOptionOfCustomType | CommandLineOptionOfPrimitiveType | TsConfigOnlyOption;
    }
    export type CommandLineOption = CommandLineOptionOfCustomType | CommandLineOptionOfPrimitiveType | TsConfigOnlyOption | CommandLineOptionOfListType;
    export const enum CharacterCodes {
        nullCharacter = 0,
        maxAsciiCharacter = 127,
        lineFeed = 10,
        carriageReturn = 13,
        lineSeparator = 8232,
        paragraphSeparator = 8233,
        nextLine = 133,
        space = 32,
        nonBreakingSpace = 160,
        enQuad = 8192,
        emQuad = 8193,
        enSpace = 8194,
        emSpace = 8195,
        threePerEmSpace = 8196,
        fourPerEmSpace = 8197,
        sixPerEmSpace = 8198,
        figureSpace = 8199,
        punctuationSpace = 8200,
        thinSpace = 8201,
        hairSpace = 8202,
        zeroWidthSpace = 8203,
        narrowNoBreakSpace = 8239,
        ideographicSpace = 12288,
        mathematicalSpace = 8287,
        ogham = 5760,
        _ = 95,
        $ = 36,
        _0 = 48,
        _1 = 49,
        _2 = 50,
        _3 = 51,
        _4 = 52,
        _5 = 53,
        _6 = 54,
        _7 = 55,
        _8 = 56,
        _9 = 57,
        a = 97,
        b = 98,
        c = 99,
        d = 100,
        e = 101,
        f = 102,
        g = 103,
        h = 104,
        i = 105,
        j = 106,
        k = 107,
        l = 108,
        m = 109,
        n = 110,
        o = 111,
        p = 112,
        q = 113,
        r = 114,
        s = 115,
        t = 116,
        u = 117,
        v = 118,
        w = 119,
        x = 120,
        y = 121,
        z = 122,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        ampersand = 38,
        asterisk = 42,
        at = 64,
        backslash = 92,
        backtick = 96,
        bar = 124,
        caret = 94,
        closeBrace = 125,
        closeBracket = 93,
        closeParen = 41,
        colon = 58,
        comma = 44,
        dot = 46,
        doubleQuote = 34,
        equals = 61,
        exclamation = 33,
        greaterThan = 62,
        hash = 35,
        lessThan = 60,
        minus = 45,
        openBrace = 123,
        openBracket = 91,
        openParen = 40,
        percent = 37,
        plus = 43,
        question = 63,
        semicolon = 59,
        singleQuote = 39,
        slash = 47,
        tilde = 126,
        backspace = 8,
        formFeed = 12,
        byteOrderMark = 65279,
        tab = 9,
        verticalTab = 11
    }
    export interface ModuleResolutionHost {
        fileExists(fileName: string): boolean;
        readFile(fileName: string): string | undefined;
        trace?(s: string): void;
        directoryExists?(directoryName: string): boolean;
        /**
         * Resolve a symbolic link.
         * @see https://nodejs.org/api/fs.html#fs_fs_realpathsync_path_options
         */
        realpath?(path: string): string;
        getCurrentDirectory?(): string;
        getDirectories?(path: string): string[];
    }
    /**
     * Represents the result of module resolution.
     * Module resolution will pick up tsx/jsx/js files even if '--jsx' and '--allowJs' are turned off.
     * The Program will then filter results based on these flags.
     *
     * Prefer to return a `ResolvedModuleFull` so that the file type does not have to be inferred.
     */
    export interface ResolvedModule {
        /** Path of the file the module was resolved to. */
        resolvedFileName: string;
        /** True if `resolvedFileName` comes from `node_modules`. */
        isExternalLibraryImport?: boolean;
    }
    /**
     * ResolvedModule with an explicitly provided `extension` property.
     * Prefer this over `ResolvedModule`.
     * If changing this, remember to change `moduleResolutionIsEqualTo`.
     */
    export interface ResolvedModuleFull extends ResolvedModule {
        readonly originalPath?: string;
        /**
         * Extension of resolvedFileName. This must match what's at the end of resolvedFileName.
         * This is optional for backwards-compatibility, but will be added if not provided.
         */
        extension: Extension;
        packageId?: PackageId;
    }
    /**
     * Unique identifier with a package name and version.
     * If changing this, remember to change `packageIdIsEqual`.
     */
    export interface PackageId {
        /**
         * Name of the package.
         * Should not include `@types`.
         * If accessing a non-index file, this should include its name e.g. "foo/bar".
         */
        name: string;
        /**
         * Name of a submodule within this package.
         * May be "".
         */
        subModuleName: string;
        /** Version of the package, e.g. "1.2.3" */
        version: string;
    }
    export const enum Extension {
        Ts = ".ts",
        Tsx = ".tsx",
        Dts = ".d.ts",
        Js = ".js",
        Jsx = ".jsx",
        Json = ".json",
        TsBuildInfo = ".tsbuildinfo"
    }
    export interface ResolvedModuleWithFailedLookupLocations {
        readonly resolvedModule: ResolvedModuleFull | undefined;
        readonly failedLookupLocations: string[];
    }
    export interface ResolvedTypeReferenceDirective {
        primary: boolean;
        resolvedFileName: string | undefined;
        packageId?: PackageId;
        /** True if `resolvedFileName` comes from `node_modules`. */
        isExternalLibraryImport?: boolean;
    }
    export interface ResolvedTypeReferenceDirectiveWithFailedLookupLocations {
        readonly resolvedTypeReferenceDirective: ResolvedTypeReferenceDirective | undefined;
        readonly failedLookupLocations: string[];
    }
    export type HasInvalidatedResolution = (sourceFile: Path) => boolean;
    export type HasChangedAutomaticTypeDirectiveNames = () => boolean;
    export interface CompilerHost extends ModuleResolutionHost {
        getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): SourceFile | undefined;
        getSourceFileByPath?(fileName: string, path: Path, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): SourceFile | undefined;
        getCancellationToken?(): CancellationToken;
        getDefaultLibFileName(options: CompilerOptions): string;
        getDefaultLibLocation?(): string;
        writeFile: WriteFileCallback;
        getCurrentDirectory(): string;
        getCanonicalFileName(fileName: string): string;
        useCaseSensitiveFileNames(): boolean;
        getNewLine(): string;
        readDirectory?(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[], depth?: number): string[];
        resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
        /**
         * This method is a companion for 'resolveModuleNames' and is used to resolve 'types' references to actual type declaration files
         */
        resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
        getEnvironmentVariable?(name: string): string | undefined;
        onReleaseOldSourceFile?(oldSourceFile: SourceFile, oldOptions: CompilerOptions, hasSourceFileByPath: boolean): void;
        hasInvalidatedResolution?: HasInvalidatedResolution;
        hasChangedAutomaticTypeDirectiveNames?: HasChangedAutomaticTypeDirectiveNames;
        createHash?(data: string): string;
        getParsedCommandLine?(fileName: string): ParsedCommandLine | undefined;
        useSourceOfProjectReferenceRedirect?(): boolean;
        createDirectory?(directory: string): void;
        getSymlinkCache?(): SymlinkCache;
    }
    /** true if --out otherwise source file name */
    export type SourceOfProjectReferenceRedirect = string | true;
    export interface ResolvedProjectReferenceCallbacks {
        getSourceOfProjectReferenceRedirect(fileName: string): SourceOfProjectReferenceRedirect | undefined;
        forEachResolvedProjectReference<T>(cb: (resolvedProjectReference: ResolvedProjectReference) => T | undefined): T | undefined;
    }
    export const enum TransformFlags {
        None = 0,
        ContainsTypeScript = 1,
        ContainsJsx = 2,
        ContainsESNext = 4,
        ContainsES2020 = 8,
        ContainsES2019 = 16,
        ContainsES2018 = 32,
        ContainsES2017 = 64,
        ContainsES2016 = 128,
        ContainsES2015 = 256,
        ContainsGenerator = 512,
        ContainsDestructuringAssignment = 1024,
        ContainsTypeScriptClassSyntax = 2048,
        ContainsLexicalThis = 4096,
        ContainsRestOrSpread = 8192,
        ContainsObjectRestOrSpread = 16384,
        ContainsComputedPropertyName = 32768,
        ContainsBlockScopedBinding = 65536,
        ContainsBindingPattern = 131072,
        ContainsYield = 262144,
        ContainsAwait = 524288,
        ContainsHoistedDeclarationOrCompletion = 1048576,
        ContainsDynamicImport = 2097152,
        ContainsClassFields = 4194304,
        ContainsPossibleTopLevelAwait = 8388608,
        HasComputedFlags = 536870912,
        AssertTypeScript = 1,
        AssertJsx = 2,
        AssertESNext = 4,
        AssertES2020 = 8,
        AssertES2019 = 16,
        AssertES2018 = 32,
        AssertES2017 = 64,
        AssertES2016 = 128,
        AssertES2015 = 256,
        AssertGenerator = 512,
        AssertDestructuringAssignment = 1024,
        OuterExpressionExcludes = 536870912,
        PropertyAccessExcludes = 536870912,
        NodeExcludes = 536870912,
        ArrowFunctionExcludes = 547309568,
        FunctionExcludes = 547313664,
        ConstructorExcludes = 547311616,
        MethodOrAccessorExcludes = 538923008,
        PropertyExcludes = 536875008,
        ClassExcludes = 536905728,
        ModuleExcludes = 546379776,
        TypeExcludes = -2,
        ObjectLiteralExcludes = 536922112,
        ArrayLiteralOrCallOrNewExcludes = 536879104,
        VariableDeclarationListExcludes = 537018368,
        ParameterExcludes = 536870912,
        CatchClauseExcludes = 536887296,
        BindingPatternExcludes = 536879104,
        PropertyNamePropagatingFlags = 4096
    }
    export interface SourceMapRange extends TextRange {
        source?: SourceMapSource;
    }
    export interface SourceMapSource {
        fileName: string;
        text: string;
        lineMap: readonly number[];
        skipTrivia?: (pos: number) => number;
    }
    export interface EmitNode {
        annotatedNodes?: Node[];
        flags: EmitFlags;
        leadingComments?: SynthesizedComment[];
        trailingComments?: SynthesizedComment[];
        commentRange?: TextRange;
        sourceMapRange?: SourceMapRange;
        tokenSourceMapRanges?: (SourceMapRange | undefined)[];
        constantValue?: string | number;
        externalHelpersModuleName?: Identifier;
        externalHelpers?: boolean;
        helpers?: EmitHelper[];
        startsOnNewLine?: boolean;
    }
    export const enum EmitFlags {
        None = 0,
        SingleLine = 1,
        AdviseOnEmitNode = 2,
        NoSubstitution = 4,
        CapturesThis = 8,
        NoLeadingSourceMap = 16,
        NoTrailingSourceMap = 32,
        NoSourceMap = 48,
        NoNestedSourceMaps = 64,
        NoTokenLeadingSourceMaps = 128,
        NoTokenTrailingSourceMaps = 256,
        NoTokenSourceMaps = 384,
        NoLeadingComments = 512,
        NoTrailingComments = 1024,
        NoComments = 1536,
        NoNestedComments = 2048,
        HelperName = 4096,
        ExportName = 8192,
        LocalName = 16384,
        InternalName = 32768,
        Indented = 65536,
        NoIndentation = 131072,
        AsyncFunctionBody = 262144,
        ReuseTempVariableScope = 524288,
        CustomPrologue = 1048576,
        NoHoisting = 2097152,
        HasEndOfDeclarationMarker = 4194304,
        Iterator = 8388608,
        NoAsciiEscaping = 16777216,
        TypeScriptClassWrapper = 33554432,
        NeverApplyImportHelper = 67108864,
        IgnoreSourceNewlines = 134217728
    }
    export interface EmitHelper {
        readonly name: string;
        readonly scoped: boolean;
        readonly text: string | ((node: EmitHelperUniqueNameCallback) => string);
        readonly priority?: number;
        readonly dependencies?: EmitHelper[];
    }
    export interface UnscopedEmitHelper extends EmitHelper {
        readonly scoped: false;
        readonly importName?: string;
        readonly text: string;
    }
    export type UniqueNameHandler = (baseName: string, checkFn?: (name: string) => boolean, optimistic?: boolean) => string;
    export type EmitHelperUniqueNameCallback = (name: string) => string;
    /**
     * Used by the checker, this enum keeps track of external emit helpers that should be type
     * checked.
     */
    export const enum ExternalEmitHelpers {
        Extends = 1,
        Assign = 2,
        Rest = 4,
        Decorate = 8,
        Metadata = 16,
        Param = 32,
        Awaiter = 64,
        Generator = 128,
        Values = 256,
        Read = 512,
        SpreadArray = 1024,
        Await = 2048,
        AsyncGenerator = 4096,
        AsyncDelegator = 8192,
        AsyncValues = 16384,
        ExportStar = 32768,
        ImportStar = 65536,
        ImportDefault = 131072,
        MakeTemplateObject = 262144,
        ClassPrivateFieldGet = 524288,
        ClassPrivateFieldSet = 1048576,
        CreateBinding = 2097152,
        FirstEmitHelper = 1,
        LastEmitHelper = 2097152,
        ForOfIncludes = 256,
        ForAwaitOfIncludes = 16384,
        AsyncGeneratorIncludes = 6144,
        AsyncDelegatorIncludes = 26624,
        SpreadIncludes = 1536
    }
    export const enum EmitHint {
        SourceFile = 0,
        Expression = 1,
        IdentifierName = 2,
        MappedTypeParameter = 3,
        Unspecified = 4,
        EmbeddedStatement = 5,
        JsxAttributeValue = 6
    }
    export interface SourceFileMayBeEmittedHost {
        getCompilerOptions(): CompilerOptions;
        isSourceFileFromExternalLibrary(file: SourceFile): boolean;
        getResolvedProjectReferenceToRedirect(fileName: string): ResolvedProjectReference | undefined;
        isSourceOfProjectReferenceRedirect(fileName: string): boolean;
    }
    export interface EmitHost extends ScriptReferenceHost, ModuleSpecifierResolutionHost, SourceFileMayBeEmittedHost {
        getSourceFiles(): readonly SourceFile[];
        useCaseSensitiveFileNames(): boolean;
        getCurrentDirectory(): string;
        getLibFileFromReference(ref: FileReference): SourceFile | undefined;
        getCommonSourceDirectory(): string;
        getCanonicalFileName(fileName: string): string;
        getNewLine(): string;
        isEmitBlocked(emitFileName: string): boolean;
        getPrependNodes(): readonly (InputFiles | UnparsedSource)[];
        writeFile: WriteFileCallback;
        getProgramBuildInfo(): ProgramBuildInfo | undefined;
        getSourceFileFromReference: Program["getSourceFileFromReference"];
        readonly redirectTargetsMap: RedirectTargetsMap;
    }
    export interface PropertyDescriptorAttributes {
        enumerable?: boolean | Expression;
        configurable?: boolean | Expression;
        writable?: boolean | Expression;
        value?: Expression;
        get?: Expression;
        set?: Expression;
    }
    export const enum OuterExpressionKinds {
        Parentheses = 1,
        TypeAssertions = 2,
        NonNullAssertions = 4,
        PartiallyEmittedExpressions = 8,
        Assertions = 6,
        All = 15
    }
    export type OuterExpression = ParenthesizedExpression | TypeAssertion | AsExpression | NonNullExpression | PartiallyEmittedExpression;
    export type TypeOfTag = "undefined" | "number" | "bigint" | "boolean" | "string" | "symbol" | "object" | "function";
    export interface CallBinding {
        target: LeftHandSideExpression;
        thisArg: Expression;
    }
    export interface ParenthesizerRules {
        parenthesizeLeftSideOfBinary(binaryOperator: SyntaxKind, leftSide: Expression): Expression;
        parenthesizeRightSideOfBinary(binaryOperator: SyntaxKind, leftSide: Expression | undefined, rightSide: Expression): Expression;
        parenthesizeExpressionOfComputedPropertyName(expression: Expression): Expression;
        parenthesizeConditionOfConditionalExpression(condition: Expression): Expression;
        parenthesizeBranchOfConditionalExpression(branch: Expression): Expression;
        parenthesizeExpressionOfExportDefault(expression: Expression): Expression;
        parenthesizeExpressionOfNew(expression: Expression): LeftHandSideExpression;
        parenthesizeLeftSideOfAccess(expression: Expression): LeftHandSideExpression;
        parenthesizeOperandOfPostfixUnary(operand: Expression): LeftHandSideExpression;
        parenthesizeOperandOfPrefixUnary(operand: Expression): UnaryExpression;
        parenthesizeExpressionsOfCommaDelimitedList(elements: readonly Expression[]): NodeArray<Expression>;
        parenthesizeExpressionForDisallowedComma(expression: Expression): Expression;
        parenthesizeExpressionOfExpressionStatement(expression: Expression): Expression;
        parenthesizeConciseBodyOfArrowFunction(body: ConciseBody): ConciseBody;
        parenthesizeMemberOfConditionalType(member: TypeNode): TypeNode;
        parenthesizeMemberOfElementType(member: TypeNode): TypeNode;
        parenthesizeElementTypeOfArrayType(member: TypeNode): TypeNode;
        parenthesizeConstituentTypesOfUnionOrIntersectionType(members: readonly TypeNode[]): NodeArray<TypeNode>;
        parenthesizeTypeArguments(typeParameters: readonly TypeNode[] | undefined): NodeArray<TypeNode> | undefined;
    }
    export interface NodeConverters {
        convertToFunctionBlock(node: ConciseBody, multiLine?: boolean): Block;
        convertToFunctionExpression(node: FunctionDeclaration): FunctionExpression;
        convertToArrayAssignmentElement(element: ArrayBindingOrAssignmentElement): Expression;
        convertToObjectAssignmentElement(element: ObjectBindingOrAssignmentElement): ObjectLiteralElementLike;
        convertToAssignmentPattern(node: BindingOrAssignmentPattern): AssignmentPattern;
        convertToObjectAssignmentPattern(node: ObjectBindingOrAssignmentPattern): ObjectLiteralExpression;
        convertToArrayAssignmentPattern(node: ArrayBindingOrAssignmentPattern): ArrayLiteralExpression;
        convertToAssignmentElementTarget(node: BindingOrAssignmentElementTarget): Expression;
    }
    export interface NodeFactory {
        readonly parenthesizer: ParenthesizerRules;
        readonly converters: NodeConverters;
        createNodeArray<T extends Node>(elements?: readonly T[], hasTrailingComma?: boolean): NodeArray<T>;
        createNumericLiteral(value: string | number, numericLiteralFlags?: TokenFlags): NumericLiteral;
        createBigIntLiteral(value: string | PseudoBigInt): BigIntLiteral;
        createStringLiteral(text: string, isSingleQuote?: boolean): StringLiteral;
        createStringLiteral(text: string, isSingleQuote?: boolean, hasExtendedUnicodeEscape?: boolean): StringLiteral;
        createStringLiteralFromNode(sourceNode: PropertyNameLiteral, isSingleQuote?: boolean): StringLiteral;
        createRegularExpressionLiteral(text: string): RegularExpressionLiteral;
        createIdentifier(text: string): Identifier;
        createIdentifier(text: string, typeArguments?: readonly (TypeNode | TypeParameterDeclaration)[], originalKeywordKind?: SyntaxKind): Identifier;
        updateIdentifier(node: Identifier, typeArguments: NodeArray<TypeNode | TypeParameterDeclaration> | undefined): Identifier;
        /** Create a unique temporary variable. */
        createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined): Identifier;
        createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined, reservedInNestedScopes?: boolean): Identifier;
        /** Create a unique temporary variable for use in a loop. */
        createLoopVariable(): Identifier;
        /** Create a unique name based on the supplied text. */
        createUniqueName(text: string, flags?: GeneratedIdentifierFlags): Identifier;
        /** Create a unique name generated for a node. */
        getGeneratedNameForNode(node: Node | undefined): Identifier;
        getGeneratedNameForNode(node: Node | undefined, flags?: GeneratedIdentifierFlags): Identifier;
        createPrivateIdentifier(text: string): PrivateIdentifier;
        createToken(token: SyntaxKind.SuperKeyword): SuperExpression;
        createToken(token: SyntaxKind.ThisKeyword): ThisExpression;
        createToken(token: SyntaxKind.NullKeyword): NullLiteral;
        createToken(token: SyntaxKind.TrueKeyword): TrueLiteral;
        createToken(token: SyntaxKind.FalseKeyword): FalseLiteral;
        createToken<TKind extends PunctuationSyntaxKind>(token: TKind): PunctuationToken<TKind>;
        createToken<TKind extends KeywordTypeSyntaxKind>(token: TKind): KeywordTypeNode<TKind>;
        createToken<TKind extends ModifierSyntaxKind>(token: TKind): ModifierToken<TKind>;
        createToken<TKind extends KeywordSyntaxKind>(token: TKind): KeywordToken<TKind>;
        createToken<TKind extends SyntaxKind.Unknown | SyntaxKind.EndOfFileToken>(token: TKind): Token<TKind>;
        createToken<TKind extends SyntaxKind>(token: TKind): Token<TKind>;
        createSuper(): SuperExpression;
        createThis(): ThisExpression;
        createNull(): NullLiteral;
        createTrue(): TrueLiteral;
        createFalse(): FalseLiteral;
        createModifier<T extends ModifierSyntaxKind>(kind: T): ModifierToken<T>;
        createModifiersFromModifierFlags(flags: ModifierFlags): Modifier[];
        createQualifiedName(left: EntityName, right: string | Identifier): QualifiedName;
        updateQualifiedName(node: QualifiedName, left: EntityName, right: Identifier): QualifiedName;
        createComputedPropertyName(expression: Expression): ComputedPropertyName;
        updateComputedPropertyName(node: ComputedPropertyName, expression: Expression): ComputedPropertyName;
        createTypeParameterDeclaration(name: string | Identifier, constraint?: TypeNode, defaultType?: TypeNode): TypeParameterDeclaration;
        updateTypeParameterDeclaration(node: TypeParameterDeclaration, name: Identifier, constraint: TypeNode | undefined, defaultType: TypeNode | undefined): TypeParameterDeclaration;
        createParameterDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, dotDotDotToken: DotDotDotToken | undefined, name: string | BindingName, questionToken?: QuestionToken, type?: TypeNode, initializer?: Expression): ParameterDeclaration;
        updateParameterDeclaration(node: ParameterDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, dotDotDotToken: DotDotDotToken | undefined, name: string | BindingName, questionToken: QuestionToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): ParameterDeclaration;
        createDecorator(expression: Expression): Decorator;
        updateDecorator(node: Decorator, expression: Expression): Decorator;
        createPropertySignature(modifiers: readonly Modifier[] | undefined, name: PropertyName | string, questionToken: QuestionToken | undefined, type: TypeNode | undefined): PropertySignature;
        updatePropertySignature(node: PropertySignature, modifiers: readonly Modifier[] | undefined, name: PropertyName, questionToken: QuestionToken | undefined, type: TypeNode | undefined): PropertySignature;
        createPropertyDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | PropertyName, questionOrExclamationToken: QuestionToken | ExclamationToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): PropertyDeclaration;
        updatePropertyDeclaration(node: PropertyDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | PropertyName, questionOrExclamationToken: QuestionToken | ExclamationToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): PropertyDeclaration;
        createMethodSignature(modifiers: readonly Modifier[] | undefined, name: string | PropertyName, questionToken: QuestionToken | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): MethodSignature;
        updateMethodSignature(node: MethodSignature, modifiers: readonly Modifier[] | undefined, name: PropertyName, questionToken: QuestionToken | undefined, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): MethodSignature;
        createMethodDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, asteriskToken: AsteriskToken | undefined, name: string | PropertyName, questionToken: QuestionToken | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block | undefined): MethodDeclaration;
        updateMethodDeclaration(node: MethodDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, asteriskToken: AsteriskToken | undefined, name: PropertyName, questionToken: QuestionToken | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block | undefined): MethodDeclaration;
        createConstructorDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, parameters: readonly ParameterDeclaration[], body: Block | undefined): ConstructorDeclaration;
        updateConstructorDeclaration(node: ConstructorDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, parameters: readonly ParameterDeclaration[], body: Block | undefined): ConstructorDeclaration;
        createGetAccessorDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | PropertyName, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block | undefined): GetAccessorDeclaration;
        updateGetAccessorDeclaration(node: GetAccessorDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: PropertyName, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block | undefined): GetAccessorDeclaration;
        createSetAccessorDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | PropertyName, parameters: readonly ParameterDeclaration[], body: Block | undefined): SetAccessorDeclaration;
        updateSetAccessorDeclaration(node: SetAccessorDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: PropertyName, parameters: readonly ParameterDeclaration[], body: Block | undefined): SetAccessorDeclaration;
        createCallSignature(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): CallSignatureDeclaration;
        updateCallSignature(node: CallSignatureDeclaration, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): CallSignatureDeclaration;
        createConstructSignature(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): ConstructSignatureDeclaration;
        updateConstructSignature(node: ConstructSignatureDeclaration, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): ConstructSignatureDeclaration;
        createIndexSignature(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode): IndexSignatureDeclaration;
        createIndexSignature(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): IndexSignatureDeclaration;
        updateIndexSignature(node: IndexSignatureDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode): IndexSignatureDeclaration;
        createTemplateLiteralTypeSpan(type: TypeNode, literal: TemplateMiddle | TemplateTail): TemplateLiteralTypeSpan;
        updateTemplateLiteralTypeSpan(node: TemplateLiteralTypeSpan, type: TypeNode, literal: TemplateMiddle | TemplateTail): TemplateLiteralTypeSpan;
        createKeywordTypeNode<TKind extends KeywordTypeSyntaxKind>(kind: TKind): KeywordTypeNode<TKind>;
        createTypePredicateNode(assertsModifier: AssertsKeyword | undefined, parameterName: Identifier | ThisTypeNode | string, type: TypeNode | undefined): TypePredicateNode;
        updateTypePredicateNode(node: TypePredicateNode, assertsModifier: AssertsKeyword | undefined, parameterName: Identifier | ThisTypeNode, type: TypeNode | undefined): TypePredicateNode;
        createTypeReferenceNode(typeName: string | EntityName, typeArguments?: readonly TypeNode[]): TypeReferenceNode;
        updateTypeReferenceNode(node: TypeReferenceNode, typeName: EntityName, typeArguments: NodeArray<TypeNode> | undefined): TypeReferenceNode;
        createFunctionTypeNode(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode): FunctionTypeNode;
        updateFunctionTypeNode(node: FunctionTypeNode, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode): FunctionTypeNode;
        createConstructorTypeNode(modifiers: readonly Modifier[] | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode): ConstructorTypeNode;
        /** @deprecated */
        createConstructorTypeNode(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode): ConstructorTypeNode;
        updateConstructorTypeNode(node: ConstructorTypeNode, modifiers: readonly Modifier[] | undefined, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode): ConstructorTypeNode;
        /** @deprecated */
        updateConstructorTypeNode(node: ConstructorTypeNode, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode): ConstructorTypeNode;
        createTypeQueryNode(exprName: EntityName): TypeQueryNode;
        updateTypeQueryNode(node: TypeQueryNode, exprName: EntityName): TypeQueryNode;
        createTypeLiteralNode(members: readonly TypeElement[] | undefined): TypeLiteralNode;
        updateTypeLiteralNode(node: TypeLiteralNode, members: NodeArray<TypeElement>): TypeLiteralNode;
        createArrayTypeNode(elementType: TypeNode): ArrayTypeNode;
        updateArrayTypeNode(node: ArrayTypeNode, elementType: TypeNode): ArrayTypeNode;
        createTupleTypeNode(elements: readonly (TypeNode | NamedTupleMember)[]): TupleTypeNode;
        updateTupleTypeNode(node: TupleTypeNode, elements: readonly (TypeNode | NamedTupleMember)[]): TupleTypeNode;
        createNamedTupleMember(dotDotDotToken: DotDotDotToken | undefined, name: Identifier, questionToken: QuestionToken | undefined, type: TypeNode): NamedTupleMember;
        updateNamedTupleMember(node: NamedTupleMember, dotDotDotToken: DotDotDotToken | undefined, name: Identifier, questionToken: QuestionToken | undefined, type: TypeNode): NamedTupleMember;
        createOptionalTypeNode(type: TypeNode): OptionalTypeNode;
        updateOptionalTypeNode(node: OptionalTypeNode, type: TypeNode): OptionalTypeNode;
        createRestTypeNode(type: TypeNode): RestTypeNode;
        updateRestTypeNode(node: RestTypeNode, type: TypeNode): RestTypeNode;
        createUnionTypeNode(types: readonly TypeNode[]): UnionTypeNode;
        updateUnionTypeNode(node: UnionTypeNode, types: NodeArray<TypeNode>): UnionTypeNode;
        createIntersectionTypeNode(types: readonly TypeNode[]): IntersectionTypeNode;
        updateIntersectionTypeNode(node: IntersectionTypeNode, types: NodeArray<TypeNode>): IntersectionTypeNode;
        createConditionalTypeNode(checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode): ConditionalTypeNode;
        updateConditionalTypeNode(node: ConditionalTypeNode, checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode): ConditionalTypeNode;
        createInferTypeNode(typeParameter: TypeParameterDeclaration): InferTypeNode;
        updateInferTypeNode(node: InferTypeNode, typeParameter: TypeParameterDeclaration): InferTypeNode;
        createImportTypeNode(argument: TypeNode, qualifier?: EntityName, typeArguments?: readonly TypeNode[], isTypeOf?: boolean): ImportTypeNode;
        updateImportTypeNode(node: ImportTypeNode, argument: TypeNode, qualifier: EntityName | undefined, typeArguments: readonly TypeNode[] | undefined, isTypeOf?: boolean): ImportTypeNode;
        createParenthesizedType(type: TypeNode): ParenthesizedTypeNode;
        updateParenthesizedType(node: ParenthesizedTypeNode, type: TypeNode): ParenthesizedTypeNode;
        createThisTypeNode(): ThisTypeNode;
        createTypeOperatorNode(operator: SyntaxKind.KeyOfKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.ReadonlyKeyword, type: TypeNode): TypeOperatorNode;
        updateTypeOperatorNode(node: TypeOperatorNode, type: TypeNode): TypeOperatorNode;
        createIndexedAccessTypeNode(objectType: TypeNode, indexType: TypeNode): IndexedAccessTypeNode;
        updateIndexedAccessTypeNode(node: IndexedAccessTypeNode, objectType: TypeNode, indexType: TypeNode): IndexedAccessTypeNode;
        createMappedTypeNode(readonlyToken: ReadonlyKeyword | PlusToken | MinusToken | undefined, typeParameter: TypeParameterDeclaration, nameType: TypeNode | undefined, questionToken: QuestionToken | PlusToken | MinusToken | undefined, type: TypeNode | undefined): MappedTypeNode;
        updateMappedTypeNode(node: MappedTypeNode, readonlyToken: ReadonlyKeyword | PlusToken | MinusToken | undefined, typeParameter: TypeParameterDeclaration, nameType: TypeNode | undefined, questionToken: QuestionToken | PlusToken | MinusToken | undefined, type: TypeNode | undefined): MappedTypeNode;
        createLiteralTypeNode(literal: LiteralTypeNode["literal"]): LiteralTypeNode;
        updateLiteralTypeNode(node: LiteralTypeNode, literal: LiteralTypeNode["literal"]): LiteralTypeNode;
        createTemplateLiteralType(head: TemplateHead, templateSpans: readonly TemplateLiteralTypeSpan[]): TemplateLiteralTypeNode;
        updateTemplateLiteralType(node: TemplateLiteralTypeNode, head: TemplateHead, templateSpans: readonly TemplateLiteralTypeSpan[]): TemplateLiteralTypeNode;
        createObjectBindingPattern(elements: readonly BindingElement[]): ObjectBindingPattern;
        updateObjectBindingPattern(node: ObjectBindingPattern, elements: readonly BindingElement[]): ObjectBindingPattern;
        createArrayBindingPattern(elements: readonly ArrayBindingElement[]): ArrayBindingPattern;
        updateArrayBindingPattern(node: ArrayBindingPattern, elements: readonly ArrayBindingElement[]): ArrayBindingPattern;
        createBindingElement(dotDotDotToken: DotDotDotToken | undefined, propertyName: string | PropertyName | undefined, name: string | BindingName, initializer?: Expression): BindingElement;
        updateBindingElement(node: BindingElement, dotDotDotToken: DotDotDotToken | undefined, propertyName: PropertyName | undefined, name: BindingName, initializer: Expression | undefined): BindingElement;
        createArrayLiteralExpression(elements?: readonly Expression[], multiLine?: boolean): ArrayLiteralExpression;
        updateArrayLiteralExpression(node: ArrayLiteralExpression, elements: readonly Expression[]): ArrayLiteralExpression;
        createObjectLiteralExpression(properties?: readonly ObjectLiteralElementLike[], multiLine?: boolean): ObjectLiteralExpression;
        updateObjectLiteralExpression(node: ObjectLiteralExpression, properties: readonly ObjectLiteralElementLike[]): ObjectLiteralExpression;
        createPropertyAccessExpression(expression: Expression, name: string | Identifier | PrivateIdentifier): PropertyAccessExpression;
        updatePropertyAccessExpression(node: PropertyAccessExpression, expression: Expression, name: Identifier | PrivateIdentifier): PropertyAccessExpression;
        createPropertyAccessChain(expression: Expression, questionDotToken: QuestionDotToken | undefined, name: string | Identifier | PrivateIdentifier): PropertyAccessChain;
        updatePropertyAccessChain(node: PropertyAccessChain, expression: Expression, questionDotToken: QuestionDotToken | undefined, name: Identifier | PrivateIdentifier): PropertyAccessChain;
        createElementAccessExpression(expression: Expression, index: number | Expression): ElementAccessExpression;
        updateElementAccessExpression(node: ElementAccessExpression, expression: Expression, argumentExpression: Expression): ElementAccessExpression;
        createElementAccessChain(expression: Expression, questionDotToken: QuestionDotToken | undefined, index: number | Expression): ElementAccessChain;
        updateElementAccessChain(node: ElementAccessChain, expression: Expression, questionDotToken: QuestionDotToken | undefined, argumentExpression: Expression): ElementAccessChain;
        createCallExpression(expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined): CallExpression;
        updateCallExpression(node: CallExpression, expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[]): CallExpression;
        createCallChain(expression: Expression, questionDotToken: QuestionDotToken | undefined, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined): CallChain;
        updateCallChain(node: CallChain, expression: Expression, questionDotToken: QuestionDotToken | undefined, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[]): CallChain;
        createNewExpression(expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined): NewExpression;
        updateNewExpression(node: NewExpression, expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined): NewExpression;
        createTaggedTemplateExpression(tag: Expression, typeArguments: readonly TypeNode[] | undefined, template: TemplateLiteral): TaggedTemplateExpression;
        updateTaggedTemplateExpression(node: TaggedTemplateExpression, tag: Expression, typeArguments: readonly TypeNode[] | undefined, template: TemplateLiteral): TaggedTemplateExpression;
        createTypeAssertion(type: TypeNode, expression: Expression): TypeAssertion;
        updateTypeAssertion(node: TypeAssertion, type: TypeNode, expression: Expression): TypeAssertion;
        createParenthesizedExpression(expression: Expression): ParenthesizedExpression;
        updateParenthesizedExpression(node: ParenthesizedExpression, expression: Expression): ParenthesizedExpression;
        createFunctionExpression(modifiers: readonly Modifier[] | undefined, asteriskToken: AsteriskToken | undefined, name: string | Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[] | undefined, type: TypeNode | undefined, body: Block): FunctionExpression;
        updateFunctionExpression(node: FunctionExpression, modifiers: readonly Modifier[] | undefined, asteriskToken: AsteriskToken | undefined, name: Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block): FunctionExpression;
        createArrowFunction(modifiers: readonly Modifier[] | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, equalsGreaterThanToken: EqualsGreaterThanToken | undefined, body: ConciseBody): ArrowFunction;
        updateArrowFunction(node: ArrowFunction, modifiers: readonly Modifier[] | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, equalsGreaterThanToken: EqualsGreaterThanToken, body: ConciseBody): ArrowFunction;
        createDeleteExpression(expression: Expression): DeleteExpression;
        updateDeleteExpression(node: DeleteExpression, expression: Expression): DeleteExpression;
        createTypeOfExpression(expression: Expression): TypeOfExpression;
        updateTypeOfExpression(node: TypeOfExpression, expression: Expression): TypeOfExpression;
        createVoidExpression(expression: Expression): VoidExpression;
        updateVoidExpression(node: VoidExpression, expression: Expression): VoidExpression;
        createAwaitExpression(expression: Expression): AwaitExpression;
        updateAwaitExpression(node: AwaitExpression, expression: Expression): AwaitExpression;
        createPrefixUnaryExpression(operator: PrefixUnaryOperator, operand: Expression): PrefixUnaryExpression;
        updatePrefixUnaryExpression(node: PrefixUnaryExpression, operand: Expression): PrefixUnaryExpression;
        createPostfixUnaryExpression(operand: Expression, operator: PostfixUnaryOperator): PostfixUnaryExpression;
        updatePostfixUnaryExpression(node: PostfixUnaryExpression, operand: Expression): PostfixUnaryExpression;
        createBinaryExpression(left: Expression, operator: BinaryOperator | BinaryOperatorToken, right: Expression): BinaryExpression;
        updateBinaryExpression(node: BinaryExpression, left: Expression, operator: BinaryOperator | BinaryOperatorToken, right: Expression): BinaryExpression;
        createConditionalExpression(condition: Expression, questionToken: QuestionToken | undefined, whenTrue: Expression, colonToken: ColonToken | undefined, whenFalse: Expression): ConditionalExpression;
        updateConditionalExpression(node: ConditionalExpression, condition: Expression, questionToken: QuestionToken, whenTrue: Expression, colonToken: ColonToken, whenFalse: Expression): ConditionalExpression;
        createTemplateExpression(head: TemplateHead, templateSpans: readonly TemplateSpan[]): TemplateExpression;
        updateTemplateExpression(node: TemplateExpression, head: TemplateHead, templateSpans: readonly TemplateSpan[]): TemplateExpression;
        createTemplateHead(text: string, rawText?: string, templateFlags?: TokenFlags): TemplateHead;
        createTemplateHead(text: string | undefined, rawText: string, templateFlags?: TokenFlags): TemplateHead;
        createTemplateMiddle(text: string, rawText?: string, templateFlags?: TokenFlags): TemplateMiddle;
        createTemplateMiddle(text: string | undefined, rawText: string, templateFlags?: TokenFlags): TemplateMiddle;
        createTemplateTail(text: string, rawText?: string, templateFlags?: TokenFlags): TemplateTail;
        createTemplateTail(text: string | undefined, rawText: string, templateFlags?: TokenFlags): TemplateTail;
        createNoSubstitutionTemplateLiteral(text: string, rawText?: string): NoSubstitutionTemplateLiteral;
        createNoSubstitutionTemplateLiteral(text: string | undefined, rawText: string): NoSubstitutionTemplateLiteral;
        createLiteralLikeNode(kind: LiteralToken["kind"] | SyntaxKind.JsxTextAllWhiteSpaces, text: string): LiteralToken;
        createTemplateLiteralLikeNode(kind: TemplateLiteralToken["kind"], text: string, rawText: string, templateFlags: TokenFlags | undefined): TemplateLiteralLikeNode;
        createYieldExpression(asteriskToken: AsteriskToken, expression: Expression): YieldExpression;
        createYieldExpression(asteriskToken: undefined, expression: Expression | undefined): YieldExpression;
        createYieldExpression(asteriskToken: AsteriskToken | undefined, expression: Expression | undefined): YieldExpression;
        updateYieldExpression(node: YieldExpression, asteriskToken: AsteriskToken | undefined, expression: Expression | undefined): YieldExpression;
        createSpreadElement(expression: Expression): SpreadElement;
        updateSpreadElement(node: SpreadElement, expression: Expression): SpreadElement;
        createClassExpression(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, heritageClauses: readonly HeritageClause[] | undefined, members: readonly ClassElement[]): ClassExpression;
        updateClassExpression(node: ClassExpression, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, heritageClauses: readonly HeritageClause[] | undefined, members: readonly ClassElement[]): ClassExpression;
        createOmittedExpression(): OmittedExpression;
        createExpressionWithTypeArguments(expression: Expression, typeArguments: readonly TypeNode[] | undefined): ExpressionWithTypeArguments;
        updateExpressionWithTypeArguments(node: ExpressionWithTypeArguments, expression: Expression, typeArguments: readonly TypeNode[] | undefined): ExpressionWithTypeArguments;
        createAsExpression(expression: Expression, type: TypeNode): AsExpression;
        updateAsExpression(node: AsExpression, expression: Expression, type: TypeNode): AsExpression;
        createNonNullExpression(expression: Expression): NonNullExpression;
        updateNonNullExpression(node: NonNullExpression, expression: Expression): NonNullExpression;
        createNonNullChain(expression: Expression): NonNullChain;
        updateNonNullChain(node: NonNullChain, expression: Expression): NonNullChain;
        createMetaProperty(keywordToken: MetaProperty["keywordToken"], name: Identifier): MetaProperty;
        updateMetaProperty(node: MetaProperty, name: Identifier): MetaProperty;
        createTemplateSpan(expression: Expression, literal: TemplateMiddle | TemplateTail): TemplateSpan;
        updateTemplateSpan(node: TemplateSpan, expression: Expression, literal: TemplateMiddle | TemplateTail): TemplateSpan;
        createSemicolonClassElement(): SemicolonClassElement;
        createBlock(statements: readonly Statement[], multiLine?: boolean): Block;
        updateBlock(node: Block, statements: readonly Statement[]): Block;
        createVariableStatement(modifiers: readonly Modifier[] | undefined, declarationList: VariableDeclarationList | readonly VariableDeclaration[]): VariableStatement;
        updateVariableStatement(node: VariableStatement, modifiers: readonly Modifier[] | undefined, declarationList: VariableDeclarationList): VariableStatement;
        createEmptyStatement(): EmptyStatement;
        createExpressionStatement(expression: Expression): ExpressionStatement;
        updateExpressionStatement(node: ExpressionStatement, expression: Expression): ExpressionStatement;
        createIfStatement(expression: Expression, thenStatement: Statement, elseStatement?: Statement): IfStatement;
        updateIfStatement(node: IfStatement, expression: Expression, thenStatement: Statement, elseStatement: Statement | undefined): IfStatement;
        createDoStatement(statement: Statement, expression: Expression): DoStatement;
        updateDoStatement(node: DoStatement, statement: Statement, expression: Expression): DoStatement;
        createWhileStatement(expression: Expression, statement: Statement): WhileStatement;
        updateWhileStatement(node: WhileStatement, expression: Expression, statement: Statement): WhileStatement;
        createForStatement(initializer: ForInitializer | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Statement): ForStatement;
        updateForStatement(node: ForStatement, initializer: ForInitializer | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Statement): ForStatement;
        createForInStatement(initializer: ForInitializer, expression: Expression, statement: Statement): ForInStatement;
        updateForInStatement(node: ForInStatement, initializer: ForInitializer, expression: Expression, statement: Statement): ForInStatement;
        createForOfStatement(awaitModifier: AwaitKeyword | undefined, initializer: ForInitializer, expression: Expression, statement: Statement): ForOfStatement;
        updateForOfStatement(node: ForOfStatement, awaitModifier: AwaitKeyword | undefined, initializer: ForInitializer, expression: Expression, statement: Statement): ForOfStatement;
        createContinueStatement(label?: string | Identifier): ContinueStatement;
        updateContinueStatement(node: ContinueStatement, label: Identifier | undefined): ContinueStatement;
        createBreakStatement(label?: string | Identifier): BreakStatement;
        updateBreakStatement(node: BreakStatement, label: Identifier | undefined): BreakStatement;
        createReturnStatement(expression?: Expression): ReturnStatement;
        updateReturnStatement(node: ReturnStatement, expression: Expression | undefined): ReturnStatement;
        createWithStatement(expression: Expression, statement: Statement): WithStatement;
        updateWithStatement(node: WithStatement, expression: Expression, statement: Statement): WithStatement;
        createSwitchStatement(expression: Expression, caseBlock: CaseBlock): SwitchStatement;
        updateSwitchStatement(node: SwitchStatement, expression: Expression, caseBlock: CaseBlock): SwitchStatement;
        createLabeledStatement(label: string | Identifier, statement: Statement): LabeledStatement;
        updateLabeledStatement(node: LabeledStatement, label: Identifier, statement: Statement): LabeledStatement;
        createThrowStatement(expression: Expression): ThrowStatement;
        updateThrowStatement(node: ThrowStatement, expression: Expression): ThrowStatement;
        createTryStatement(tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined): TryStatement;
        updateTryStatement(node: TryStatement, tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined): TryStatement;
        createDebuggerStatement(): DebuggerStatement;
        createVariableDeclaration(name: string | BindingName, exclamationToken?: ExclamationToken, type?: TypeNode, initializer?: Expression): VariableDeclaration;
        updateVariableDeclaration(node: VariableDeclaration, name: BindingName, exclamationToken: ExclamationToken | undefined, type: TypeNode | undefined, initializer: Expression | undefined): VariableDeclaration;
        createVariableDeclarationList(declarations: readonly VariableDeclaration[], flags?: NodeFlags): VariableDeclarationList;
        updateVariableDeclarationList(node: VariableDeclarationList, declarations: readonly VariableDeclaration[]): VariableDeclarationList;
        createFunctionDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, asteriskToken: AsteriskToken | undefined, name: string | Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block | undefined): FunctionDeclaration;
        updateFunctionDeclaration(node: FunctionDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, asteriskToken: AsteriskToken | undefined, name: Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, body: Block | undefined): FunctionDeclaration;
        createClassDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, heritageClauses: readonly HeritageClause[] | undefined, members: readonly ClassElement[]): ClassDeclaration;
        updateClassDeclaration(node: ClassDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: Identifier | undefined, typeParameters: readonly TypeParameterDeclaration[] | undefined, heritageClauses: readonly HeritageClause[] | undefined, members: readonly ClassElement[]): ClassDeclaration;
        createInterfaceDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | Identifier, typeParameters: readonly TypeParameterDeclaration[] | undefined, heritageClauses: readonly HeritageClause[] | undefined, members: readonly TypeElement[]): InterfaceDeclaration;
        updateInterfaceDeclaration(node: InterfaceDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: Identifier, typeParameters: readonly TypeParameterDeclaration[] | undefined, heritageClauses: readonly HeritageClause[] | undefined, members: readonly TypeElement[]): InterfaceDeclaration;
        createTypeAliasDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | Identifier, typeParameters: readonly TypeParameterDeclaration[] | undefined, type: TypeNode): TypeAliasDeclaration;
        updateTypeAliasDeclaration(node: TypeAliasDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: Identifier, typeParameters: readonly TypeParameterDeclaration[] | undefined, type: TypeNode): TypeAliasDeclaration;
        createEnumDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | Identifier, members: readonly EnumMember[]): EnumDeclaration;
        updateEnumDeclaration(node: EnumDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: Identifier, members: readonly EnumMember[]): EnumDeclaration;
        createModuleDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: ModuleName, body: ModuleBody | undefined, flags?: NodeFlags): ModuleDeclaration;
        updateModuleDeclaration(node: ModuleDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: ModuleName, body: ModuleBody | undefined): ModuleDeclaration;
        createModuleBlock(statements: readonly Statement[]): ModuleBlock;
        updateModuleBlock(node: ModuleBlock, statements: readonly Statement[]): ModuleBlock;
        createCaseBlock(clauses: readonly CaseOrDefaultClause[]): CaseBlock;
        updateCaseBlock(node: CaseBlock, clauses: readonly CaseOrDefaultClause[]): CaseBlock;
        createNamespaceExportDeclaration(name: string | Identifier): NamespaceExportDeclaration;
        updateNamespaceExportDeclaration(node: NamespaceExportDeclaration, name: Identifier): NamespaceExportDeclaration;
        createImportEqualsDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, isTypeOnly: boolean, name: string | Identifier, moduleReference: ModuleReference): ImportEqualsDeclaration;
        updateImportEqualsDeclaration(node: ImportEqualsDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, isTypeOnly: boolean, name: Identifier, moduleReference: ModuleReference): ImportEqualsDeclaration;
        createImportDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, importClause: ImportClause | undefined, moduleSpecifier: Expression): ImportDeclaration;
        updateImportDeclaration(node: ImportDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, importClause: ImportClause | undefined, moduleSpecifier: Expression): ImportDeclaration;
        createImportClause(isTypeOnly: boolean, name: Identifier | undefined, namedBindings: NamedImportBindings | undefined): ImportClause;
        updateImportClause(node: ImportClause, isTypeOnly: boolean, name: Identifier | undefined, namedBindings: NamedImportBindings | undefined): ImportClause;
        createNamespaceImport(name: Identifier): NamespaceImport;
        updateNamespaceImport(node: NamespaceImport, name: Identifier): NamespaceImport;
        createNamespaceExport(name: Identifier): NamespaceExport;
        updateNamespaceExport(node: NamespaceExport, name: Identifier): NamespaceExport;
        createNamedImports(elements: readonly ImportSpecifier[]): NamedImports;
        updateNamedImports(node: NamedImports, elements: readonly ImportSpecifier[]): NamedImports;
        createImportSpecifier(propertyName: Identifier | undefined, name: Identifier): ImportSpecifier;
        updateImportSpecifier(node: ImportSpecifier, propertyName: Identifier | undefined, name: Identifier): ImportSpecifier;
        createExportAssignment(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, isExportEquals: boolean | undefined, expression: Expression): ExportAssignment;
        updateExportAssignment(node: ExportAssignment, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, expression: Expression): ExportAssignment;
        createExportDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, isTypeOnly: boolean, exportClause: NamedExportBindings | undefined, moduleSpecifier?: Expression): ExportDeclaration;
        updateExportDeclaration(node: ExportDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, isTypeOnly: boolean, exportClause: NamedExportBindings | undefined, moduleSpecifier: Expression | undefined): ExportDeclaration;
        createNamedExports(elements: readonly ExportSpecifier[]): NamedExports;
        updateNamedExports(node: NamedExports, elements: readonly ExportSpecifier[]): NamedExports;
        createExportSpecifier(propertyName: string | Identifier | undefined, name: string | Identifier): ExportSpecifier;
        updateExportSpecifier(node: ExportSpecifier, propertyName: Identifier | undefined, name: Identifier): ExportSpecifier;
        createMissingDeclaration(): MissingDeclaration;
        createExternalModuleReference(expression: Expression): ExternalModuleReference;
        updateExternalModuleReference(node: ExternalModuleReference, expression: Expression): ExternalModuleReference;
        createJSDocAllType(): JSDocAllType;
        createJSDocUnknownType(): JSDocUnknownType;
        createJSDocNonNullableType(type: TypeNode): JSDocNonNullableType;
        updateJSDocNonNullableType(node: JSDocNonNullableType, type: TypeNode): JSDocNonNullableType;
        createJSDocNullableType(type: TypeNode): JSDocNullableType;
        updateJSDocNullableType(node: JSDocNullableType, type: TypeNode): JSDocNullableType;
        createJSDocOptionalType(type: TypeNode): JSDocOptionalType;
        updateJSDocOptionalType(node: JSDocOptionalType, type: TypeNode): JSDocOptionalType;
        createJSDocFunctionType(parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): JSDocFunctionType;
        updateJSDocFunctionType(node: JSDocFunctionType, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined): JSDocFunctionType;
        createJSDocVariadicType(type: TypeNode): JSDocVariadicType;
        updateJSDocVariadicType(node: JSDocVariadicType, type: TypeNode): JSDocVariadicType;
        createJSDocNamepathType(type: TypeNode): JSDocNamepathType;
        updateJSDocNamepathType(node: JSDocNamepathType, type: TypeNode): JSDocNamepathType;
        createJSDocTypeExpression(type: TypeNode): JSDocTypeExpression;
        updateJSDocTypeExpression(node: JSDocTypeExpression, type: TypeNode): JSDocTypeExpression;
        createJSDocNameReference(name: EntityName): JSDocNameReference;
        updateJSDocNameReference(node: JSDocNameReference, name: EntityName): JSDocNameReference;
        createJSDocTypeLiteral(jsDocPropertyTags?: readonly JSDocPropertyLikeTag[], isArrayType?: boolean): JSDocTypeLiteral;
        updateJSDocTypeLiteral(node: JSDocTypeLiteral, jsDocPropertyTags: readonly JSDocPropertyLikeTag[] | undefined, isArrayType: boolean | undefined): JSDocTypeLiteral;
        createJSDocSignature(typeParameters: readonly JSDocTemplateTag[] | undefined, parameters: readonly JSDocParameterTag[], type?: JSDocReturnTag): JSDocSignature;
        updateJSDocSignature(node: JSDocSignature, typeParameters: readonly JSDocTemplateTag[] | undefined, parameters: readonly JSDocParameterTag[], type: JSDocReturnTag | undefined): JSDocSignature;
        createJSDocTemplateTag(tagName: Identifier | undefined, constraint: JSDocTypeExpression | undefined, typeParameters: readonly TypeParameterDeclaration[], comment?: string): JSDocTemplateTag;
        updateJSDocTemplateTag(node: JSDocTemplateTag, tagName: Identifier | undefined, constraint: JSDocTypeExpression | undefined, typeParameters: readonly TypeParameterDeclaration[], comment: string | undefined): JSDocTemplateTag;
        createJSDocTypedefTag(tagName: Identifier | undefined, typeExpression?: JSDocTypeExpression | JSDocTypeLiteral, fullName?: Identifier | JSDocNamespaceDeclaration, comment?: string): JSDocTypedefTag;
        updateJSDocTypedefTag(node: JSDocTypedefTag, tagName: Identifier | undefined, typeExpression: JSDocTypeExpression | JSDocTypeLiteral | undefined, fullName: Identifier | JSDocNamespaceDeclaration | undefined, comment: string | undefined): JSDocTypedefTag;
        createJSDocParameterTag(tagName: Identifier | undefined, name: EntityName, isBracketed: boolean, typeExpression?: JSDocTypeExpression, isNameFirst?: boolean, comment?: string): JSDocParameterTag;
        updateJSDocParameterTag(node: JSDocParameterTag, tagName: Identifier | undefined, name: EntityName, isBracketed: boolean, typeExpression: JSDocTypeExpression | undefined, isNameFirst: boolean, comment: string | undefined): JSDocParameterTag;
        createJSDocPropertyTag(tagName: Identifier | undefined, name: EntityName, isBracketed: boolean, typeExpression?: JSDocTypeExpression, isNameFirst?: boolean, comment?: string): JSDocPropertyTag;
        updateJSDocPropertyTag(node: JSDocPropertyTag, tagName: Identifier | undefined, name: EntityName, isBracketed: boolean, typeExpression: JSDocTypeExpression | undefined, isNameFirst: boolean, comment: string | undefined): JSDocPropertyTag;
        createJSDocTypeTag(tagName: Identifier | undefined, typeExpression: JSDocTypeExpression, comment?: string): JSDocTypeTag;
        updateJSDocTypeTag(node: JSDocTypeTag, tagName: Identifier | undefined, typeExpression: JSDocTypeExpression, comment: string | undefined): JSDocTypeTag;
        createJSDocSeeTag(tagName: Identifier | undefined, nameExpression: JSDocNameReference | undefined, comment?: string): JSDocSeeTag;
        updateJSDocSeeTag(node: JSDocSeeTag, tagName: Identifier | undefined, nameExpression: JSDocNameReference | undefined, comment?: string): JSDocSeeTag;
        createJSDocReturnTag(tagName: Identifier | undefined, typeExpression?: JSDocTypeExpression, comment?: string): JSDocReturnTag;
        updateJSDocReturnTag(node: JSDocReturnTag, tagName: Identifier | undefined, typeExpression: JSDocTypeExpression | undefined, comment: string | undefined): JSDocReturnTag;
        createJSDocThisTag(tagName: Identifier | undefined, typeExpression: JSDocTypeExpression, comment?: string): JSDocThisTag;
        updateJSDocThisTag(node: JSDocThisTag, tagName: Identifier | undefined, typeExpression: JSDocTypeExpression | undefined, comment: string | undefined): JSDocThisTag;
        createJSDocEnumTag(tagName: Identifier | undefined, typeExpression: JSDocTypeExpression, comment?: string): JSDocEnumTag;
        updateJSDocEnumTag(node: JSDocEnumTag, tagName: Identifier | undefined, typeExpression: JSDocTypeExpression, comment: string | undefined): JSDocEnumTag;
        createJSDocCallbackTag(tagName: Identifier | undefined, typeExpression: JSDocSignature, fullName?: Identifier | JSDocNamespaceDeclaration, comment?: string): JSDocCallbackTag;
        updateJSDocCallbackTag(node: JSDocCallbackTag, tagName: Identifier | undefined, typeExpression: JSDocSignature, fullName: Identifier | JSDocNamespaceDeclaration | undefined, comment: string | undefined): JSDocCallbackTag;
        createJSDocAugmentsTag(tagName: Identifier | undefined, className: JSDocAugmentsTag["class"], comment?: string): JSDocAugmentsTag;
        updateJSDocAugmentsTag(node: JSDocAugmentsTag, tagName: Identifier | undefined, className: JSDocAugmentsTag["class"], comment: string | undefined): JSDocAugmentsTag;
        createJSDocImplementsTag(tagName: Identifier | undefined, className: JSDocImplementsTag["class"], comment?: string): JSDocImplementsTag;
        updateJSDocImplementsTag(node: JSDocImplementsTag, tagName: Identifier | undefined, className: JSDocImplementsTag["class"], comment: string | undefined): JSDocImplementsTag;
        createJSDocAuthorTag(tagName: Identifier | undefined, comment?: string): JSDocAuthorTag;
        updateJSDocAuthorTag(node: JSDocAuthorTag, tagName: Identifier | undefined, comment: string | undefined): JSDocAuthorTag;
        createJSDocClassTag(tagName: Identifier | undefined, comment?: string): JSDocClassTag;
        updateJSDocClassTag(node: JSDocClassTag, tagName: Identifier | undefined, comment: string | undefined): JSDocClassTag;
        createJSDocPublicTag(tagName: Identifier | undefined, comment?: string): JSDocPublicTag;
        updateJSDocPublicTag(node: JSDocPublicTag, tagName: Identifier | undefined, comment: string | undefined): JSDocPublicTag;
        createJSDocPrivateTag(tagName: Identifier | undefined, comment?: string): JSDocPrivateTag;
        updateJSDocPrivateTag(node: JSDocPrivateTag, tagName: Identifier | undefined, comment: string | undefined): JSDocPrivateTag;
        createJSDocProtectedTag(tagName: Identifier | undefined, comment?: string): JSDocProtectedTag;
        updateJSDocProtectedTag(node: JSDocProtectedTag, tagName: Identifier | undefined, comment: string | undefined): JSDocProtectedTag;
        createJSDocReadonlyTag(tagName: Identifier | undefined, comment?: string): JSDocReadonlyTag;
        updateJSDocReadonlyTag(node: JSDocReadonlyTag, tagName: Identifier | undefined, comment: string | undefined): JSDocReadonlyTag;
        createJSDocUnknownTag(tagName: Identifier, comment?: string): JSDocUnknownTag;
        updateJSDocUnknownTag(node: JSDocUnknownTag, tagName: Identifier, comment: string | undefined): JSDocUnknownTag;
        createJSDocDeprecatedTag(tagName: Identifier, comment?: string): JSDocDeprecatedTag;
        updateJSDocDeprecatedTag(node: JSDocDeprecatedTag, tagName: Identifier, comment?: string): JSDocDeprecatedTag;
        createJSDocComment(comment?: string | undefined, tags?: readonly JSDocTag[] | undefined): JSDoc;
        updateJSDocComment(node: JSDoc, comment: string | undefined, tags: readonly JSDocTag[] | undefined): JSDoc;
        createJsxElement(openingElement: JsxOpeningElement, children: readonly JsxChild[], closingElement: JsxClosingElement): JsxElement;
        updateJsxElement(node: JsxElement, openingElement: JsxOpeningElement, children: readonly JsxChild[], closingElement: JsxClosingElement): JsxElement;
        createJsxSelfClosingElement(tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes): JsxSelfClosingElement;
        updateJsxSelfClosingElement(node: JsxSelfClosingElement, tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes): JsxSelfClosingElement;
        createJsxOpeningElement(tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes): JsxOpeningElement;
        updateJsxOpeningElement(node: JsxOpeningElement, tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes): JsxOpeningElement;
        createJsxClosingElement(tagName: JsxTagNameExpression): JsxClosingElement;
        updateJsxClosingElement(node: JsxClosingElement, tagName: JsxTagNameExpression): JsxClosingElement;
        createJsxFragment(openingFragment: JsxOpeningFragment, children: readonly JsxChild[], closingFragment: JsxClosingFragment): JsxFragment;
        createJsxText(text: string, containsOnlyTriviaWhiteSpaces?: boolean): JsxText;
        updateJsxText(node: JsxText, text: string, containsOnlyTriviaWhiteSpaces?: boolean): JsxText;
        createJsxOpeningFragment(): JsxOpeningFragment;
        createJsxJsxClosingFragment(): JsxClosingFragment;
        updateJsxFragment(node: JsxFragment, openingFragment: JsxOpeningFragment, children: readonly JsxChild[], closingFragment: JsxClosingFragment): JsxFragment;
        createJsxAttribute(name: Identifier, initializer: StringLiteral | JsxExpression | undefined): JsxAttribute;
        updateJsxAttribute(node: JsxAttribute, name: Identifier, initializer: StringLiteral | JsxExpression | undefined): JsxAttribute;
        createJsxAttributes(properties: readonly JsxAttributeLike[]): JsxAttributes;
        updateJsxAttributes(node: JsxAttributes, properties: readonly JsxAttributeLike[]): JsxAttributes;
        createJsxSpreadAttribute(expression: Expression): JsxSpreadAttribute;
        updateJsxSpreadAttribute(node: JsxSpreadAttribute, expression: Expression): JsxSpreadAttribute;
        createJsxExpression(dotDotDotToken: DotDotDotToken | undefined, expression: Expression | undefined): JsxExpression;
        updateJsxExpression(node: JsxExpression, expression: Expression | undefined): JsxExpression;
        createCaseClause(expression: Expression, statements: readonly Statement[]): CaseClause;
        updateCaseClause(node: CaseClause, expression: Expression, statements: readonly Statement[]): CaseClause;
        createDefaultClause(statements: readonly Statement[]): DefaultClause;
        updateDefaultClause(node: DefaultClause, statements: readonly Statement[]): DefaultClause;
        createHeritageClause(token: HeritageClause["token"], types: readonly ExpressionWithTypeArguments[]): HeritageClause;
        updateHeritageClause(node: HeritageClause, types: readonly ExpressionWithTypeArguments[]): HeritageClause;
        createCatchClause(variableDeclaration: string | VariableDeclaration | undefined, block: Block): CatchClause;
        updateCatchClause(node: CatchClause, variableDeclaration: VariableDeclaration | undefined, block: Block): CatchClause;
        createPropertyAssignment(name: string | PropertyName, initializer: Expression): PropertyAssignment;
        updatePropertyAssignment(node: PropertyAssignment, name: PropertyName, initializer: Expression): PropertyAssignment;
        createShorthandPropertyAssignment(name: string | Identifier, objectAssignmentInitializer?: Expression): ShorthandPropertyAssignment;
        updateShorthandPropertyAssignment(node: ShorthandPropertyAssignment, name: Identifier, objectAssignmentInitializer: Expression | undefined): ShorthandPropertyAssignment;
        createSpreadAssignment(expression: Expression): SpreadAssignment;
        updateSpreadAssignment(node: SpreadAssignment, expression: Expression): SpreadAssignment;
        createEnumMember(name: string | PropertyName, initializer?: Expression): EnumMember;
        updateEnumMember(node: EnumMember, name: PropertyName, initializer: Expression | undefined): EnumMember;
        createSourceFile(statements: readonly Statement[], endOfFileToken: EndOfFileToken, flags: NodeFlags): SourceFile;
        updateSourceFile(node: SourceFile, statements: readonly Statement[], isDeclarationFile?: boolean, referencedFiles?: readonly FileReference[], typeReferences?: readonly FileReference[], hasNoDefaultLib?: boolean, libReferences?: readonly FileReference[]): SourceFile;
        createUnparsedSource(prologues: readonly UnparsedPrologue[], syntheticReferences: readonly UnparsedSyntheticReference[] | undefined, texts: readonly UnparsedSourceText[]): UnparsedSource;
        createUnparsedPrologue(data?: string): UnparsedPrologue;
        createUnparsedPrepend(data: string | undefined, texts: readonly UnparsedSourceText[]): UnparsedPrepend;
        createUnparsedTextLike(data: string | undefined, internal: boolean): UnparsedTextLike;
        createUnparsedSyntheticReference(section: BundleFileHasNoDefaultLib | BundleFileReference): UnparsedSyntheticReference;
        createInputFiles(): InputFiles;
        createSyntheticExpression(type: Type, isSpread?: boolean, tupleNameSource?: ParameterDeclaration | NamedTupleMember): SyntheticExpression;
        createSyntaxList(children: Node[]): SyntaxList;
        createNotEmittedStatement(original: Node): NotEmittedStatement;
        createEndOfDeclarationMarker(original: Node): EndOfDeclarationMarker;
        createMergeDeclarationMarker(original: Node): MergeDeclarationMarker;
        createPartiallyEmittedExpression(expression: Expression, original?: Node): PartiallyEmittedExpression;
        updatePartiallyEmittedExpression(node: PartiallyEmittedExpression, expression: Expression): PartiallyEmittedExpression;
        createSyntheticReferenceExpression(expression: Expression, thisArg: Expression): SyntheticReferenceExpression;
        updateSyntheticReferenceExpression(node: SyntheticReferenceExpression, expression: Expression, thisArg: Expression): SyntheticReferenceExpression;
        createCommaListExpression(elements: readonly Expression[]): CommaListExpression;
        updateCommaListExpression(node: CommaListExpression, elements: readonly Expression[]): CommaListExpression;
        createBundle(sourceFiles: readonly SourceFile[], prepends?: readonly (UnparsedSource | InputFiles)[]): Bundle;
        updateBundle(node: Bundle, sourceFiles: readonly SourceFile[], prepends?: readonly (UnparsedSource | InputFiles)[]): Bundle;
        createComma(left: Expression, right: Expression): BinaryExpression;
        createAssignment(left: ObjectLiteralExpression | ArrayLiteralExpression, right: Expression): DestructuringAssignment;
        createAssignment(left: Expression, right: Expression): AssignmentExpression<EqualsToken>;
        createLogicalOr(left: Expression, right: Expression): BinaryExpression;
        createLogicalAnd(left: Expression, right: Expression): BinaryExpression;
        createBitwiseOr(left: Expression, right: Expression): BinaryExpression;
        createBitwiseXor(left: Expression, right: Expression): BinaryExpression;
        createBitwiseAnd(left: Expression, right: Expression): BinaryExpression;
        createStrictEquality(left: Expression, right: Expression): BinaryExpression;
        createStrictInequality(left: Expression, right: Expression): BinaryExpression;
        createEquality(left: Expression, right: Expression): BinaryExpression;
        createInequality(left: Expression, right: Expression): BinaryExpression;
        createLessThan(left: Expression, right: Expression): BinaryExpression;
        createLessThanEquals(left: Expression, right: Expression): BinaryExpression;
        createGreaterThan(left: Expression, right: Expression): BinaryExpression;
        createGreaterThanEquals(left: Expression, right: Expression): BinaryExpression;
        createLeftShift(left: Expression, right: Expression): BinaryExpression;
        createRightShift(left: Expression, right: Expression): BinaryExpression;
        createUnsignedRightShift(left: Expression, right: Expression): BinaryExpression;
        createAdd(left: Expression, right: Expression): BinaryExpression;
        createSubtract(left: Expression, right: Expression): BinaryExpression;
        createMultiply(left: Expression, right: Expression): BinaryExpression;
        createDivide(left: Expression, right: Expression): BinaryExpression;
        createModulo(left: Expression, right: Expression): BinaryExpression;
        createExponent(left: Expression, right: Expression): BinaryExpression;
        createPrefixPlus(operand: Expression): PrefixUnaryExpression;
        createPrefixMinus(operand: Expression): PrefixUnaryExpression;
        createPrefixIncrement(operand: Expression): PrefixUnaryExpression;
        createPrefixDecrement(operand: Expression): PrefixUnaryExpression;
        createBitwiseNot(operand: Expression): PrefixUnaryExpression;
        createLogicalNot(operand: Expression): PrefixUnaryExpression;
        createPostfixIncrement(operand: Expression): PostfixUnaryExpression;
        createPostfixDecrement(operand: Expression): PostfixUnaryExpression;
        createImmediatelyInvokedFunctionExpression(statements: readonly Statement[]): CallExpression;
        createImmediatelyInvokedFunctionExpression(statements: readonly Statement[], param: ParameterDeclaration, paramValue: Expression): CallExpression;
        createImmediatelyInvokedArrowFunction(statements: readonly Statement[]): CallExpression;
        createImmediatelyInvokedArrowFunction(statements: readonly Statement[], param: ParameterDeclaration, paramValue: Expression): CallExpression;
        createVoidZero(): VoidExpression;
        createExportDefault(expression: Expression): ExportAssignment;
        createExternalModuleExport(exportName: Identifier): ExportDeclaration;
        createTypeCheck(value: Expression, tag: TypeOfTag): Expression;
        createMethodCall(object: Expression, methodName: string | Identifier, argumentsList: readonly Expression[]): CallExpression;
        createGlobalMethodCall(globalObjectName: string, globalMethodName: string, argumentsList: readonly Expression[]): CallExpression;
        createFunctionBindCall(target: Expression, thisArg: Expression, argumentsList: readonly Expression[]): CallExpression;
        createFunctionCallCall(target: Expression, thisArg: Expression, argumentsList: readonly Expression[]): CallExpression;
        createFunctionApplyCall(target: Expression, thisArg: Expression, argumentsExpression: Expression): CallExpression;
        createObjectDefinePropertyCall(target: Expression, propertyName: string | Expression, attributes: Expression): CallExpression;
        createPropertyDescriptor(attributes: PropertyDescriptorAttributes, singleLine?: boolean): ObjectLiteralExpression;
        createArraySliceCall(array: Expression, start?: number | Expression): CallExpression;
        createArrayConcatCall(array: Expression, values: readonly Expression[]): CallExpression;
        createCallBinding(expression: Expression, recordTempVariable: (temp: Identifier) => void, languageVersion?: ScriptTarget, cacheIdentifiers?: boolean): CallBinding;
        inlineExpressions(expressions: readonly Expression[]): Expression;
        /**
         * Gets the internal name of a declaration. This is primarily used for declarations that can be
         * referred to by name in the body of an ES5 class function body. An internal name will *never*
         * be prefixed with an module or namespace export modifier like "exports." when emitted as an
         * expression. An internal name will also *never* be renamed due to a collision with a block
         * scoped variable.
         *
         * @param node The declaration.
         * @param allowComments A value indicating whether comments may be emitted for the name.
         * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
         */
        getInternalName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
        /**
         * Gets the local name of a declaration. This is primarily used for declarations that can be
         * referred to by name in the declaration's immediate scope (classes, enums, namespaces). A
         * local name will *never* be prefixed with an module or namespace export modifier like
         * "exports." when emitted as an expression.
         *
         * @param node The declaration.
         * @param allowComments A value indicating whether comments may be emitted for the name.
         * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
         */
        getLocalName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
        /**
         * Gets the export name of a declaration. This is primarily used for declarations that can be
         * referred to by name in the declaration's immediate scope (classes, enums, namespaces). An
         * export name will *always* be prefixed with a module or namespace export modifier like
         * `"exports."` when emitted as an expression if the name points to an exported symbol.
         *
         * @param node The declaration.
         * @param allowComments A value indicating whether comments may be emitted for the name.
         * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
         */
        getExportName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
        /**
         * Gets the name of a declaration for use in declarations.
         *
         * @param node The declaration.
         * @param allowComments A value indicating whether comments may be emitted for the name.
         * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
         */
        getDeclarationName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier;
        /**
         * Gets a namespace-qualified name for use in expressions.
         *
         * @param ns The namespace identifier.
         * @param name The name.
         * @param allowComments A value indicating whether comments may be emitted for the name.
         * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
         */
        getNamespaceMemberName(ns: Identifier, name: Identifier, allowComments?: boolean, allowSourceMaps?: boolean): PropertyAccessExpression;
        /**
         * Gets the exported name of a declaration for use in expressions.
         *
         * An exported name will *always* be prefixed with an module or namespace export modifier like
         * "exports." if the name points to an exported symbol.
         *
         * @param ns The namespace identifier.
         * @param node The declaration.
         * @param allowComments A value indicating whether comments may be emitted for the name.
         * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
         */
        getExternalModuleOrNamespaceExportName(ns: Identifier | undefined, node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier | PropertyAccessExpression;
        restoreOuterExpressions(outerExpression: Expression | undefined, innerExpression: Expression, kinds?: OuterExpressionKinds): Expression;
        restoreEnclosingLabel(node: Statement, outermostLabeledStatement: LabeledStatement | undefined, afterRestoreLabelCallback?: (node: LabeledStatement) => void): Statement;
        createUseStrictPrologue(): PrologueDirective;
        /**
         * Copies any necessary standard and custom prologue-directives into target array.
         * @param source origin statements array
         * @param target result statements array
         * @param ensureUseStrict boolean determining whether the function need to add prologue-directives
         * @param visitor Optional callback used to visit any custom prologue directives.
         */
        copyPrologue(source: readonly Statement[], target: Push<Statement>, ensureUseStrict?: boolean, visitor?: (node: Node) => VisitResult<Node>): number;
        /**
         * Copies only the standard (string-expression) prologue-directives into the target statement-array.
         * @param source origin statements array
         * @param target result statements array
         * @param ensureUseStrict boolean determining whether the function need to add prologue-directives
         */
        copyStandardPrologue(source: readonly Statement[], target: Push<Statement>, ensureUseStrict?: boolean): number;
        /**
         * Copies only the custom prologue-directives into target statement-array.
         * @param source origin statements array
         * @param target result statements array
         * @param statementOffset The offset at which to begin the copy.
         * @param visitor Optional callback used to visit any custom prologue directives.
         */
        copyCustomPrologue(source: readonly Statement[], target: Push<Statement>, statementOffset: number, visitor?: (node: Node) => VisitResult<Node>, filter?: (node: Node) => boolean): number;
        copyCustomPrologue(source: readonly Statement[], target: Push<Statement>, statementOffset: number | undefined, visitor?: (node: Node) => VisitResult<Node>, filter?: (node: Node) => boolean): number | undefined;
        ensureUseStrict(statements: NodeArray<Statement>): NodeArray<Statement>;
        liftToBlock(nodes: readonly Node[]): Statement;
        /**
         * Merges generated lexical declarations into a new statement list.
         */
        mergeLexicalEnvironment(statements: NodeArray<Statement>, declarations: readonly Statement[] | undefined): NodeArray<Statement>;
        /**
         * Appends generated lexical declarations to an array of statements.
         */
        mergeLexicalEnvironment(statements: Statement[], declarations: readonly Statement[] | undefined): Statement[];
        /**
         * Creates a shallow, memberwise clone of a node.
         * - The result will have its `original` pointer set to `node`.
         * - The result will have its `pos` and `end` set to `-1`.
         * - *DO NOT USE THIS* if a more appropriate function is available.
         */
        cloneNode<T extends Node | undefined>(node: T): T;
        updateModifiers<T extends HasModifiers>(node: T, modifiers: readonly Modifier[] | ModifierFlags): T;
    }
    export const enum LexicalEnvironmentFlags {
        None = 0,
        InParameters = 1,
        VariablesHoistedInParameters = 2
    }
    export interface CoreTransformationContext {
        readonly factory: NodeFactory;
        /** Gets the compiler options supplied to the transformer. */
        getCompilerOptions(): CompilerOptions;
        /** Starts a new lexical environment. */
        startLexicalEnvironment(): void;
        setLexicalEnvironmentFlags(flags: LexicalEnvironmentFlags, value: boolean): void;
        getLexicalEnvironmentFlags(): LexicalEnvironmentFlags;
        /** Suspends the current lexical environment, usually after visiting a parameter list. */
        suspendLexicalEnvironment(): void;
        /** Resumes a suspended lexical environment, usually before visiting a function body. */
        resumeLexicalEnvironment(): void;
        /** Ends a lexical environment, returning any declarations. */
        endLexicalEnvironment(): Statement[] | undefined;
        /** Hoists a function declaration to the containing scope. */
        hoistFunctionDeclaration(node: FunctionDeclaration): void;
        /** Hoists a variable declaration to the containing scope. */
        hoistVariableDeclaration(node: Identifier): void;
        /** Adds an initialization statement to the top of the lexical environment. */
        addInitializationStatement(node: Statement): void;
    }
    export interface TransformationContext extends CoreTransformationContext {
        getEmitResolver(): EmitResolver;
        getEmitHost(): EmitHost;
        getEmitHelperFactory(): EmitHelperFactory;
        /** Records a request for a non-scoped emit helper in the current context. */
        requestEmitHelper(helper: EmitHelper): void;
        /** Gets and resets the requested non-scoped emit helpers. */
        readEmitHelpers(): EmitHelper[] | undefined;
        /** Enables expression substitutions in the pretty printer for the provided SyntaxKind. */
        enableSubstitution(kind: SyntaxKind): void;
        /** Determines whether expression substitutions are enabled for the provided node. */
        isSubstitutionEnabled(node: Node): boolean;
        /**
         * Hook used by transformers to substitute expressions just before they
         * are emitted by the pretty printer.
         *
         * NOTE: Transformation hooks should only be modified during `Transformer` initialization,
         * before returning the `NodeTransformer` callback.
         */
        onSubstituteNode: (hint: EmitHint, node: Node) => Node;
        /**
         * Enables before/after emit notifications in the pretty printer for the provided
         * SyntaxKind.
         */
        enableEmitNotification(kind: SyntaxKind): void;
        /**
         * Determines whether before/after emit notifications should be raised in the pretty
         * printer when it emits a node.
         */
        isEmitNotificationEnabled(node: Node): boolean;
        /**
         * Hook used to allow transformers to capture state before or after
         * the printer emits a node.
         *
         * NOTE: Transformation hooks should only be modified during `Transformer` initialization,
         * before returning the `NodeTransformer` callback.
         */
        onEmitNode: (hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void) => void;
        addDiagnostic(diag: DiagnosticWithLocation): void;
    }
    export interface TransformationResult<T extends Node> {
        /** Gets the transformed source files. */
        transformed: T[];
        /** Gets diagnostics for the transformation. */
        diagnostics?: DiagnosticWithLocation[];
        /**
         * Gets a substitute for a node, if one is available; otherwise, returns the original node.
         *
         * @param hint A hint as to the intended usage of the node.
         * @param node The node to substitute.
         */
        substituteNode(hint: EmitHint, node: Node): Node;
        /**
         * Emits a node with possible notification.
         *
         * @param hint A hint as to the intended usage of the node.
         * @param node The node to emit.
         * @param emitCallback A callback used to emit the node.
         */
        emitNodeWithNotification(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
        /**
         * Indicates if a given node needs an emit notification
         *
         * @param node The node to emit.
         */
        isEmitNotificationEnabled?(node: Node): boolean;
        /**
         * Clean up EmitNode entries on any parse-tree nodes.
         */
        dispose(): void;
    }
    /**
     * A function that is used to initialize and return a `Transformer` callback, which in turn
     * will be used to transform one or more nodes.
     */
    export type TransformerFactory<T extends Node> = (context: TransformationContext) => Transformer<T>;
    /**
     * A function that transforms a node.
     */
    export type Transformer<T extends Node> = (node: T) => T;
    /**
     * A function that accepts and possibly transforms a node.
     */
    export type Visitor = (node: Node) => VisitResult<Node>;
    export interface NodeVisitor {
        <T extends Node>(nodes: T, visitor: Visitor | undefined, test?: (node: Node) => boolean, lift?: (node: readonly Node[]) => T): T;
        <T extends Node>(nodes: T | undefined, visitor: Visitor | undefined, test?: (node: Node) => boolean, lift?: (node: readonly Node[]) => T): T | undefined;
    }
    export interface NodesVisitor {
        <T extends Node>(nodes: NodeArray<T>, visitor: Visitor | undefined, test?: (node: Node) => boolean, start?: number, count?: number): NodeArray<T>;
        <T extends Node>(nodes: NodeArray<T> | undefined, visitor: Visitor | undefined, test?: (node: Node) => boolean, start?: number, count?: number): NodeArray<T> | undefined;
    }
    export type VisitResult<T extends Node> = T | T[] | undefined;
    export interface Printer {
        /**
         * Print a node and its subtree as-is, without any emit transformations.
         * @param hint A value indicating the purpose of a node. This is primarily used to
         * distinguish between an `Identifier` used in an expression position, versus an
         * `Identifier` used as an `IdentifierName` as part of a declaration. For most nodes you
         * should just pass `Unspecified`.
         * @param node The node to print. The node and its subtree are printed as-is, without any
         * emit transformations.
         * @param sourceFile A source file that provides context for the node. The source text of
         * the file is used to emit the original source content for literals and identifiers, while
         * the identifiers of the source file are used when generating unique names to avoid
         * collisions.
         */
        printNode(hint: EmitHint, node: Node, sourceFile: SourceFile): string;
        /**
         * Prints a list of nodes using the given format flags
         */
        printList<T extends Node>(format: ListFormat, list: NodeArray<T>, sourceFile: SourceFile): string;
        /**
         * Prints a source file as-is, without any emit transformations.
         */
        printFile(sourceFile: SourceFile): string;
        /**
         * Prints a bundle of source files as-is, without any emit transformations.
         */
        printBundle(bundle: Bundle): string;
        writeNode(hint: EmitHint, node: Node, sourceFile: SourceFile | undefined, writer: EmitTextWriter): void;
        writeList<T extends Node>(format: ListFormat, list: NodeArray<T> | undefined, sourceFile: SourceFile | undefined, writer: EmitTextWriter): void;
        writeFile(sourceFile: SourceFile, writer: EmitTextWriter, sourceMapGenerator: SourceMapGenerator | undefined): void;
        writeBundle(bundle: Bundle, writer: EmitTextWriter, sourceMapGenerator: SourceMapGenerator | undefined): void;
        bundleFileInfo?: BundleFileInfo;
    }
    export const enum BundleFileSectionKind {
        Prologue = "prologue",
        EmitHelpers = "emitHelpers",
        NoDefaultLib = "no-default-lib",
        Reference = "reference",
        Type = "type",
        Lib = "lib",
        Prepend = "prepend",
        Text = "text",
        Internal = "internal"
    }
    export interface BundleFileSectionBase extends TextRange {
        kind: BundleFileSectionKind;
        data?: string;
    }
    export interface BundleFilePrologue extends BundleFileSectionBase {
        kind: BundleFileSectionKind.Prologue;
        data: string;
    }
    export interface BundleFileEmitHelpers extends BundleFileSectionBase {
        kind: BundleFileSectionKind.EmitHelpers;
        data: string;
    }
    export interface BundleFileHasNoDefaultLib extends BundleFileSectionBase {
        kind: BundleFileSectionKind.NoDefaultLib;
    }
    export interface BundleFileReference extends BundleFileSectionBase {
        kind: BundleFileSectionKind.Reference | BundleFileSectionKind.Type | BundleFileSectionKind.Lib;
        data: string;
    }
    export interface BundleFilePrepend extends BundleFileSectionBase {
        kind: BundleFileSectionKind.Prepend;
        data: string;
        texts: BundleFileTextLike[];
    }
    export type BundleFileTextLikeKind = BundleFileSectionKind.Text | BundleFileSectionKind.Internal;
    export interface BundleFileTextLike extends BundleFileSectionBase {
        kind: BundleFileTextLikeKind;
    }
    export type BundleFileSection = BundleFilePrologue | BundleFileEmitHelpers | BundleFileHasNoDefaultLib | BundleFileReference | BundleFilePrepend | BundleFileTextLike;
    export interface SourceFilePrologueDirectiveExpression extends TextRange {
        text: string;
    }
    export interface SourceFilePrologueDirective extends TextRange {
        expression: SourceFilePrologueDirectiveExpression;
    }
    export interface SourceFilePrologueInfo {
        file: number;
        text: string;
        directives: SourceFilePrologueDirective[];
    }
    export interface SourceFileInfo {
        helpers?: string[];
        prologues?: SourceFilePrologueInfo[];
    }
    export interface BundleFileInfo {
        sections: BundleFileSection[];
        sources?: SourceFileInfo;
    }
    export interface BundleBuildInfo {
        js?: BundleFileInfo;
        dts?: BundleFileInfo;
        commonSourceDirectory: string;
        sourceFiles: readonly string[];
    }
    export interface BuildInfo {
        bundle?: BundleBuildInfo;
        program?: ProgramBuildInfo;
        version: string;
    }
    export interface PrintHandlers {
        /**
         * A hook used by the Printer when generating unique names to avoid collisions with
         * globally defined names that exist outside of the current source file.
         */
        hasGlobalName?(name: string): boolean;
        /**
         * A hook used by the Printer to provide notifications prior to emitting a node. A
         * compatible implementation **must** invoke `emitCallback` with the provided `hint` and
         * `node` values.
         * @param hint A hint indicating the intended purpose of the node.
         * @param node The node to emit.
         * @param emitCallback A callback that, when invoked, will emit the node.
         * @example
         * ```ts
         * var printer = createPrinter(printerOptions, {
         *   onEmitNode(hint, node, emitCallback) {
         *     // set up or track state prior to emitting the node...
         *     emitCallback(hint, node);
         *     // restore state after emitting the node...
         *   }
         * });
         * ```
         */
        onEmitNode?(hint: EmitHint, node: Node | undefined, emitCallback: (hint: EmitHint, node: Node | undefined) => void): void;
        /**
         * A hook used to check if an emit notification is required for a node.
         * @param node The node to emit.
         */
        isEmitNotificationEnabled?(node: Node | undefined): boolean;
        /**
         * A hook used by the Printer to perform just-in-time substitution of a node. This is
         * primarily used by node transformations that need to substitute one node for another,
         * such as replacing `myExportedVar` with `exports.myExportedVar`.
         * @param hint A hint indicating the intended purpose of the node.
         * @param node The node to emit.
         * @example
         * ```ts
         * var printer = createPrinter(printerOptions, {
         *   substituteNode(hint, node) {
         *     // perform substitution if necessary...
         *     return node;
         *   }
         * });
         * ```
         */
        substituteNode?(hint: EmitHint, node: Node): Node;
        onEmitSourceMapOfNode?: (hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void) => void;
        onEmitSourceMapOfToken?: (node: Node | undefined, token: SyntaxKind, writer: (s: string) => void, pos: number, emitCallback: (token: SyntaxKind, writer: (s: string) => void, pos: number) => number) => number;
        onEmitSourceMapOfPosition?: (pos: number) => void;
        onSetSourceFile?: (node: SourceFile) => void;
        onBeforeEmitNodeArray?: (nodes: NodeArray<any> | undefined) => void;
        onAfterEmitNodeArray?: (nodes: NodeArray<any> | undefined) => void;
        onBeforeEmitToken?: (node: Node) => void;
        onAfterEmitToken?: (node: Node) => void;
    }
    export interface PrinterOptions {
        removeComments?: boolean;
        newLine?: NewLineKind;
        omitTrailingSemicolon?: boolean;
        noEmitHelpers?: boolean;
        module?: CompilerOptions["module"];
        target?: CompilerOptions["target"];
        sourceMap?: boolean;
        inlineSourceMap?: boolean;
        inlineSources?: boolean;
        extendedDiagnostics?: boolean;
        onlyPrintJsDocStyle?: boolean;
        neverAsciiEscape?: boolean;
        writeBundleFileInfo?: boolean;
        recordInternalSection?: boolean;
        stripInternal?: boolean;
        preserveSourceNewlines?: boolean;
        terminateUnterminatedLiterals?: boolean;
        relativeToBuildInfo?: (path: string) => string;
    }
    export interface RawSourceMap {
        version: 3;
        file: string;
        sourceRoot?: string | null;
        sources: string[];
        sourcesContent?: (string | null)[] | null;
        mappings: string;
        names?: string[] | null;
    }
    /**
     * Generates a source map.
     */
    export interface SourceMapGenerator {
        getSources(): readonly string[];
        /**
         * Adds a source to the source map.
         */
        addSource(fileName: string): number;
        /**
         * Set the content for a source.
         */
        setSourceContent(sourceIndex: number, content: string | null): void;
        /**
         * Adds a name.
         */
        addName(name: string): number;
        /**
         * Adds a mapping without source information.
         */
        addMapping(generatedLine: number, generatedCharacter: number): void;
        /**
         * Adds a mapping with source information.
         */
        addMapping(generatedLine: number, generatedCharacter: number, sourceIndex: number, sourceLine: number, sourceCharacter: number, nameIndex?: number): void;
        /**
         * Appends a source map.
         */
        appendSourceMap(generatedLine: number, generatedCharacter: number, sourceMap: RawSourceMap, sourceMapPath: string, start?: LineAndCharacter, end?: LineAndCharacter): void;
        /**
         * Gets the source map as a `RawSourceMap` object.
         */
        toJSON(): RawSourceMap;
        /**
         * Gets the string representation of the source map.
         */
        toString(): string;
    }
    export interface DocumentPositionMapperHost {
        getSourceFileLike(fileName: string): SourceFileLike | undefined;
        getCanonicalFileName(path: string): string;
        log(text: string): void;
    }
    /**
     * Maps positions between source and generated files.
     */
    export interface DocumentPositionMapper {
        getSourcePosition(input: DocumentPosition): DocumentPosition;
        getGeneratedPosition(input: DocumentPosition): DocumentPosition;
    }
    export interface DocumentPosition {
        fileName: string;
        pos: number;
    }
    export interface EmitTextWriter extends SymbolWriter {
        write(s: string): void;
        writeTrailingSemicolon(text: string): void;
        writeComment(text: string): void;
        getText(): string;
        rawWrite(s: string): void;
        writeLiteral(s: string): void;
        getTextPos(): number;
        getLine(): number;
        getColumn(): number;
        getIndent(): number;
        isAtStartOfLine(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingWhitespace(): boolean;
        getTextPosWithWriteLine?(): number;
    }
    export interface GetEffectiveTypeRootsHost {
        directoryExists?(directoryName: string): boolean;
        getCurrentDirectory?(): string;
    }
    export interface ModuleSpecifierResolutionHost {
        useCaseSensitiveFileNames?(): boolean;
        fileExists(path: string): boolean;
        getCurrentDirectory(): string;
        directoryExists?(path: string): boolean;
        readFile?(path: string): string | undefined;
        realpath?(path: string): string;
        getSymlinkCache?(): SymlinkCache;
        getGlobalTypingsCacheLocation?(): string | undefined;
        getNearestAncestorDirectoryWithPackageJson?(fileName: string, rootDir?: string): string | undefined;
        getSourceFiles(): readonly SourceFile[];
        readonly redirectTargetsMap: RedirectTargetsMap;
        getProjectReferenceRedirect(fileName: string): string | undefined;
        isSourceOfProjectReferenceRedirect(fileName: string): boolean;
        getFileIncludeReasons(): MultiMap<Path, FileIncludeReason>;
    }
    export interface SymbolTracker {
        trackSymbol?(symbol: Symbol, enclosingDeclaration: Node | undefined, meaning: SymbolFlags): void;
        reportInaccessibleThisError?(): void;
        reportPrivateInBaseOfClassExpression?(propertyName: string): void;
        reportInaccessibleUniqueSymbolError?(): void;
        reportCyclicStructureError?(): void;
        reportLikelyUnsafeImportRequiredError?(specifier: string): void;
        reportTruncationError?(): void;
        moduleResolverHost?: ModuleSpecifierResolutionHost & {
            getCommonSourceDirectory(): string;
        };
        trackReferencedAmbientModule?(decl: ModuleDeclaration, symbol: Symbol): void;
        trackExternalModuleSymbolOfImportTypeNode?(symbol: Symbol): void;
        reportNonlocalAugmentation?(containingFile: SourceFile, parentSymbol: Symbol, augmentingSymbol: Symbol): void;
    }
    export interface TextSpan {
        start: number;
        length: number;
    }
    export interface TextChangeRange {
        span: TextSpan;
        newLength: number;
    }
    export interface DiagnosticCollection {
        add(diagnostic: Diagnostic): void;
        lookup(diagnostic: Diagnostic): Diagnostic | undefined;
        getGlobalDiagnostics(): Diagnostic[];
        getDiagnostics(): Diagnostic[];
        getDiagnostics(fileName: string): DiagnosticWithLocation[];
    }
    export interface SyntaxList extends Node {
        kind: SyntaxKind.SyntaxList;
        _children: Node[];
    }
    export const enum ListFormat {
        None = 0,
        SingleLine = 0,
        MultiLine = 1,
        PreserveLines = 2,
        LinesMask = 3,
        NotDelimited = 0,
        BarDelimited = 4,
        AmpersandDelimited = 8,
        CommaDelimited = 16,
        AsteriskDelimited = 32,
        DelimitersMask = 60,
        AllowTrailingComma = 64,
        Indented = 128,
        SpaceBetweenBraces = 256,
        SpaceBetweenSiblings = 512,
        Braces = 1024,
        Parenthesis = 2048,
        AngleBrackets = 4096,
        SquareBrackets = 8192,
        BracketsMask = 15360,
        OptionalIfUndefined = 16384,
        OptionalIfEmpty = 32768,
        Optional = 49152,
        PreferNewLine = 65536,
        NoTrailingNewLine = 131072,
        NoInterveningComments = 262144,
        NoSpaceIfEmpty = 524288,
        SingleElement = 1048576,
        SpaceAfterList = 2097152,
        Modifiers = 262656,
        HeritageClauses = 512,
        SingleLineTypeLiteralMembers = 768,
        MultiLineTypeLiteralMembers = 32897,
        SingleLineTupleTypeElements = 528,
        MultiLineTupleTypeElements = 657,
        UnionTypeConstituents = 516,
        IntersectionTypeConstituents = 520,
        ObjectBindingPatternElements = 525136,
        ArrayBindingPatternElements = 524880,
        ObjectLiteralExpressionProperties = 526226,
        ArrayLiteralExpressionElements = 8914,
        CommaListElements = 528,
        CallExpressionArguments = 2576,
        NewExpressionArguments = 18960,
        TemplateExpressionSpans = 262144,
        SingleLineBlockStatements = 768,
        MultiLineBlockStatements = 129,
        VariableDeclarationList = 528,
        SingleLineFunctionBodyStatements = 768,
        MultiLineFunctionBodyStatements = 1,
        ClassHeritageClauses = 0,
        ClassMembers = 129,
        InterfaceMembers = 129,
        EnumMembers = 145,
        CaseBlockClauses = 129,
        NamedImportsOrExportsElements = 525136,
        JsxElementOrFragmentChildren = 262144,
        JsxElementAttributes = 262656,
        CaseOrDefaultClauseStatements = 163969,
        HeritageClauseTypes = 528,
        SourceFileStatements = 131073,
        Decorators = 2146305,
        TypeArguments = 53776,
        TypeParameters = 53776,
        Parameters = 2576,
        IndexSignatureParameters = 8848,
        JSDocComment = 33
    }
    export const enum PragmaKindFlags {
        None = 0,
        /**
         * Triple slash comment of the form
         * /// <pragma-name argname="value" />
         */
        TripleSlashXML = 1,
        /**
         * Single line comment of the form
         * // @pragma-name argval1 argval2
         * or
         * /// @pragma-name argval1 argval2
         */
        SingleLine = 2,
        /**
         * Multiline non-jsdoc pragma of the form
         * /* @pragma-name argval1 argval2 * /
         */
        MultiLine = 4,
        All = 7,
        Default = 7
    }
    interface PragmaArgumentSpecification<TName extends string> {
        name: TName;
        optional?: boolean;
        captureSpan?: boolean;
    }
    export interface PragmaDefinition<T1 extends string = string, T2 extends string = string, T3 extends string = string, T4 extends string = string> {
        args?: readonly [PragmaArgumentSpecification<T1>] | readonly [PragmaArgumentSpecification<T1>, PragmaArgumentSpecification<T2>] | readonly [PragmaArgumentSpecification<T1>, PragmaArgumentSpecification<T2>, PragmaArgumentSpecification<T3>] | readonly [PragmaArgumentSpecification<T1>, PragmaArgumentSpecification<T2>, PragmaArgumentSpecification<T3>, PragmaArgumentSpecification<T4>];
        kind?: PragmaKindFlags;
    }
    export const commentPragmas: {
        readonly reference: {
            readonly args: readonly [{
                readonly name: "types";
                readonly optional: true;
                readonly captureSpan: true;
            }, {
                readonly name: "lib";
                readonly optional: true;
                readonly captureSpan: true;
            }, {
                readonly name: "path";
                readonly optional: true;
                readonly captureSpan: true;
            }, {
                readonly name: "no-default-lib";
                readonly optional: true;
            }];
            readonly kind: PragmaKindFlags;
        };
        readonly "amd-dependency": {
            readonly args: readonly [{
                readonly name: "path";
            }, {
                readonly name: "name";
                readonly optional: true;
            }];
            readonly kind: PragmaKindFlags;
        };
        readonly "amd-module": {
            readonly args: readonly [{
                readonly name: "name";
            }];
            readonly kind: PragmaKindFlags;
        };
        readonly "ts-check": {
            readonly kind: PragmaKindFlags;
        };
        readonly "ts-nocheck": {
            readonly kind: PragmaKindFlags;
        };
        readonly jsx: {
            readonly args: readonly [{
                readonly name: "factory";
            }];
            readonly kind: PragmaKindFlags;
        };
        readonly jsxfrag: {
            readonly args: readonly [{
                readonly name: "factory";
            }];
            readonly kind: PragmaKindFlags;
        };
        readonly jsximportsource: {
            readonly args: readonly [{
                readonly name: "factory";
            }];
            readonly kind: PragmaKindFlags;
        };
        readonly jsxruntime: {
            readonly args: readonly [{
                readonly name: "factory";
            }];
            readonly kind: PragmaKindFlags;
        };
    };
    type PragmaArgTypeMaybeCapture<TDesc> = TDesc extends {
        captureSpan: true;
    } ? {
        value: string;
        pos: number;
        end: number;
    } : string;
    type PragmaArgTypeOptional<TDesc, TName extends string> = TDesc extends {
        optional: true;
    } ? {
        [K in TName]?: PragmaArgTypeMaybeCapture<TDesc>;
    } : {
        [K in TName]: PragmaArgTypeMaybeCapture<TDesc>;
    };
    type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
    type ArgumentDefinitionToFieldUnion<T extends readonly PragmaArgumentSpecification<any>[]> = {
        [K in keyof T]: PragmaArgTypeOptional<T[K], T[K] extends {
            name: infer TName;
        } ? TName extends string ? TName : never : never>;
    }[Extract<keyof T, number>];
    /**
     * Maps a pragma definition into the desired shape for its arguments object
     */
    type PragmaArgumentType<KPrag extends keyof ConcretePragmaSpecs> = ConcretePragmaSpecs[KPrag] extends {
        args: readonly PragmaArgumentSpecification<any>[];
    } ? UnionToIntersection<ArgumentDefinitionToFieldUnion<ConcretePragmaSpecs[KPrag]["args"]>> : never;
    type ConcretePragmaSpecs = typeof commentPragmas;
    export type PragmaPseudoMap = {
        [K in keyof ConcretePragmaSpecs]: {
            arguments: PragmaArgumentType<K>;
            range: CommentRange;
        };
    };
    export type PragmaPseudoMapEntry = {
        [K in keyof PragmaPseudoMap]: {
            name: K;
            args: PragmaPseudoMap[K];
        };
    }[keyof PragmaPseudoMap];
    export interface ReadonlyPragmaMap extends ReadonlyESMap<string, PragmaPseudoMap[keyof PragmaPseudoMap] | PragmaPseudoMap[keyof PragmaPseudoMap][]> {
        get<TKey extends keyof PragmaPseudoMap>(key: TKey): PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][];
        forEach(action: <TKey extends keyof PragmaPseudoMap>(value: PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][], key: TKey) => void): void;
    }
    /**
     * A strongly-typed es6 map of pragma entries, the values of which are either a single argument
     * value (if only one was found), or an array of multiple argument values if the pragma is present
     * in multiple places
     */
    export interface PragmaMap extends ESMap<string, PragmaPseudoMap[keyof PragmaPseudoMap] | PragmaPseudoMap[keyof PragmaPseudoMap][]>, ReadonlyPragmaMap {
        set<TKey extends keyof PragmaPseudoMap>(key: TKey, value: PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][]): this;
        get<TKey extends keyof PragmaPseudoMap>(key: TKey): PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][];
        forEach(action: <TKey extends keyof PragmaPseudoMap>(value: PragmaPseudoMap[TKey] | PragmaPseudoMap[TKey][], key: TKey) => void): void;
    }
    export interface CommentDirectivesMap {
        getUnusedExpectations(): CommentDirective[];
        markUsed(matchedLine: number): boolean;
    }
    export interface UserPreferences {
        readonly disableSuggestions?: boolean;
        readonly quotePreference?: "auto" | "double" | "single";
        readonly includeCompletionsForModuleExports?: boolean;
        readonly includeAutomaticOptionalChainCompletions?: boolean;
        readonly includeCompletionsWithInsertText?: boolean;
        readonly importModuleSpecifierPreference?: "shortest" | "project-relative" | "relative" | "non-relative";
        /** Determines whether we import `foo/index.ts` as "foo", "foo/index", or "foo/index.js" */
        readonly importModuleSpecifierEnding?: "auto" | "minimal" | "index" | "js";
        readonly allowTextChangesInNewFiles?: boolean;
        readonly providePrefixAndSuffixTextForRename?: boolean;
        readonly includePackageJsonAutoImports?: "auto" | "on" | "off";
        readonly provideRefactorNotApplicableReason?: boolean;
    }
    /** Represents a bigint literal value without requiring bigint support */
    export interface PseudoBigInt {
        negative: boolean;
        base10Value: string;
    }
    export {};
}
declare namespace ts {
    /**
     * Internally, we represent paths as strings with '/' as the directory separator.
     * When we make system calls (eg: LanguageServiceHost.getDirectory()),
     * we expect the host to correctly handle paths in our specified format.
     */
    const directorySeparator = "/";
    const altDirectorySeparator = "\\";
    /**
     * Determines whether a charCode corresponds to `/` or `\`.
     */
    function isAnyDirectorySeparator(charCode: number): boolean;
    /**
     * Determines whether a path starts with a URL scheme (e.g. starts with `http://`, `ftp://`, `file://`, etc.).
     */
    function isUrl(path: string): boolean;
    /**
     * Determines whether a path is an absolute disk path (e.g. starts with `/`, or a dos path
     * like `c:`, `c:\` or `c:/`).
     */
    function isRootedDiskPath(path: string): boolean;
    /**
     * Determines whether a path consists only of a path root.
     */
    function isDiskPathRoot(path: string): boolean;
    /**
     * Determines whether a path starts with an absolute path component (i.e. `/`, `c:/`, `file://`, etc.).
     *
     * ```ts
     * // POSIX
     * pathIsAbsolute("/path/to/file.ext") === true
     * // DOS
     * pathIsAbsolute("c:/path/to/file.ext") === true
     * // URL
     * pathIsAbsolute("file:///path/to/file.ext") === true
     * // Non-absolute
     * pathIsAbsolute("path/to/file.ext") === false
     * pathIsAbsolute("./path/to/file.ext") === false
     * ```
     */
    function pathIsAbsolute(path: string): boolean;
    /**
     * Determines whether a path starts with a relative path component (i.e. `.` or `..`).
     */
    function pathIsRelative(path: string): boolean;
    /**
     * Determines whether a path is neither relative nor absolute, e.g. "path/to/file".
     * Also known misleadingly as "non-relative".
     */
    function pathIsBareSpecifier(path: string): boolean;
    function hasExtension(fileName: string): boolean;
    function fileExtensionIs(path: string, extension: string): boolean;
    function fileExtensionIsOneOf(path: string, extensions: readonly string[]): boolean;
    /**
     * Determines whether a path has a trailing separator (`/` or `\\`).
     */
    function hasTrailingDirectorySeparator(path: string): boolean;
    /**
     * Returns length of the root part of a path or URL (i.e. length of "/", "x:/", "//server/share/, file:///user/files").
     *
     * For example:
     * ```ts
     * getRootLength("a") === 0                   // ""
     * getRootLength("/") === 1                   // "/"
     * getRootLength("c:") === 2                  // "c:"
     * getRootLength("c:d") === 0                 // ""
     * getRootLength("c:/") === 3                 // "c:/"
     * getRootLength("c:\\") === 3                // "c:\\"
     * getRootLength("//server") === 7            // "//server"
     * getRootLength("//server/share") === 8      // "//server/"
     * getRootLength("\\\\server") === 7          // "\\\\server"
     * getRootLength("\\\\server\\share") === 8   // "\\\\server\\"
     * getRootLength("file:///path") === 8        // "file:///"
     * getRootLength("file:///c:") === 10         // "file:///c:"
     * getRootLength("file:///c:d") === 8         // "file:///"
     * getRootLength("file:///c:/path") === 11    // "file:///c:/"
     * getRootLength("file://server") === 13      // "file://server"
     * getRootLength("file://server/path") === 14 // "file://server/"
     * getRootLength("http://server") === 13      // "http://server"
     * getRootLength("http://server/path") === 14 // "http://server/"
     * ```
     */
    function getRootLength(path: string): number;
    /**
     * Returns the path except for its basename. Semantics align with NodeJS's `path.dirname`
     * except that we support URLs as well.
     *
     * ```ts
     * // POSIX
     * getDirectoryPath("/path/to/file.ext") === "/path/to"
     * getDirectoryPath("/path/to/") === "/path"
     * getDirectoryPath("/") === "/"
     * // DOS
     * getDirectoryPath("c:/path/to/file.ext") === "c:/path/to"
     * getDirectoryPath("c:/path/to/") === "c:/path"
     * getDirectoryPath("c:/") === "c:/"
     * getDirectoryPath("c:") === "c:"
     * // URL
     * getDirectoryPath("http://typescriptlang.org/path/to/file.ext") === "http://typescriptlang.org/path/to"
     * getDirectoryPath("http://typescriptlang.org/path/to") === "http://typescriptlang.org/path"
     * getDirectoryPath("http://typescriptlang.org/") === "http://typescriptlang.org/"
     * getDirectoryPath("http://typescriptlang.org") === "http://typescriptlang.org"
     * ```
     */
    function getDirectoryPath(path: Path): Path;
    /**
     * Returns the path except for its basename. Semantics align with NodeJS's `path.dirname`
     * except that we support URLs as well.
     *
     * ```ts
     * // POSIX
     * getDirectoryPath("/path/to/file.ext") === "/path/to"
     * getDirectoryPath("/path/to/") === "/path"
     * getDirectoryPath("/") === "/"
     * // DOS
     * getDirectoryPath("c:/path/to/file.ext") === "c:/path/to"
     * getDirectoryPath("c:/path/to/") === "c:/path"
     * getDirectoryPath("c:/") === "c:/"
     * getDirectoryPath("c:") === "c:"
     * // URL
     * getDirectoryPath("http://typescriptlang.org/path/to/file.ext") === "http://typescriptlang.org/path/to"
     * getDirectoryPath("http://typescriptlang.org/path/to") === "http://typescriptlang.org/path"
     * getDirectoryPath("http://typescriptlang.org/") === "http://typescriptlang.org/"
     * getDirectoryPath("http://typescriptlang.org") === "http://typescriptlang.org"
     * getDirectoryPath("file://server/path/to/file.ext") === "file://server/path/to"
     * getDirectoryPath("file://server/path/to") === "file://server/path"
     * getDirectoryPath("file://server/") === "file://server/"
     * getDirectoryPath("file://server") === "file://server"
     * getDirectoryPath("file:///path/to/file.ext") === "file:///path/to"
     * getDirectoryPath("file:///path/to") === "file:///path"
     * getDirectoryPath("file:///") === "file:///"
     * getDirectoryPath("file://") === "file://"
     * ```
     */
    function getDirectoryPath(path: string): string;
    /**
     * Returns the path except for its containing directory name.
     * Semantics align with NodeJS's `path.basename` except that we support URL's as well.
     *
     * ```ts
     * // POSIX
     * getBaseFileName("/path/to/file.ext") === "file.ext"
     * getBaseFileName("/path/to/") === "to"
     * getBaseFileName("/") === ""
     * // DOS
     * getBaseFileName("c:/path/to/file.ext") === "file.ext"
     * getBaseFileName("c:/path/to/") === "to"
     * getBaseFileName("c:/") === ""
     * getBaseFileName("c:") === ""
     * // URL
     * getBaseFileName("http://typescriptlang.org/path/to/file.ext") === "file.ext"
     * getBaseFileName("http://typescriptlang.org/path/to/") === "to"
     * getBaseFileName("http://typescriptlang.org/") === ""
     * getBaseFileName("http://typescriptlang.org") === ""
     * getBaseFileName("file://server/path/to/file.ext") === "file.ext"
     * getBaseFileName("file://server/path/to/") === "to"
     * getBaseFileName("file://server/") === ""
     * getBaseFileName("file://server") === ""
     * getBaseFileName("file:///path/to/file.ext") === "file.ext"
     * getBaseFileName("file:///path/to/") === "to"
     * getBaseFileName("file:///") === ""
     * getBaseFileName("file://") === ""
     * ```
     */
    function getBaseFileName(path: string): string;
    /**
     * Gets the portion of a path following the last (non-terminal) separator (`/`).
     * Semantics align with NodeJS's `path.basename` except that we support URL's as well.
     * If the base name has any one of the provided extensions, it is removed.
     *
     * ```ts
     * getBaseFileName("/path/to/file.ext", ".ext", true) === "file"
     * getBaseFileName("/path/to/file.js", ".ext", true) === "file.js"
     * getBaseFileName("/path/to/file.js", [".ext", ".js"], true) === "file"
     * getBaseFileName("/path/to/file.ext", ".EXT", false) === "file.ext"
     * ```
     */
    function getBaseFileName(path: string, extensions: string | readonly string[], ignoreCase: boolean): string;
    /**
     * Gets the file extension for a path.
     *
     * ```ts
     * getAnyExtensionFromPath("/path/to/file.ext") === ".ext"
     * getAnyExtensionFromPath("/path/to/file.ext/") === ".ext"
     * getAnyExtensionFromPath("/path/to/file") === ""
     * getAnyExtensionFromPath("/path/to.ext/file") === ""
     * ```
     */
    function getAnyExtensionFromPath(path: string): string;
    /**
     * Gets the file extension for a path, provided it is one of the provided extensions.
     *
     * ```ts
     * getAnyExtensionFromPath("/path/to/file.ext", ".ext", true) === ".ext"
     * getAnyExtensionFromPath("/path/to/file.js", ".ext", true) === ""
     * getAnyExtensionFromPath("/path/to/file.js", [".ext", ".js"], true) === ".js"
     * getAnyExtensionFromPath("/path/to/file.ext", ".EXT", false) === ""
     */
    function getAnyExtensionFromPath(path: string, extensions: string | readonly string[], ignoreCase: boolean): string;
    /**
     * Parse a path into an array containing a root component (at index 0) and zero or more path
     * components (at indices > 0). The result is not normalized.
     * If the path is relative, the root component is `""`.
     * If the path is absolute, the root component includes the first path separator (`/`).
     *
     * ```ts
     * // POSIX
     * getPathComponents("/path/to/file.ext") === ["/", "path", "to", "file.ext"]
     * getPathComponents("/path/to/") === ["/", "path", "to"]
     * getPathComponents("/") === ["/"]
     * // DOS
     * getPathComponents("c:/path/to/file.ext") === ["c:/", "path", "to", "file.ext"]
     * getPathComponents("c:/path/to/") === ["c:/", "path", "to"]
     * getPathComponents("c:/") === ["c:/"]
     * getPathComponents("c:") === ["c:"]
     * // URL
     * getPathComponents("http://typescriptlang.org/path/to/file.ext") === ["http://typescriptlang.org/", "path", "to", "file.ext"]
     * getPathComponents("http://typescriptlang.org/path/to/") === ["http://typescriptlang.org/", "path", "to"]
     * getPathComponents("http://typescriptlang.org/") === ["http://typescriptlang.org/"]
     * getPathComponents("http://typescriptlang.org") === ["http://typescriptlang.org"]
     * getPathComponents("file://server/path/to/file.ext") === ["file://server/", "path", "to", "file.ext"]
     * getPathComponents("file://server/path/to/") === ["file://server/", "path", "to"]
     * getPathComponents("file://server/") === ["file://server/"]
     * getPathComponents("file://server") === ["file://server"]
     * getPathComponents("file:///path/to/file.ext") === ["file:///", "path", "to", "file.ext"]
     * getPathComponents("file:///path/to/") === ["file:///", "path", "to"]
     * getPathComponents("file:///") === ["file:///"]
     * getPathComponents("file://") === ["file://"]
     */
    function getPathComponents(path: string, currentDirectory?: string): string[];
    /**
     * Formats a parsed path consisting of a root component (at index 0) and zero or more path
     * segments (at indices > 0).
     *
     * ```ts
     * getPathFromPathComponents(["/", "path", "to", "file.ext"]) === "/path/to/file.ext"
     * ```
     */
    function getPathFromPathComponents(pathComponents: readonly string[]): string;
    /**
     * Normalize path separators, converting `\` into `/`.
     */
    function normalizeSlashes(path: string): string;
    /**
     * Reduce an array of path components to a more simplified path by navigating any
     * `"."` or `".."` entries in the path.
     */
    function reducePathComponents(components: readonly string[]): string[];
    /**
     * Combines paths. If a path is absolute, it replaces any previous path. Relative paths are not simplified.
     *
     * ```ts
     * // Non-rooted
     * combinePaths("path", "to", "file.ext") === "path/to/file.ext"
     * combinePaths("path", "dir", "..", "to", "file.ext") === "path/dir/../to/file.ext"
     * // POSIX
     * combinePaths("/path", "to", "file.ext") === "/path/to/file.ext"
     * combinePaths("/path", "/to", "file.ext") === "/to/file.ext"
     * // DOS
     * combinePaths("c:/path", "to", "file.ext") === "c:/path/to/file.ext"
     * combinePaths("c:/path", "c:/to", "file.ext") === "c:/to/file.ext"
     * // URL
     * combinePaths("file:///path", "to", "file.ext") === "file:///path/to/file.ext"
     * combinePaths("file:///path", "file:///to", "file.ext") === "file:///to/file.ext"
     * ```
     */
    function combinePaths(path: string, ...paths: (string | undefined)[]): string;
    /**
     * Combines and resolves paths. If a path is absolute, it replaces any previous path. Any
     * `.` and `..` path components are resolved. Trailing directory separators are preserved.
     *
     * ```ts
     * resolvePath("/path", "to", "file.ext") === "path/to/file.ext"
     * resolvePath("/path", "to", "file.ext/") === "path/to/file.ext/"
     * resolvePath("/path", "dir", "..", "to", "file.ext") === "path/to/file.ext"
     * ```
     */
    function resolvePath(path: string, ...paths: (string | undefined)[]): string;
    /**
     * Parse a path into an array containing a root component (at index 0) and zero or more path
     * components (at indices > 0). The result is normalized.
     * If the path is relative, the root component is `""`.
     * If the path is absolute, the root component includes the first path separator (`/`).
     *
     * ```ts
     * getNormalizedPathComponents("to/dir/../file.ext", "/path/") === ["/", "path", "to", "file.ext"]
     * ```
     */
    function getNormalizedPathComponents(path: string, currentDirectory: string | undefined): string[];
    function getNormalizedAbsolutePath(fileName: string, currentDirectory: string | undefined): string;
    function normalizePath(path: string): string;
    function getNormalizedAbsolutePathWithoutRoot(fileName: string, currentDirectory: string | undefined): string;
    function toPath(fileName: string, basePath: string | undefined, getCanonicalFileName: (path: string) => string): Path;
    function normalizePathAndParts(path: string): {
        path: string;
        parts: string[];
    };
    /**
     * Removes a trailing directory separator from a path, if it does not already have one.
     *
     * ```ts
     * removeTrailingDirectorySeparator("/path/to/file.ext") === "/path/to/file.ext"
     * removeTrailingDirectorySeparator("/path/to/file.ext/") === "/path/to/file.ext"
     * ```
     */
    function removeTrailingDirectorySeparator(path: Path): Path;
    function removeTrailingDirectorySeparator(path: string): string;
    /**
     * Adds a trailing directory separator to a path, if it does not already have one.
     *
     * ```ts
     * ensureTrailingDirectorySeparator("/path/to/file.ext") === "/path/to/file.ext/"
     * ensureTrailingDirectorySeparator("/path/to/file.ext/") === "/path/to/file.ext/"
     * ```
     */
    function ensureTrailingDirectorySeparator(path: Path): Path;
    function ensureTrailingDirectorySeparator(path: string): string;
    /**
     * Ensures a path is either absolute (prefixed with `/` or `c:`) or dot-relative (prefixed
     * with `./` or `../`) so as not to be confused with an unprefixed module name.
     *
     * ```ts
     * ensurePathIsNonModuleName("/path/to/file.ext") === "/path/to/file.ext"
     * ensurePathIsNonModuleName("./path/to/file.ext") === "./path/to/file.ext"
     * ensurePathIsNonModuleName("../path/to/file.ext") === "../path/to/file.ext"
     * ensurePathIsNonModuleName("path/to/file.ext") === "./path/to/file.ext"
     * ```
     */
    function ensurePathIsNonModuleName(path: string): string;
    /**
     * Changes the extension of a path to the provided extension.
     *
     * ```ts
     * changeAnyExtension("/path/to/file.ext", ".js") === "/path/to/file.js"
     * ```
     */
    function changeAnyExtension(path: string, ext: string): string;
    /**
     * Changes the extension of a path to the provided extension if it has one of the provided extensions.
     *
     * ```ts
     * changeAnyExtension("/path/to/file.ext", ".js", ".ext") === "/path/to/file.js"
     * changeAnyExtension("/path/to/file.ext", ".js", ".ts") === "/path/to/file.ext"
     * changeAnyExtension("/path/to/file.ext", ".js", [".ext", ".ts"]) === "/path/to/file.js"
     * ```
     */
    function changeAnyExtension(path: string, ext: string, extensions: string | readonly string[], ignoreCase: boolean): string;
    /**
     * Performs a case-sensitive comparison of two paths. Path roots are always compared case-insensitively.
     */
    function comparePathsCaseSensitive(a: string, b: string): Comparison;
    /**
     * Performs a case-insensitive comparison of two paths.
     */
    function comparePathsCaseInsensitive(a: string, b: string): Comparison;
    /**
     * Compare two paths using the provided case sensitivity.
     */
    function comparePaths(a: string, b: string, ignoreCase?: boolean): Comparison;
    function comparePaths(a: string, b: string, currentDirectory: string, ignoreCase?: boolean): Comparison;
    /**
     * Determines whether a `parent` path contains a `child` path using the provide case sensitivity.
     */
    function containsPath(parent: string, child: string, ignoreCase?: boolean): boolean;
    function containsPath(parent: string, child: string, currentDirectory: string, ignoreCase?: boolean): boolean;
    /**
     * Determines whether `fileName` starts with the specified `directoryName` using the provided path canonicalization callback.
     * Comparison is case-sensitive between the canonical paths.
     *
     * Use `containsPath` if file names are not already reduced and absolute.
     */
    function startsWithDirectory(fileName: string, directoryName: string, getCanonicalFileName: GetCanonicalFileName): boolean;
    function getPathComponentsRelativeTo(from: string, to: string, stringEqualityComparer: (a: string, b: string) => boolean, getCanonicalFileName: GetCanonicalFileName): string[];
    /**
     * Gets a relative path that can be used to traverse between `from` and `to`.
     */
    function getRelativePathFromDirectory(from: string, to: string, ignoreCase: boolean): string;
    /**
     * Gets a relative path that can be used to traverse between `from` and `to`.
     */
    function getRelativePathFromDirectory(fromDirectory: string, to: string, getCanonicalFileName: GetCanonicalFileName): string;
    function convertToRelativePath(absoluteOrRelativePath: string, basePath: string, getCanonicalFileName: (path: string) => string): string;
    function getRelativePathFromFile(from: string, to: string, getCanonicalFileName: GetCanonicalFileName): string;
    function getRelativePathToDirectoryOrUrl(directoryPathOrUrl: string, relativeOrAbsolutePath: string, currentDirectory: string, getCanonicalFileName: GetCanonicalFileName, isAbsolutePathAnUrl: boolean): string;
    /**
     * Calls `callback` on `directory` and every ancestor directory it has, returning the first defined result.
     */
    function forEachAncestorDirectory<T>(directory: Path, callback: (directory: Path) => T | undefined): T | undefined;
    function forEachAncestorDirectory<T>(directory: string, callback: (directory: string) => T | undefined): T | undefined;
    function isNodeModulesDirectory(dirPath: Path): boolean;
}
declare function setTimeout(handler: (...args: any[]) => void, timeout: number): any;
declare function clearTimeout(handle: any): void;
declare namespace ts {
    /**
     * djb2 hashing algorithm
     * http://www.cse.yorku.ca/~oz/hash.html
     */
    export function generateDjb2Hash(data: string): string;
    /**
     * Set a high stack trace limit to provide more information in case of an error.
     * Called for command-line and server use cases.
     * Not called if TypeScript is used as a library.
     */
    export function setStackTraceLimit(): void;
    export enum FileWatcherEventKind {
        Created = 0,
        Changed = 1,
        Deleted = 2
    }
    export type FileWatcherCallback = (fileName: string, eventKind: FileWatcherEventKind) => void;
    export type DirectoryWatcherCallback = (fileName: string) => void;
    export interface WatchedFile {
        readonly fileName: string;
        readonly callback: FileWatcherCallback;
        mtime: Date;
    }
    export enum PollingInterval {
        High = 2000,
        Medium = 500,
        Low = 250
    }
    export type HostWatchFile = (fileName: string, callback: FileWatcherCallback, pollingInterval: PollingInterval, options: WatchOptions | undefined) => FileWatcher;
    export type HostWatchDirectory = (fileName: string, callback: DirectoryWatcherCallback, recursive: boolean, options: WatchOptions | undefined) => FileWatcher;
    export const missingFileModifiedTime: Date;
    export let unchangedPollThresholds: {
        250: number;
        500: number;
        2000: number;
    };
    export function setCustomPollingValues(system: System): void;
    export function createDynamicPriorityPollingWatchFile(host: {
        getModifiedTime: NonNullable<System["getModifiedTime"]>;
        setTimeout: NonNullable<System["setTimeout"]>;
    }): HostWatchFile;
    export function createSingleFileWatcherPerName(watchFile: HostWatchFile, useCaseSensitiveFileNames: boolean): HostWatchFile;
    /**
     * Returns true if file status changed
     */
    export function onWatchedFileStat(watchedFile: WatchedFile, modifiedTime: Date): boolean;
    export function getFileWatcherEventKind(oldTime: number, newTime: number): FileWatcherEventKind;
    export const ignoredPaths: string[];
    export let sysLog: (s: string) => void;
    export function setSysLog(logger: typeof sysLog): void;
    export interface RecursiveDirectoryWatcherHost {
        watchDirectory: HostWatchDirectory;
        useCaseSensitiveFileNames: boolean;
        getCurrentDirectory: System["getCurrentDirectory"];
        getAccessibleSortedChildDirectories(path: string): readonly string[];
        directoryExists(dir: string): boolean;
        realpath(s: string): string;
        setTimeout: NonNullable<System["setTimeout"]>;
        clearTimeout: NonNullable<System["clearTimeout"]>;
    }
    /**
     * Watch the directory recursively using host provided method to watch child directories
     * that means if this is recursive watcher, watch the children directories as well
     * (eg on OS that dont support recursive watch using fs.watch use fs.watchFile)
     */
    export function createDirectoryWatcherSupportingRecursive({ watchDirectory, useCaseSensitiveFileNames, getCurrentDirectory, getAccessibleSortedChildDirectories, directoryExists, realpath, setTimeout, clearTimeout }: RecursiveDirectoryWatcherHost): HostWatchDirectory;
    export type FsWatchCallback = (eventName: "rename" | "change", relativeFileName: string | undefined) => void;
    export type FsWatch = (fileOrDirectory: string, entryKind: FileSystemEntryKind, callback: FsWatchCallback, recursive: boolean, fallbackPollingInterval: PollingInterval, fallbackOptions: WatchOptions | undefined) => FileWatcher;
    export const enum FileSystemEntryKind {
        File = 0,
        Directory = 1
    }
    export function createFileWatcherCallback(callback: FsWatchCallback): FileWatcherCallback;
    export interface CreateSystemWatchFunctions {
        pollingWatchFile: HostWatchFile;
        getModifiedTime: NonNullable<System["getModifiedTime"]>;
        setTimeout: NonNullable<System["setTimeout"]>;
        clearTimeout: NonNullable<System["clearTimeout"]>;
        fsWatch: FsWatch;
        fileExists: System["fileExists"];
        useCaseSensitiveFileNames: boolean;
        getCurrentDirectory: System["getCurrentDirectory"];
        fsSupportsRecursiveFsWatch: boolean;
        directoryExists: System["directoryExists"];
        getAccessibleSortedChildDirectories(path: string): readonly string[];
        realpath(s: string): string;
        tscWatchFile: string | undefined;
        useNonPollingWatchers?: boolean;
        tscWatchDirectory: string | undefined;
    }
    export function createSystemWatchFunctions({ pollingWatchFile, getModifiedTime, setTimeout, clearTimeout, fsWatch, fileExists, useCaseSensitiveFileNames, getCurrentDirectory, fsSupportsRecursiveFsWatch, directoryExists, getAccessibleSortedChildDirectories, realpath, tscWatchFile, useNonPollingWatchers, tscWatchDirectory, }: CreateSystemWatchFunctions): {
        watchFile: HostWatchFile;
        watchDirectory: HostWatchDirectory;
    };
    /**
     * patch writefile to create folder before writing the file
     */
    export function patchWriteFileEnsuringDirectory(sys: System): void;
    export type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";
    interface NodeBuffer extends Uint8Array {
        constructor: any;
        write(str: string, encoding?: BufferEncoding): number;
        write(str: string, offset: number, encoding?: BufferEncoding): number;
        write(str: string, offset: number, length: number, encoding?: BufferEncoding): number;
        toString(encoding?: string, start?: number, end?: number): string;
        toJSON(): {
            type: "Buffer";
            data: number[];
        };
        equals(otherBuffer: Uint8Array): boolean;
        compare(otherBuffer: Uint8Array, targetStart?: number, targetEnd?: number, sourceStart?: number, sourceEnd?: number): number;
        copy(targetBuffer: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
        slice(begin?: number, end?: number): Buffer;
        subarray(begin?: number, end?: number): Buffer;
        writeUIntLE(value: number, offset: number, byteLength: number): number;
        writeUIntBE(value: number, offset: number, byteLength: number): number;
        writeIntLE(value: number, offset: number, byteLength: number): number;
        writeIntBE(value: number, offset: number, byteLength: number): number;
        readUIntLE(offset: number, byteLength: number): number;
        readUIntBE(offset: number, byteLength: number): number;
        readIntLE(offset: number, byteLength: number): number;
        readIntBE(offset: number, byteLength: number): number;
        readUInt8(offset: number): number;
        readUInt16LE(offset: number): number;
        readUInt16BE(offset: number): number;
        readUInt32LE(offset: number): number;
        readUInt32BE(offset: number): number;
        readInt8(offset: number): number;
        readInt16LE(offset: number): number;
        readInt16BE(offset: number): number;
        readInt32LE(offset: number): number;
        readInt32BE(offset: number): number;
        readFloatLE(offset: number): number;
        readFloatBE(offset: number): number;
        readDoubleLE(offset: number): number;
        readDoubleBE(offset: number): number;
        reverse(): this;
        swap16(): Buffer;
        swap32(): Buffer;
        swap64(): Buffer;
        writeUInt8(value: number, offset: number): number;
        writeUInt16LE(value: number, offset: number): number;
        writeUInt16BE(value: number, offset: number): number;
        writeUInt32LE(value: number, offset: number): number;
        writeUInt32BE(value: number, offset: number): number;
        writeInt8(value: number, offset: number): number;
        writeInt16LE(value: number, offset: number): number;
        writeInt16BE(value: number, offset: number): number;
        writeInt32LE(value: number, offset: number): number;
        writeInt32BE(value: number, offset: number): number;
        writeFloatLE(value: number, offset: number): number;
        writeFloatBE(value: number, offset: number): number;
        writeDoubleLE(value: number, offset: number): number;
        writeDoubleBE(value: number, offset: number): number;
        readBigUInt64BE?(offset?: number): bigint;
        readBigUInt64LE?(offset?: number): bigint;
        readBigInt64BE?(offset?: number): bigint;
        readBigInt64LE?(offset?: number): bigint;
        writeBigInt64BE?(value: bigint, offset?: number): number;
        writeBigInt64LE?(value: bigint, offset?: number): number;
        writeBigUInt64BE?(value: bigint, offset?: number): number;
        writeBigUInt64LE?(value: bigint, offset?: number): number;
        fill(value: string | Uint8Array | number, offset?: number, end?: number, encoding?: BufferEncoding): this;
        indexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number;
        lastIndexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number;
        entries(): IterableIterator<[number, number]>;
        includes(value: string | number | Buffer, byteOffset?: number, encoding?: BufferEncoding): boolean;
        keys(): IterableIterator<number>;
        values(): IterableIterator<number>;
    }
    interface Buffer extends NodeBuffer {
    }
    export interface System {
        args: string[];
        newLine: string;
        useCaseSensitiveFileNames: boolean;
        write(s: string): void;
        writeOutputIsTTY?(): boolean;
        readFile(path: string, encoding?: string): string | undefined;
        getFileSize?(path: string): number;
        writeFile(path: string, data: string, writeByteOrderMark?: boolean): void;
        /**
         * @pollingInterval - this parameter is used in polling-based watchers and ignored in watchers that
         * use native OS file watching
         */
        watchFile?(path: string, callback: FileWatcherCallback, pollingInterval?: number, options?: WatchOptions): FileWatcher;
        watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean, options?: WatchOptions): FileWatcher;
        resolvePath(path: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        createDirectory(path: string): void;
        getExecutingFilePath(): string;
        getCurrentDirectory(): string;
        getDirectories(path: string): string[];
        readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
        getModifiedTime?(path: string): Date | undefined;
        setModifiedTime?(path: string, time: Date): void;
        deleteFile?(path: string): void;
        /**
         * A good implementation is node.js' `crypto.createHash`. (https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm)
         */
        createHash?(data: string): string;
        /** This must be cryptographically secure. Only implement this method using `crypto.createHash("sha256")`. */
        createSHA256Hash?(data: string): string;
        getMemoryUsage?(): number;
        exit(exitCode?: number): void;
        enableCPUProfiler?(path: string, continuation: () => void): boolean;
        disableCPUProfiler?(continuation: () => void): boolean;
        cpuProfilingEnabled?(): boolean;
        realpath?(path: string): string;
        getEnvironmentVariable(name: string): string;
        tryEnableSourceMapsForHost?(): void;
        debugMode?: boolean;
        setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
        clearTimeout?(timeoutId: any): void;
        clearScreen?(): void;
        setBlocking?(): void;
        base64decode?(input: string): string;
        base64encode?(input: string): string;
        bufferFrom?(input: string, encoding?: string): Buffer;
        now?(): Date;
        require?(baseDir: string, moduleName: string): RequireResult;
    }
    export interface FileWatcher {
        close(): void;
    }
    export function getNodeMajorVersion(): number | undefined;
    export let sys: System;
    export {};
}
declare namespace ts {
    const Diagnostics: {
        Unterminated_string_literal: DiagnosticMessage;
        Identifier_expected: DiagnosticMessage;
        _0_expected: DiagnosticMessage;
        A_file_cannot_have_a_reference_to_itself: DiagnosticMessage;
        The_parser_expected_to_find_a_to_match_the_token_here: DiagnosticMessage;
        Trailing_comma_not_allowed: DiagnosticMessage;
        Asterisk_Slash_expected: DiagnosticMessage;
        An_element_access_expression_should_take_an_argument: DiagnosticMessage;
        Unexpected_token: DiagnosticMessage;
        A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma: DiagnosticMessage;
        A_rest_parameter_must_be_last_in_a_parameter_list: DiagnosticMessage;
        Parameter_cannot_have_question_mark_and_initializer: DiagnosticMessage;
        A_required_parameter_cannot_follow_an_optional_parameter: DiagnosticMessage;
        An_index_signature_cannot_have_a_rest_parameter: DiagnosticMessage;
        An_index_signature_parameter_cannot_have_an_accessibility_modifier: DiagnosticMessage;
        An_index_signature_parameter_cannot_have_a_question_mark: DiagnosticMessage;
        An_index_signature_parameter_cannot_have_an_initializer: DiagnosticMessage;
        An_index_signature_must_have_a_type_annotation: DiagnosticMessage;
        An_index_signature_parameter_must_have_a_type_annotation: DiagnosticMessage;
        An_index_signature_parameter_type_must_be_either_string_or_number: DiagnosticMessage;
        readonly_modifier_can_only_appear_on_a_property_declaration_or_index_signature: DiagnosticMessage;
        An_index_signature_cannot_have_a_trailing_comma: DiagnosticMessage;
        Accessibility_modifier_already_seen: DiagnosticMessage;
        _0_modifier_must_precede_1_modifier: DiagnosticMessage;
        _0_modifier_already_seen: DiagnosticMessage;
        _0_modifier_cannot_appear_on_class_elements_of_this_kind: DiagnosticMessage;
        super_must_be_followed_by_an_argument_list_or_member_access: DiagnosticMessage;
        Only_ambient_modules_can_use_quoted_names: DiagnosticMessage;
        Statements_are_not_allowed_in_ambient_contexts: DiagnosticMessage;
        A_declare_modifier_cannot_be_used_in_an_already_ambient_context: DiagnosticMessage;
        Initializers_are_not_allowed_in_ambient_contexts: DiagnosticMessage;
        _0_modifier_cannot_be_used_in_an_ambient_context: DiagnosticMessage;
        _0_modifier_cannot_be_used_with_a_class_declaration: DiagnosticMessage;
        _0_modifier_cannot_be_used_here: DiagnosticMessage;
        _0_modifier_cannot_appear_on_a_data_property: DiagnosticMessage;
        _0_modifier_cannot_appear_on_a_module_or_namespace_element: DiagnosticMessage;
        A_0_modifier_cannot_be_used_with_an_interface_declaration: DiagnosticMessage;
        Top_level_declarations_in_d_ts_files_must_start_with_either_a_declare_or_export_modifier: DiagnosticMessage;
        A_rest_parameter_cannot_be_optional: DiagnosticMessage;
        A_rest_parameter_cannot_have_an_initializer: DiagnosticMessage;
        A_set_accessor_must_have_exactly_one_parameter: DiagnosticMessage;
        A_set_accessor_cannot_have_an_optional_parameter: DiagnosticMessage;
        A_set_accessor_parameter_cannot_have_an_initializer: DiagnosticMessage;
        A_set_accessor_cannot_have_rest_parameter: DiagnosticMessage;
        A_get_accessor_cannot_have_parameters: DiagnosticMessage;
        Type_0_is_not_a_valid_async_function_return_type_in_ES5_SlashES3_because_it_does_not_refer_to_a_Promise_compatible_constructor_value: DiagnosticMessage;
        Accessors_are_only_available_when_targeting_ECMAScript_5_and_higher: DiagnosticMessage;
        An_async_function_or_method_must_have_a_valid_awaitable_return_type: DiagnosticMessage;
        The_return_type_of_an_async_function_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
        A_promise_must_have_a_then_method: DiagnosticMessage;
        The_first_parameter_of_the_then_method_of_a_promise_must_be_a_callback: DiagnosticMessage;
        Enum_member_must_have_initializer: DiagnosticMessage;
        Type_is_referenced_directly_or_indirectly_in_the_fulfillment_callback_of_its_own_then_method: DiagnosticMessage;
        An_export_assignment_cannot_be_used_in_a_namespace: DiagnosticMessage;
        The_return_type_of_an_async_function_or_method_must_be_the_global_Promise_T_type_Did_you_mean_to_write_Promise_0: DiagnosticMessage;
        In_ambient_enum_declarations_member_initializer_must_be_constant_expression: DiagnosticMessage;
        Unexpected_token_A_constructor_method_accessor_or_property_was_expected: DiagnosticMessage;
        Unexpected_token_A_type_parameter_name_was_expected_without_curly_braces: DiagnosticMessage;
        _0_modifier_cannot_appear_on_a_type_member: DiagnosticMessage;
        _0_modifier_cannot_appear_on_an_index_signature: DiagnosticMessage;
        A_0_modifier_cannot_be_used_with_an_import_declaration: DiagnosticMessage;
        Invalid_reference_directive_syntax: DiagnosticMessage;
        Octal_literals_are_not_available_when_targeting_ECMAScript_5_and_higher_Use_the_syntax_0: DiagnosticMessage;
        _0_modifier_cannot_appear_on_a_constructor_declaration: DiagnosticMessage;
        _0_modifier_cannot_appear_on_a_parameter: DiagnosticMessage;
        Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement: DiagnosticMessage;
        Type_parameters_cannot_appear_on_a_constructor_declaration: DiagnosticMessage;
        Type_annotation_cannot_appear_on_a_constructor_declaration: DiagnosticMessage;
        An_accessor_cannot_have_type_parameters: DiagnosticMessage;
        A_set_accessor_cannot_have_a_return_type_annotation: DiagnosticMessage;
        An_index_signature_must_have_exactly_one_parameter: DiagnosticMessage;
        _0_list_cannot_be_empty: DiagnosticMessage;
        Type_parameter_list_cannot_be_empty: DiagnosticMessage;
        Type_argument_list_cannot_be_empty: DiagnosticMessage;
        Invalid_use_of_0_in_strict_mode: DiagnosticMessage;
        with_statements_are_not_allowed_in_strict_mode: DiagnosticMessage;
        delete_cannot_be_called_on_an_identifier_in_strict_mode: DiagnosticMessage;
        for_await_loops_are_only_allowed_within_async_functions_and_at_the_top_levels_of_modules: DiagnosticMessage;
        A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement: DiagnosticMessage;
        A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement: DiagnosticMessage;
        Jump_target_cannot_cross_function_boundary: DiagnosticMessage;
        A_return_statement_can_only_be_used_within_a_function_body: DiagnosticMessage;
        Expression_expected: DiagnosticMessage;
        Type_expected: DiagnosticMessage;
        A_default_clause_cannot_appear_more_than_once_in_a_switch_statement: DiagnosticMessage;
        Duplicate_label_0: DiagnosticMessage;
        A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement: DiagnosticMessage;
        A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement: DiagnosticMessage;
        An_object_literal_cannot_have_multiple_properties_with_the_same_name_in_strict_mode: DiagnosticMessage;
        An_object_literal_cannot_have_multiple_get_Slashset_accessors_with_the_same_name: DiagnosticMessage;
        An_object_literal_cannot_have_property_and_accessor_with_the_same_name: DiagnosticMessage;
        An_export_assignment_cannot_have_modifiers: DiagnosticMessage;
        Octal_literals_are_not_allowed_in_strict_mode: DiagnosticMessage;
        Variable_declaration_list_cannot_be_empty: DiagnosticMessage;
        Digit_expected: DiagnosticMessage;
        Hexadecimal_digit_expected: DiagnosticMessage;
        Unexpected_end_of_text: DiagnosticMessage;
        Invalid_character: DiagnosticMessage;
        Declaration_or_statement_expected: DiagnosticMessage;
        Statement_expected: DiagnosticMessage;
        case_or_default_expected: DiagnosticMessage;
        Property_or_signature_expected: DiagnosticMessage;
        Enum_member_expected: DiagnosticMessage;
        Variable_declaration_expected: DiagnosticMessage;
        Argument_expression_expected: DiagnosticMessage;
        Property_assignment_expected: DiagnosticMessage;
        Expression_or_comma_expected: DiagnosticMessage;
        Parameter_declaration_expected: DiagnosticMessage;
        Type_parameter_declaration_expected: DiagnosticMessage;
        Type_argument_expected: DiagnosticMessage;
        String_literal_expected: DiagnosticMessage;
        Line_break_not_permitted_here: DiagnosticMessage;
        or_expected: DiagnosticMessage;
        Declaration_expected: DiagnosticMessage;
        Import_declarations_in_a_namespace_cannot_reference_a_module: DiagnosticMessage;
        Cannot_use_imports_exports_or_module_augmentations_when_module_is_none: DiagnosticMessage;
        File_name_0_differs_from_already_included_file_name_1_only_in_casing: DiagnosticMessage;
        const_declarations_must_be_initialized: DiagnosticMessage;
        const_declarations_can_only_be_declared_inside_a_block: DiagnosticMessage;
        let_declarations_can_only_be_declared_inside_a_block: DiagnosticMessage;
        Unterminated_template_literal: DiagnosticMessage;
        Unterminated_regular_expression_literal: DiagnosticMessage;
        An_object_member_cannot_be_declared_optional: DiagnosticMessage;
        A_yield_expression_is_only_allowed_in_a_generator_body: DiagnosticMessage;
        Computed_property_names_are_not_allowed_in_enums: DiagnosticMessage;
        A_computed_property_name_in_an_ambient_context_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
        A_computed_property_name_in_a_class_property_declaration_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
        A_computed_property_name_in_a_method_overload_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
        A_computed_property_name_in_an_interface_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
        A_computed_property_name_in_a_type_literal_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type: DiagnosticMessage;
        A_comma_expression_is_not_allowed_in_a_computed_property_name: DiagnosticMessage;
        extends_clause_already_seen: DiagnosticMessage;
        extends_clause_must_precede_implements_clause: DiagnosticMessage;
        Classes_can_only_extend_a_single_class: DiagnosticMessage;
        implements_clause_already_seen: DiagnosticMessage;
        Interface_declaration_cannot_have_implements_clause: DiagnosticMessage;
        Binary_digit_expected: DiagnosticMessage;
        Octal_digit_expected: DiagnosticMessage;
        Unexpected_token_expected: DiagnosticMessage;
        Property_destructuring_pattern_expected: DiagnosticMessage;
        Array_element_destructuring_pattern_expected: DiagnosticMessage;
        A_destructuring_declaration_must_have_an_initializer: DiagnosticMessage;
        An_implementation_cannot_be_declared_in_ambient_contexts: DiagnosticMessage;
        Modifiers_cannot_appear_here: DiagnosticMessage;
        Merge_conflict_marker_encountered: DiagnosticMessage;
        A_rest_element_cannot_have_an_initializer: DiagnosticMessage;
        A_parameter_property_may_not_be_declared_using_a_binding_pattern: DiagnosticMessage;
        Only_a_single_variable_declaration_is_allowed_in_a_for_of_statement: DiagnosticMessage;
        The_variable_declaration_of_a_for_in_statement_cannot_have_an_initializer: DiagnosticMessage;
        The_variable_declaration_of_a_for_of_statement_cannot_have_an_initializer: DiagnosticMessage;
        An_import_declaration_cannot_have_modifiers: DiagnosticMessage;
        Module_0_has_no_default_export: DiagnosticMessage;
        An_export_declaration_cannot_have_modifiers: DiagnosticMessage;
        Export_declarations_are_not_permitted_in_a_namespace: DiagnosticMessage;
        export_Asterisk_does_not_re_export_a_default: DiagnosticMessage;
        Catch_clause_variable_type_annotation_must_be_any_or_unknown_if_specified: DiagnosticMessage;
        Catch_clause_variable_cannot_have_an_initializer: DiagnosticMessage;
        An_extended_Unicode_escape_value_must_be_between_0x0_and_0x10FFFF_inclusive: DiagnosticMessage;
        Unterminated_Unicode_escape_sequence: DiagnosticMessage;
        Line_terminator_not_permitted_before_arrow: DiagnosticMessage;
        Import_assignment_cannot_be_used_when_targeting_ECMAScript_modules_Consider_using_import_Asterisk_as_ns_from_mod_import_a_from_mod_import_d_from_mod_or_another_module_format_instead: DiagnosticMessage;
        Export_assignment_cannot_be_used_when_targeting_ECMAScript_modules_Consider_using_export_default_or_another_module_format_instead: DiagnosticMessage;
        Re_exporting_a_type_when_the_isolatedModules_flag_is_provided_requires_using_export_type: DiagnosticMessage;
        Decorators_are_not_valid_here: DiagnosticMessage;
        Decorators_cannot_be_applied_to_multiple_get_Slashset_accessors_of_the_same_name: DiagnosticMessage;
        _0_cannot_be_compiled_under_isolatedModules_because_it_is_considered_a_global_script_file_Add_an_import_export_or_an_empty_export_statement_to_make_it_a_module: DiagnosticMessage;
        Invalid_use_of_0_Class_definitions_are_automatically_in_strict_mode: DiagnosticMessage;
        A_class_declaration_without_the_default_modifier_must_have_a_name: DiagnosticMessage;
        Identifier_expected_0_is_a_reserved_word_in_strict_mode: DiagnosticMessage;
        Identifier_expected_0_is_a_reserved_word_in_strict_mode_Class_definitions_are_automatically_in_strict_mode: DiagnosticMessage;
        Identifier_expected_0_is_a_reserved_word_in_strict_mode_Modules_are_automatically_in_strict_mode: DiagnosticMessage;
        Invalid_use_of_0_Modules_are_automatically_in_strict_mode: DiagnosticMessage;
        Identifier_expected_esModule_is_reserved_as_an_exported_marker_when_transforming_ECMAScript_modules: DiagnosticMessage;
        Export_assignment_is_not_supported_when_module_flag_is_system: DiagnosticMessage;
        Experimental_support_for_decorators_is_a_feature_that_is_subject_to_change_in_a_future_release_Set_the_experimentalDecorators_option_in_your_tsconfig_or_jsconfig_to_remove_this_warning: DiagnosticMessage;
        Generators_are_only_available_when_targeting_ECMAScript_2015_or_higher: DiagnosticMessage;
        Generators_are_not_allowed_in_an_ambient_context: DiagnosticMessage;
        An_overload_signature_cannot_be_declared_as_a_generator: DiagnosticMessage;
        _0_tag_already_specified: DiagnosticMessage;
        Signature_0_must_be_a_type_predicate: DiagnosticMessage;
        Cannot_find_parameter_0: DiagnosticMessage;
        Type_predicate_0_is_not_assignable_to_1: DiagnosticMessage;
        Parameter_0_is_not_in_the_same_position_as_parameter_1: DiagnosticMessage;
        A_type_predicate_is_only_allowed_in_return_type_position_for_functions_and_methods: DiagnosticMessage;
        A_type_predicate_cannot_reference_a_rest_parameter: DiagnosticMessage;
        A_type_predicate_cannot_reference_element_0_in_a_binding_pattern: DiagnosticMessage;
        An_export_assignment_can_only_be_used_in_a_module: DiagnosticMessage;
        An_import_declaration_can_only_be_used_in_a_namespace_or_module: DiagnosticMessage;
        An_export_declaration_can_only_be_used_in_a_module: DiagnosticMessage;
        An_ambient_module_declaration_is_only_allowed_at_the_top_level_in_a_file: DiagnosticMessage;
        A_namespace_declaration_is_only_allowed_in_a_namespace_or_module: DiagnosticMessage;
        The_return_type_of_a_property_decorator_function_must_be_either_void_or_any: DiagnosticMessage;
        The_return_type_of_a_parameter_decorator_function_must_be_either_void_or_any: DiagnosticMessage;
        Unable_to_resolve_signature_of_class_decorator_when_called_as_an_expression: DiagnosticMessage;
        Unable_to_resolve_signature_of_parameter_decorator_when_called_as_an_expression: DiagnosticMessage;
        Unable_to_resolve_signature_of_property_decorator_when_called_as_an_expression: DiagnosticMessage;
        Unable_to_resolve_signature_of_method_decorator_when_called_as_an_expression: DiagnosticMessage;
        abstract_modifier_can_only_appear_on_a_class_method_or_property_declaration: DiagnosticMessage;
        _0_modifier_cannot_be_used_with_1_modifier: DiagnosticMessage;
        Abstract_methods_can_only_appear_within_an_abstract_class: DiagnosticMessage;
        Method_0_cannot_have_an_implementation_because_it_is_marked_abstract: DiagnosticMessage;
        An_interface_property_cannot_have_an_initializer: DiagnosticMessage;
        A_type_literal_property_cannot_have_an_initializer: DiagnosticMessage;
        A_class_member_cannot_have_the_0_keyword: DiagnosticMessage;
        A_decorator_can_only_decorate_a_method_implementation_not_an_overload: DiagnosticMessage;
        Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5: DiagnosticMessage;
        Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Class_definitions_are_automatically_in_strict_mode: DiagnosticMessage;
        Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Modules_are_automatically_in_strict_mode: DiagnosticMessage;
        _0_tag_cannot_be_used_independently_as_a_top_level_JSDoc_tag: DiagnosticMessage;
        A_const_initializer_in_an_ambient_context_must_be_a_string_or_numeric_literal_or_literal_enum_reference: DiagnosticMessage;
        A_definite_assignment_assertion_is_not_permitted_in_this_context: DiagnosticMessage;
        A_required_element_cannot_follow_an_optional_element: DiagnosticMessage;
        Module_0_can_only_be_default_imported_using_the_1_flag: DiagnosticMessage;
        Keywords_cannot_contain_escape_characters: DiagnosticMessage;
        Already_included_file_name_0_differs_from_file_name_1_only_in_casing: DiagnosticMessage;
        Identifier_expected_0_is_a_reserved_word_at_the_top_level_of_a_module: DiagnosticMessage;
        Declarations_with_initializers_cannot_also_have_definite_assignment_assertions: DiagnosticMessage;
        Declarations_with_definite_assignment_assertions_must_also_have_type_annotations: DiagnosticMessage;
        A_rest_element_cannot_follow_another_rest_element: DiagnosticMessage;
        An_optional_element_cannot_follow_a_rest_element: DiagnosticMessage;
        with_statements_are_not_allowed_in_an_async_function_block: DiagnosticMessage;
        await_expressions_are_only_allowed_within_async_functions_and_at_the_top_levels_of_modules: DiagnosticMessage;
        Did_you_mean_to_use_a_Colon_An_can_only_follow_a_property_name_when_the_containing_object_literal_is_part_of_a_destructuring_pattern: DiagnosticMessage;
        The_body_of_an_if_statement_cannot_be_the_empty_statement: DiagnosticMessage;
        Global_module_exports_may_only_appear_in_module_files: DiagnosticMessage;
        Global_module_exports_may_only_appear_in_declaration_files: DiagnosticMessage;
        Global_module_exports_may_only_appear_at_top_level: DiagnosticMessage;
        A_parameter_property_cannot_be_declared_using_a_rest_parameter: DiagnosticMessage;
        An_abstract_accessor_cannot_have_an_implementation: DiagnosticMessage;
        A_default_export_can_only_be_used_in_an_ECMAScript_style_module: DiagnosticMessage;
        Type_of_await_operand_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
        Type_of_yield_operand_in_an_async_generator_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
        Type_of_iterated_elements_of_a_yield_Asterisk_operand_must_either_be_a_valid_promise_or_must_not_contain_a_callable_then_member: DiagnosticMessage;
        Dynamic_imports_are_only_supported_when_the_module_flag_is_set_to_es2020_esnext_commonjs_amd_system_or_umd: DiagnosticMessage;
        Dynamic_import_must_have_one_specifier_as_an_argument: DiagnosticMessage;
        Specifier_of_dynamic_import_cannot_be_spread_element: DiagnosticMessage;
        Dynamic_import_cannot_have_type_arguments: DiagnosticMessage;
        String_literal_with_double_quotes_expected: DiagnosticMessage;
        Property_value_can_only_be_string_literal_numeric_literal_true_false_null_object_literal_or_array_literal: DiagnosticMessage;
        _0_accepts_too_few_arguments_to_be_used_as_a_decorator_here_Did_you_mean_to_call_it_first_and_write_0: DiagnosticMessage;
        A_property_of_an_interface_or_type_literal_whose_type_is_a_unique_symbol_type_must_be_readonly: DiagnosticMessage;
        A_property_of_a_class_whose_type_is_a_unique_symbol_type_must_be_both_static_and_readonly: DiagnosticMessage;
        A_variable_whose_type_is_a_unique_symbol_type_must_be_const: DiagnosticMessage;
        unique_symbol_types_may_not_be_used_on_a_variable_declaration_with_a_binding_name: DiagnosticMessage;
        unique_symbol_types_are_only_allowed_on_variables_in_a_variable_statement: DiagnosticMessage;
        unique_symbol_types_are_not_allowed_here: DiagnosticMessage;
        An_index_signature_parameter_type_cannot_be_a_type_alias_Consider_writing_0_Colon_1_Colon_2_instead: DiagnosticMessage;
        An_index_signature_parameter_type_cannot_be_a_union_type_Consider_using_a_mapped_object_type_instead: DiagnosticMessage;
        infer_declarations_are_only_permitted_in_the_extends_clause_of_a_conditional_type: DiagnosticMessage;
        Module_0_does_not_refer_to_a_value_but_is_used_as_a_value_here: DiagnosticMessage;
        Module_0_does_not_refer_to_a_type_but_is_used_as_a_type_here_Did_you_mean_typeof_import_0: DiagnosticMessage;
        Type_arguments_cannot_be_used_here: DiagnosticMessage;
        The_import_meta_meta_property_is_only_allowed_when_the_module_option_is_es2020_esnext_or_system: DiagnosticMessage;
        A_label_is_not_allowed_here: DiagnosticMessage;
        An_expression_of_type_void_cannot_be_tested_for_truthiness: DiagnosticMessage;
        This_parameter_is_not_allowed_with_use_strict_directive: DiagnosticMessage;
        use_strict_directive_cannot_be_used_with_non_simple_parameter_list: DiagnosticMessage;
        Non_simple_parameter_declared_here: DiagnosticMessage;
        use_strict_directive_used_here: DiagnosticMessage;
        Print_the_final_configuration_instead_of_building: DiagnosticMessage;
        An_identifier_or_keyword_cannot_immediately_follow_a_numeric_literal: DiagnosticMessage;
        A_bigint_literal_cannot_use_exponential_notation: DiagnosticMessage;
        A_bigint_literal_must_be_an_integer: DiagnosticMessage;
        readonly_type_modifier_is_only_permitted_on_array_and_tuple_literal_types: DiagnosticMessage;
        A_const_assertions_can_only_be_applied_to_references_to_enum_members_or_string_number_boolean_array_or_object_literals: DiagnosticMessage;
        Did_you_mean_to_mark_this_function_as_async: DiagnosticMessage;
        An_enum_member_name_must_be_followed_by_a_or: DiagnosticMessage;
        Tagged_template_expressions_are_not_permitted_in_an_optional_chain: DiagnosticMessage;
        Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here: DiagnosticMessage;
        Did_you_mean_to_parenthesize_this_function_type: DiagnosticMessage;
        _0_cannot_be_used_as_a_value_because_it_was_imported_using_import_type: DiagnosticMessage;
        _0_cannot_be_used_as_a_value_because_it_was_exported_using_export_type: DiagnosticMessage;
        A_type_only_import_can_specify_a_default_import_or_named_bindings_but_not_both: DiagnosticMessage;
        Convert_to_type_only_export: DiagnosticMessage;
        Convert_all_re_exported_types_to_type_only_exports: DiagnosticMessage;
        Split_into_two_separate_import_declarations: DiagnosticMessage;
        Split_all_invalid_type_only_imports: DiagnosticMessage;
        Specify_emit_Slashchecking_behavior_for_imports_that_are_only_used_for_types: DiagnosticMessage;
        Did_you_mean_0: DiagnosticMessage;
        This_import_is_never_used_as_a_value_and_must_use_import_type_because_importsNotUsedAsValues_is_set_to_error: DiagnosticMessage;
        Convert_to_type_only_import: DiagnosticMessage;
        Convert_all_imports_not_used_as_a_value_to_type_only_imports: DiagnosticMessage;
        await_expressions_are_only_allowed_at_the_top_level_of_a_file_when_that_file_is_a_module_but_this_file_has_no_imports_or_exports_Consider_adding_an_empty_export_to_make_this_file_a_module: DiagnosticMessage;
        _0_was_imported_here: DiagnosticMessage;
        _0_was_exported_here: DiagnosticMessage;
        Top_level_await_expressions_are_only_allowed_when_the_module_option_is_set_to_esnext_or_system_and_the_target_option_is_set_to_es2017_or_higher: DiagnosticMessage;
        An_import_alias_cannot_reference_a_declaration_that_was_exported_using_export_type: DiagnosticMessage;
        An_import_alias_cannot_reference_a_declaration_that_was_imported_using_import_type: DiagnosticMessage;
        Unexpected_token_Did_you_mean_or_rbrace: DiagnosticMessage;
        Unexpected_token_Did_you_mean_or_gt: DiagnosticMessage;
        Only_named_exports_may_use_export_type: DiagnosticMessage;
        A_new_expression_with_type_arguments_must_always_be_followed_by_a_parenthesized_argument_list: DiagnosticMessage;
        Function_type_notation_must_be_parenthesized_when_used_in_a_union_type: DiagnosticMessage;
        Constructor_type_notation_must_be_parenthesized_when_used_in_a_union_type: DiagnosticMessage;
        Function_type_notation_must_be_parenthesized_when_used_in_an_intersection_type: DiagnosticMessage;
        Constructor_type_notation_must_be_parenthesized_when_used_in_an_intersection_type: DiagnosticMessage;
        _0_is_not_allowed_as_a_variable_declaration_name: DiagnosticMessage;
        Provides_a_root_package_name_when_using_outFile_with_declarations: DiagnosticMessage;
        The_bundledPackageName_option_must_be_provided_when_using_outFile_and_node_module_resolution_with_declaration_emit: DiagnosticMessage;
        An_import_alias_cannot_use_import_type: DiagnosticMessage;
        Imported_via_0_from_file_1: DiagnosticMessage;
        Imported_via_0_from_file_1_with_packageId_2: DiagnosticMessage;
        Imported_via_0_from_file_1_to_import_importHelpers_as_specified_in_compilerOptions: DiagnosticMessage;
        Imported_via_0_from_file_1_with_packageId_2_to_import_importHelpers_as_specified_in_compilerOptions: DiagnosticMessage;
        Imported_via_0_from_file_1_to_import_jsx_and_jsxs_factory_functions: DiagnosticMessage;
        Imported_via_0_from_file_1_with_packageId_2_to_import_jsx_and_jsxs_factory_functions: DiagnosticMessage;
        File_is_included_via_import_here: DiagnosticMessage;
        Referenced_via_0_from_file_1: DiagnosticMessage;
        File_is_included_via_reference_here: DiagnosticMessage;
        Type_library_referenced_via_0_from_file_1: DiagnosticMessage;
        Type_library_referenced_via_0_from_file_1_with_packageId_2: DiagnosticMessage;
        File_is_included_via_type_library_reference_here: DiagnosticMessage;
        Library_referenced_via_0_from_file_1: DiagnosticMessage;
        File_is_included_via_library_reference_here: DiagnosticMessage;
        Matched_by_include_pattern_0_in_1: DiagnosticMessage;
        File_is_matched_by_include_pattern_specified_here: DiagnosticMessage;
        Part_of_files_list_in_tsconfig_json: DiagnosticMessage;
        File_is_matched_by_files_list_specified_here: DiagnosticMessage;
        Output_from_referenced_project_0_included_because_1_specified: DiagnosticMessage;
        Output_from_referenced_project_0_included_because_module_is_specified_as_none: DiagnosticMessage;
        File_is_output_from_referenced_project_specified_here: DiagnosticMessage;
        Source_from_referenced_project_0_included_because_1_specified: DiagnosticMessage;
        Source_from_referenced_project_0_included_because_module_is_specified_as_none: DiagnosticMessage;
        File_is_source_from_referenced_project_specified_here: DiagnosticMessage;
        Entry_point_of_type_library_0_specified_in_compilerOptions: DiagnosticMessage;
        Entry_point_of_type_library_0_specified_in_compilerOptions_with_packageId_1: DiagnosticMessage;
        File_is_entry_point_of_type_library_specified_here: DiagnosticMessage;
        Entry_point_for_implicit_type_library_0: DiagnosticMessage;
        Entry_point_for_implicit_type_library_0_with_packageId_1: DiagnosticMessage;
        Library_0_specified_in_compilerOptions: DiagnosticMessage;
        File_is_library_specified_here: DiagnosticMessage;
        Default_library: DiagnosticMessage;
        Default_library_for_target_0: DiagnosticMessage;
        File_is_default_library_for_target_specified_here: DiagnosticMessage;
        Root_file_specified_for_compilation: DiagnosticMessage;
        File_is_output_of_project_reference_source_0: DiagnosticMessage;
        File_redirects_to_file_0: DiagnosticMessage;
        The_file_is_in_the_program_because_Colon: DiagnosticMessage;
        for_await_loops_are_only_allowed_at_the_top_level_of_a_file_when_that_file_is_a_module_but_this_file_has_no_imports_or_exports_Consider_adding_an_empty_export_to_make_this_file_a_module: DiagnosticMessage;
        Top_level_for_await_loops_are_only_allowed_when_the_module_option_is_set_to_esnext_or_system_and_the_target_option_is_set_to_es2017_or_higher: DiagnosticMessage;
        The_types_of_0_are_incompatible_between_these_types: DiagnosticMessage;
        The_types_returned_by_0_are_incompatible_between_these_types: DiagnosticMessage;
        Call_signature_return_types_0_and_1_are_incompatible: DiagnosticMessage;
        Construct_signature_return_types_0_and_1_are_incompatible: DiagnosticMessage;
        Call_signatures_with_no_arguments_have_incompatible_return_types_0_and_1: DiagnosticMessage;
        Construct_signatures_with_no_arguments_have_incompatible_return_types_0_and_1: DiagnosticMessage;
        Duplicate_identifier_0: DiagnosticMessage;
        Initializer_of_instance_member_variable_0_cannot_reference_identifier_1_declared_in_the_constructor: DiagnosticMessage;
        Static_members_cannot_reference_class_type_parameters: DiagnosticMessage;
        Circular_definition_of_import_alias_0: DiagnosticMessage;
        Cannot_find_name_0: DiagnosticMessage;
        Module_0_has_no_exported_member_1: DiagnosticMessage;
        File_0_is_not_a_module: DiagnosticMessage;
        Cannot_find_module_0_or_its_corresponding_type_declarations: DiagnosticMessage;
        Module_0_has_already_exported_a_member_named_1_Consider_explicitly_re_exporting_to_resolve_the_ambiguity: DiagnosticMessage;
        An_export_assignment_cannot_be_used_in_a_module_with_other_exported_elements: DiagnosticMessage;
        Type_0_recursively_references_itself_as_a_base_type: DiagnosticMessage;
        A_class_may_only_extend_another_class: DiagnosticMessage;
        An_interface_can_only_extend_an_object_type_or_intersection_of_object_types_with_statically_known_members: DiagnosticMessage;
        Type_parameter_0_has_a_circular_constraint: DiagnosticMessage;
        Generic_type_0_requires_1_type_argument_s: DiagnosticMessage;
        Type_0_is_not_generic: DiagnosticMessage;
        Global_type_0_must_be_a_class_or_interface_type: DiagnosticMessage;
        Global_type_0_must_have_1_type_parameter_s: DiagnosticMessage;
        Cannot_find_global_type_0: DiagnosticMessage;
        Named_property_0_of_types_1_and_2_are_not_identical: DiagnosticMessage;
        Interface_0_cannot_simultaneously_extend_types_1_and_2: DiagnosticMessage;
        Excessive_stack_depth_comparing_types_0_and_1: DiagnosticMessage;
        Type_0_is_not_assignable_to_type_1: DiagnosticMessage;
        Cannot_redeclare_exported_variable_0: DiagnosticMessage;
        Property_0_is_missing_in_type_1: DiagnosticMessage;
        Property_0_is_private_in_type_1_but_not_in_type_2: DiagnosticMessage;
        Types_of_property_0_are_incompatible: DiagnosticMessage;
        Property_0_is_optional_in_type_1_but_required_in_type_2: DiagnosticMessage;
        Types_of_parameters_0_and_1_are_incompatible: DiagnosticMessage;
        Index_signature_is_missing_in_type_0: DiagnosticMessage;
        Index_signatures_are_incompatible: DiagnosticMessage;
        this_cannot_be_referenced_in_a_module_or_namespace_body: DiagnosticMessage;
        this_cannot_be_referenced_in_current_location: DiagnosticMessage;
        this_cannot_be_referenced_in_constructor_arguments: DiagnosticMessage;
        this_cannot_be_referenced_in_a_static_property_initializer: DiagnosticMessage;
        super_can_only_be_referenced_in_a_derived_class: DiagnosticMessage;
        super_cannot_be_referenced_in_constructor_arguments: DiagnosticMessage;
        Super_calls_are_not_permitted_outside_constructors_or_in_nested_functions_inside_constructors: DiagnosticMessage;
        super_property_access_is_permitted_only_in_a_constructor_member_function_or_member_accessor_of_a_derived_class: DiagnosticMessage;
        Property_0_does_not_exist_on_type_1: DiagnosticMessage;
        Only_public_and_protected_methods_of_the_base_class_are_accessible_via_the_super_keyword: DiagnosticMessage;
        Property_0_is_private_and_only_accessible_within_class_1: DiagnosticMessage;
        An_index_expression_argument_must_be_of_type_string_number_symbol_or_any: DiagnosticMessage;
        This_syntax_requires_an_imported_helper_named_1_which_does_not_exist_in_0_Consider_upgrading_your_version_of_0: DiagnosticMessage;
        Type_0_does_not_satisfy_the_constraint_1: DiagnosticMessage;
        Argument_of_type_0_is_not_assignable_to_parameter_of_type_1: DiagnosticMessage;
        Call_target_does_not_contain_any_signatures: DiagnosticMessage;
        Untyped_function_calls_may_not_accept_type_arguments: DiagnosticMessage;
        Value_of_type_0_is_not_callable_Did_you_mean_to_include_new: DiagnosticMessage;
        This_expression_is_not_callable: DiagnosticMessage;
        Only_a_void_function_can_be_called_with_the_new_keyword: DiagnosticMessage;
        This_expression_is_not_constructable: DiagnosticMessage;
        Conversion_of_type_0_to_type_1_may_be_a_mistake_because_neither_type_sufficiently_overlaps_with_the_other_If_this_was_intentional_convert_the_expression_to_unknown_first: DiagnosticMessage;
        Object_literal_may_only_specify_known_properties_and_0_does_not_exist_in_type_1: DiagnosticMessage;
        This_syntax_requires_an_imported_helper_but_module_0_cannot_be_found: DiagnosticMessage;
        A_function_whose_declared_type_is_neither_void_nor_any_must_return_a_value: DiagnosticMessage;
        An_arithmetic_operand_must_be_of_type_any_number_bigint_or_an_enum_type: DiagnosticMessage;
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable_or_a_property_access: DiagnosticMessage;
        The_left_hand_side_of_an_instanceof_expression_must_be_of_type_any_an_object_type_or_a_type_parameter: DiagnosticMessage;
        The_right_hand_side_of_an_instanceof_expression_must_be_of_type_any_or_of_a_type_assignable_to_the_Function_interface_type: DiagnosticMessage;
        The_left_hand_side_of_an_in_expression_must_be_of_type_any_string_number_or_symbol: DiagnosticMessage;
        The_right_hand_side_of_an_in_expression_must_not_be_a_primitive: DiagnosticMessage;
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type: DiagnosticMessage;
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type: DiagnosticMessage;
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access: DiagnosticMessage;
        Operator_0_cannot_be_applied_to_types_1_and_2: DiagnosticMessage;
        Function_lacks_ending_return_statement_and_return_type_does_not_include_undefined: DiagnosticMessage;
        This_condition_will_always_return_0_since_the_types_1_and_2_have_no_overlap: DiagnosticMessage;
        Type_parameter_name_cannot_be_0: DiagnosticMessage;
        A_parameter_property_is_only_allowed_in_a_constructor_implementation: DiagnosticMessage;
        A_rest_parameter_must_be_of_an_array_type: DiagnosticMessage;
        A_parameter_initializer_is_only_allowed_in_a_function_or_constructor_implementation: DiagnosticMessage;
        Parameter_0_cannot_reference_itself: DiagnosticMessage;
        Parameter_0_cannot_reference_identifier_1_declared_after_it: DiagnosticMessage;
        Duplicate_string_index_signature: DiagnosticMessage;
        Duplicate_number_index_signature: DiagnosticMessage;
        A_super_call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_initialized_properties_parameter_properties_or_private_identifiers: DiagnosticMessage;
        Constructors_for_derived_classes_must_contain_a_super_call: DiagnosticMessage;
        A_get_accessor_must_return_a_value: DiagnosticMessage;
        Getter_and_setter_accessors_do_not_agree_in_visibility: DiagnosticMessage;
        get_and_set_accessor_must_have_the_same_type: DiagnosticMessage;
        A_signature_with_an_implementation_cannot_use_a_string_literal_type: DiagnosticMessage;
        Specialized_overload_signature_is_not_assignable_to_any_non_specialized_signature: DiagnosticMessage;
        Overload_signatures_must_all_be_exported_or_non_exported: DiagnosticMessage;
        Overload_signatures_must_all_be_ambient_or_non_ambient: DiagnosticMessage;
        Overload_signatures_must_all_be_public_private_or_protected: DiagnosticMessage;
        Overload_signatures_must_all_be_optional_or_required: DiagnosticMessage;
        Function_overload_must_be_static: DiagnosticMessage;
        Function_overload_must_not_be_static: DiagnosticMessage;
        Function_implementation_name_must_be_0: DiagnosticMessage;
        Constructor_implementation_is_missing: DiagnosticMessage;
        Function_implementation_is_missing_or_not_immediately_following_the_declaration: DiagnosticMessage;
        Multiple_constructor_implementations_are_not_allowed: DiagnosticMessage;
        Duplicate_function_implementation: DiagnosticMessage;
        This_overload_signature_is_not_compatible_with_its_implementation_signature: DiagnosticMessage;
        Individual_declarations_in_merged_declaration_0_must_be_all_exported_or_all_local: DiagnosticMessage;
        Duplicate_identifier_arguments_Compiler_uses_arguments_to_initialize_rest_parameters: DiagnosticMessage;
        Declaration_name_conflicts_with_built_in_global_identifier_0: DiagnosticMessage;
        constructor_cannot_be_used_as_a_parameter_property_name: DiagnosticMessage;
        Duplicate_identifier_this_Compiler_uses_variable_declaration_this_to_capture_this_reference: DiagnosticMessage;
        Expression_resolves_to_variable_declaration_this_that_compiler_uses_to_capture_this_reference: DiagnosticMessage;
        Duplicate_identifier_super_Compiler_uses_super_to_capture_base_class_reference: DiagnosticMessage;
        Expression_resolves_to_super_that_compiler_uses_to_capture_base_class_reference: DiagnosticMessage;
        Subsequent_variable_declarations_must_have_the_same_type_Variable_0_must_be_of_type_1_but_here_has_type_2: DiagnosticMessage;
        The_left_hand_side_of_a_for_in_statement_cannot_use_a_type_annotation: DiagnosticMessage;
        The_left_hand_side_of_a_for_in_statement_must_be_of_type_string_or_any: DiagnosticMessage;
        The_left_hand_side_of_a_for_in_statement_must_be_a_variable_or_a_property_access: DiagnosticMessage;
        The_right_hand_side_of_a_for_in_statement_must_be_of_type_any_an_object_type_or_a_type_parameter_but_here_has_type_0: DiagnosticMessage;
        Setters_cannot_return_a_value: DiagnosticMessage;
        Return_type_of_constructor_signature_must_be_assignable_to_the_instance_type_of_the_class: DiagnosticMessage;
        The_with_statement_is_not_supported_All_symbols_in_a_with_block_will_have_type_any: DiagnosticMessage;
        Property_0_of_type_1_is_not_assignable_to_string_index_type_2: DiagnosticMessage;
        Property_0_of_type_1_is_not_assignable_to_numeric_index_type_2: DiagnosticMessage;
        Numeric_index_type_0_is_not_assignable_to_string_index_type_1: DiagnosticMessage;
        Class_name_cannot_be_0: DiagnosticMessage;
        Class_0_incorrectly_extends_base_class_1: DiagnosticMessage;
        Property_0_in_type_1_is_not_assignable_to_the_same_property_in_base_type_2: DiagnosticMessage;
        Class_static_side_0_incorrectly_extends_base_class_static_side_1: DiagnosticMessage;
        Type_of_computed_property_s_value_is_0_which_is_not_assignable_to_type_1: DiagnosticMessage;
        Types_of_construct_signatures_are_incompatible: DiagnosticMessage;
        Class_0_incorrectly_implements_interface_1: DiagnosticMessage;
        A_class_can_only_implement_an_object_type_or_intersection_of_object_types_with_statically_known_members: DiagnosticMessage;
        Class_0_defines_instance_member_function_1_but_extended_class_2_defines_it_as_instance_member_accessor: DiagnosticMessage;
        Class_0_defines_instance_member_property_1_but_extended_class_2_defines_it_as_instance_member_function: DiagnosticMessage;
        Class_0_defines_instance_member_accessor_1_but_extended_class_2_defines_it_as_instance_member_function: DiagnosticMessage;
        Interface_name_cannot_be_0: DiagnosticMessage;
        All_declarations_of_0_must_have_identical_type_parameters: DiagnosticMessage;
        Interface_0_incorrectly_extends_interface_1: DiagnosticMessage;
        Enum_name_cannot_be_0: DiagnosticMessage;
        In_an_enum_with_multiple_declarations_only_one_declaration_can_omit_an_initializer_for_its_first_enum_element: DiagnosticMessage;
        A_namespace_declaration_cannot_be_in_a_different_file_from_a_class_or_function_with_which_it_is_merged: DiagnosticMessage;
        A_namespace_declaration_cannot_be_located_prior_to_a_class_or_function_with_which_it_is_merged: DiagnosticMessage;
        Ambient_modules_cannot_be_nested_in_other_modules_or_namespaces: DiagnosticMessage;
        Ambient_module_declaration_cannot_specify_relative_module_name: DiagnosticMessage;
        Module_0_is_hidden_by_a_local_declaration_with_the_same_name: DiagnosticMessage;
        Import_name_cannot_be_0: DiagnosticMessage;
        Import_or_export_declaration_in_an_ambient_module_declaration_cannot_reference_module_through_relative_module_name: DiagnosticMessage;
        Import_declaration_conflicts_with_local_declaration_of_0: DiagnosticMessage;
        Duplicate_identifier_0_Compiler_reserves_name_1_in_top_level_scope_of_a_module: DiagnosticMessage;
        Types_have_separate_declarations_of_a_private_property_0: DiagnosticMessage;
        Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2: DiagnosticMessage;
        Property_0_is_protected_in_type_1_but_public_in_type_2: DiagnosticMessage;
        Property_0_is_protected_and_only_accessible_within_class_1_and_its_subclasses: DiagnosticMessage;
        Property_0_is_protected_and_only_accessible_through_an_instance_of_class_1: DiagnosticMessage;
        The_0_operator_is_not_allowed_for_boolean_types_Consider_using_1_instead: DiagnosticMessage;
        Block_scoped_variable_0_used_before_its_declaration: DiagnosticMessage;
        Class_0_used_before_its_declaration: DiagnosticMessage;
        Enum_0_used_before_its_declaration: DiagnosticMessage;
        Cannot_redeclare_block_scoped_variable_0: DiagnosticMessage;
        An_enum_member_cannot_have_a_numeric_name: DiagnosticMessage;
        The_type_argument_for_type_parameter_0_cannot_be_inferred_from_the_usage_Consider_specifying_the_type_arguments_explicitly: DiagnosticMessage;
        Variable_0_is_used_before_being_assigned: DiagnosticMessage;
        Type_argument_candidate_1_is_not_a_valid_type_argument_because_it_is_not_a_supertype_of_candidate_0: DiagnosticMessage;
        Type_alias_0_circularly_references_itself: DiagnosticMessage;
        Type_alias_name_cannot_be_0: DiagnosticMessage;
        An_AMD_module_cannot_have_multiple_name_assignments: DiagnosticMessage;
        Module_0_declares_1_locally_but_it_is_not_exported: DiagnosticMessage;
        Module_0_declares_1_locally_but_it_is_exported_as_2: DiagnosticMessage;
        Type_0_is_not_an_array_type: DiagnosticMessage;
        A_rest_element_must_be_last_in_a_destructuring_pattern: DiagnosticMessage;
        A_binding_pattern_parameter_cannot_be_optional_in_an_implementation_signature: DiagnosticMessage;
        A_computed_property_name_must_be_of_type_string_number_symbol_or_any: DiagnosticMessage;
        this_cannot_be_referenced_in_a_computed_property_name: DiagnosticMessage;
        super_cannot_be_referenced_in_a_computed_property_name: DiagnosticMessage;
        A_computed_property_name_cannot_reference_a_type_parameter_from_its_containing_type: DiagnosticMessage;
        Cannot_find_global_value_0: DiagnosticMessage;
        The_0_operator_cannot_be_applied_to_type_symbol: DiagnosticMessage;
        Symbol_reference_does_not_refer_to_the_global_Symbol_constructor_object: DiagnosticMessage;
        A_computed_property_name_of_the_form_0_must_be_of_type_symbol: DiagnosticMessage;
        Spread_operator_in_new_expressions_is_only_available_when_targeting_ECMAScript_5_and_higher: DiagnosticMessage;
        Enum_declarations_must_all_be_const_or_non_const: DiagnosticMessage;
        const_enum_member_initializers_can_only_contain_literal_values_and_other_computed_enum_values: DiagnosticMessage;
        const_enums_can_only_be_used_in_property_or_index_access_expressions_or_the_right_hand_side_of_an_import_declaration_or_export_assignment_or_type_query: DiagnosticMessage;
        A_const_enum_member_can_only_be_accessed_using_a_string_literal: DiagnosticMessage;
        const_enum_member_initializer_was_evaluated_to_a_non_finite_value: DiagnosticMessage;
        const_enum_member_initializer_was_evaluated_to_disallowed_value_NaN: DiagnosticMessage;
        Property_0_does_not_exist_on_const_enum_1: DiagnosticMessage;
        let_is_not_allowed_to_be_used_as_a_name_in_let_or_const_declarations: DiagnosticMessage;
        Cannot_initialize_outer_scoped_variable_0_in_the_same_scope_as_block_scoped_declaration_1: DiagnosticMessage;
        The_left_hand_side_of_a_for_of_statement_cannot_use_a_type_annotation: DiagnosticMessage;
        Export_declaration_conflicts_with_exported_declaration_of_0: DiagnosticMessage;
        The_left_hand_side_of_a_for_of_statement_must_be_a_variable_or_a_property_access: DiagnosticMessage;
        Type_0_must_have_a_Symbol_iterator_method_that_returns_an_iterator: DiagnosticMessage;
        An_iterator_must_have_a_next_method: DiagnosticMessage;
        The_type_returned_by_the_0_method_of_an_iterator_must_have_a_value_property: DiagnosticMessage;
        The_left_hand_side_of_a_for_in_statement_cannot_be_a_destructuring_pattern: DiagnosticMessage;
        Cannot_redeclare_identifier_0_in_catch_clause: DiagnosticMessage;
        Tuple_type_0_of_length_1_has_no_element_at_index_2: DiagnosticMessage;
        Using_a_string_in_a_for_of_statement_is_only_supported_in_ECMAScript_5_and_higher: DiagnosticMessage;
        Type_0_is_not_an_array_type_or_a_string_type: DiagnosticMessage;
        The_arguments_object_cannot_be_referenced_in_an_arrow_function_in_ES3_and_ES5_Consider_using_a_standard_function_expression: DiagnosticMessage;
        This_module_can_only_be_referenced_with_ECMAScript_imports_Slashexports_by_turning_on_the_0_flag_and_referencing_its_default_export: DiagnosticMessage;
        Module_0_uses_export_and_cannot_be_used_with_export_Asterisk: DiagnosticMessage;
        An_interface_can_only_extend_an_identifier_Slashqualified_name_with_optional_type_arguments: DiagnosticMessage;
        A_class_can_only_implement_an_identifier_Slashqualified_name_with_optional_type_arguments: DiagnosticMessage;
        A_rest_element_cannot_contain_a_binding_pattern: DiagnosticMessage;
        _0_is_referenced_directly_or_indirectly_in_its_own_type_annotation: DiagnosticMessage;
        Cannot_find_namespace_0: DiagnosticMessage;
        Type_0_must_have_a_Symbol_asyncIterator_method_that_returns_an_async_iterator: DiagnosticMessage;
        A_generator_cannot_have_a_void_type_annotation: DiagnosticMessage;
        _0_is_referenced_directly_or_indirectly_in_its_own_base_expression: DiagnosticMessage;
        Type_0_is_not_a_constructor_function_type: DiagnosticMessage;
        No_base_constructor_has_the_specified_number_of_type_arguments: DiagnosticMessage;
        Base_constructor_return_type_0_is_not_an_object_type_or_intersection_of_object_types_with_statically_known_members: DiagnosticMessage;
        Base_constructors_must_all_have_the_same_return_type: DiagnosticMessage;
        Cannot_create_an_instance_of_an_abstract_class: DiagnosticMessage;
        Overload_signatures_must_all_be_abstract_or_non_abstract: DiagnosticMessage;
        Abstract_method_0_in_class_1_cannot_be_accessed_via_super_expression: DiagnosticMessage;
        Classes_containing_abstract_methods_must_be_marked_abstract: DiagnosticMessage;
        Non_abstract_class_0_does_not_implement_inherited_abstract_member_1_from_class_2: DiagnosticMessage;
        All_declarations_of_an_abstract_method_must_be_consecutive: DiagnosticMessage;
        Cannot_assign_an_abstract_constructor_type_to_a_non_abstract_constructor_type: DiagnosticMessage;
        A_this_based_type_guard_is_not_compatible_with_a_parameter_based_type_guard: DiagnosticMessage;
        An_async_iterator_must_have_a_next_method: DiagnosticMessage;
        Duplicate_identifier_0_Compiler_uses_declaration_1_to_support_async_functions: DiagnosticMessage;
        Expression_resolves_to_variable_declaration_0_that_compiler_uses_to_support_async_functions: DiagnosticMessage;
        The_arguments_object_cannot_be_referenced_in_an_async_function_or_method_in_ES3_and_ES5_Consider_using_a_standard_function_or_method: DiagnosticMessage;
        yield_expressions_cannot_be_used_in_a_parameter_initializer: DiagnosticMessage;
        await_expressions_cannot_be_used_in_a_parameter_initializer: DiagnosticMessage;
        Initializer_provides_no_value_for_this_binding_element_and_the_binding_element_has_no_default_value: DiagnosticMessage;
        A_this_type_is_available_only_in_a_non_static_member_of_a_class_or_interface: DiagnosticMessage;
        The_inferred_type_of_0_references_an_inaccessible_1_type_A_type_annotation_is_necessary: DiagnosticMessage;
        A_module_cannot_have_multiple_default_exports: DiagnosticMessage;
        Duplicate_identifier_0_Compiler_reserves_name_1_in_top_level_scope_of_a_module_containing_async_functions: DiagnosticMessage;
        Property_0_is_incompatible_with_index_signature: DiagnosticMessage;
        Object_is_possibly_null: DiagnosticMessage;
        Object_is_possibly_undefined: DiagnosticMessage;
        Object_is_possibly_null_or_undefined: DiagnosticMessage;
        A_function_returning_never_cannot_have_a_reachable_end_point: DiagnosticMessage;
        Enum_type_0_has_members_with_initializers_that_are_not_literals: DiagnosticMessage;
        Type_0_cannot_be_used_to_index_type_1: DiagnosticMessage;
        Type_0_has_no_matching_index_signature_for_type_1: DiagnosticMessage;
        Type_0_cannot_be_used_as_an_index_type: DiagnosticMessage;
        Cannot_assign_to_0_because_it_is_not_a_variable: DiagnosticMessage;
        Cannot_assign_to_0_because_it_is_a_read_only_property: DiagnosticMessage;
        The_target_of_an_assignment_must_be_a_variable_or_a_property_access: DiagnosticMessage;
        Index_signature_in_type_0_only_permits_reading: DiagnosticMessage;
        Duplicate_identifier_newTarget_Compiler_uses_variable_declaration_newTarget_to_capture_new_target_meta_property_reference: DiagnosticMessage;
        Expression_resolves_to_variable_declaration_newTarget_that_compiler_uses_to_capture_new_target_meta_property_reference: DiagnosticMessage;
        A_mixin_class_must_have_a_constructor_with_a_single_rest_parameter_of_type_any: DiagnosticMessage;
        The_type_returned_by_the_0_method_of_an_async_iterator_must_be_a_promise_for_a_type_with_a_value_property: DiagnosticMessage;
        Type_0_is_not_an_array_type_or_does_not_have_a_Symbol_iterator_method_that_returns_an_iterator: DiagnosticMessage;
        Type_0_is_not_an_array_type_or_a_string_type_or_does_not_have_a_Symbol_iterator_method_that_returns_an_iterator: DiagnosticMessage;
        Property_0_does_not_exist_on_type_1_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_2_or_later: DiagnosticMessage;
        Property_0_does_not_exist_on_type_1_Did_you_mean_2: DiagnosticMessage;
        Cannot_find_name_0_Did_you_mean_1: DiagnosticMessage;
        Computed_values_are_not_permitted_in_an_enum_with_string_valued_members: DiagnosticMessage;
        Expected_0_arguments_but_got_1: DiagnosticMessage;
        Expected_at_least_0_arguments_but_got_1: DiagnosticMessage;
        Expected_0_arguments_but_got_1_or_more: DiagnosticMessage;
        Expected_at_least_0_arguments_but_got_1_or_more: DiagnosticMessage;
        Expected_0_type_arguments_but_got_1: DiagnosticMessage;
        Type_0_has_no_properties_in_common_with_type_1: DiagnosticMessage;
        Value_of_type_0_has_no_properties_in_common_with_type_1_Did_you_mean_to_call_it: DiagnosticMessage;
        Object_literal_may_only_specify_known_properties_but_0_does_not_exist_in_type_1_Did_you_mean_to_write_2: DiagnosticMessage;
        Base_class_expressions_cannot_reference_class_type_parameters: DiagnosticMessage;
        The_containing_function_or_module_body_is_too_large_for_control_flow_analysis: DiagnosticMessage;
        Property_0_has_no_initializer_and_is_not_definitely_assigned_in_the_constructor: DiagnosticMessage;
        Property_0_is_used_before_being_assigned: DiagnosticMessage;
        A_rest_element_cannot_have_a_property_name: DiagnosticMessage;
        Enum_declarations_can_only_merge_with_namespace_or_other_enum_declarations: DiagnosticMessage;
        Type_0_is_not_an_array_type_or_a_string_type_Use_compiler_option_downlevelIteration_to_allow_iterating_of_iterators: DiagnosticMessage;
        Object_is_of_type_unknown: DiagnosticMessage;
        Rest_signatures_are_incompatible: DiagnosticMessage;
        Property_0_is_incompatible_with_rest_element_type: DiagnosticMessage;
        A_rest_element_type_must_be_an_array_type: DiagnosticMessage;
        No_overload_expects_0_arguments_but_overloads_do_exist_that_expect_either_1_or_2_arguments: DiagnosticMessage;
        Property_0_does_not_exist_on_type_1_Did_you_mean_to_access_the_static_member_2_instead: DiagnosticMessage;
        Return_type_annotation_circularly_references_itself: DiagnosticMessage;
        Unused_ts_expect_error_directive: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_node_Try_npm_i_save_dev_types_Slashnode: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_jQuery_Try_npm_i_save_dev_types_Slashjquery: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_a_test_runner_Try_npm_i_save_dev_types_Slashjest_or_npm_i_save_dev_types_Slashmocha: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_1_or_later: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_include_dom: DiagnosticMessage;
        _0_only_refers_to_a_type_but_is_being_used_as_a_value_here_Do_you_need_to_change_your_target_library_Try_changing_the_lib_compiler_option_to_es2015_or_later: DiagnosticMessage;
        Enum_type_0_circularly_references_itself: DiagnosticMessage;
        JSDoc_type_0_circularly_references_itself: DiagnosticMessage;
        Cannot_assign_to_0_because_it_is_a_constant: DiagnosticMessage;
        Type_instantiation_is_excessively_deep_and_possibly_infinite: DiagnosticMessage;
        Expression_produces_a_union_type_that_is_too_complex_to_represent: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_node_Try_npm_i_save_dev_types_Slashnode_and_then_add_node_to_the_types_field_in_your_tsconfig: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_jQuery_Try_npm_i_save_dev_types_Slashjquery_and_then_add_jquery_to_the_types_field_in_your_tsconfig: DiagnosticMessage;
        Cannot_find_name_0_Do_you_need_to_install_type_definitions_for_a_test_runner_Try_npm_i_save_dev_types_Slashjest_or_npm_i_save_dev_types_Slashmocha_and_then_add_jest_or_mocha_to_the_types_field_in_your_tsconfig: DiagnosticMessage;
        This_module_is_declared_with_using_export_and_can_only_be_used_with_a_default_import_when_using_the_0_flag: DiagnosticMessage;
        _0_can_only_be_imported_by_using_a_default_import: DiagnosticMessage;
        _0_can_only_be_imported_by_turning_on_the_esModuleInterop_flag_and_using_a_default_import: DiagnosticMessage;
        _0_can_only_be_imported_by_using_a_require_call_or_by_using_a_default_import: DiagnosticMessage;
        _0_can_only_be_imported_by_using_a_require_call_or_by_turning_on_the_esModuleInterop_flag_and_using_a_default_import: DiagnosticMessage;
        JSX_element_attributes_type_0_may_not_be_a_union_type: DiagnosticMessage;
        The_return_type_of_a_JSX_element_constructor_must_return_an_object_type: DiagnosticMessage;
        JSX_element_implicitly_has_type_any_because_the_global_type_JSX_Element_does_not_exist: DiagnosticMessage;
        Property_0_in_type_1_is_not_assignable_to_type_2: DiagnosticMessage;
        JSX_element_type_0_does_not_have_any_construct_or_call_signatures: DiagnosticMessage;
        JSX_element_type_0_is_not_a_constructor_function_for_JSX_elements: DiagnosticMessage;
        Property_0_of_JSX_spread_attribute_is_not_assignable_to_target_property: DiagnosticMessage;
        JSX_element_class_does_not_support_attributes_because_it_does_not_have_a_0_property: DiagnosticMessage;
        The_global_type_JSX_0_may_not_have_more_than_one_property: DiagnosticMessage;
        JSX_spread_child_must_be_an_array_type: DiagnosticMessage;
        _0_is_defined_as_an_accessor_in_class_1_but_is_overridden_here_in_2_as_an_instance_property: DiagnosticMessage;
        _0_is_defined_as_a_property_in_class_1_but_is_overridden_here_in_2_as_an_accessor: DiagnosticMessage;
        Property_0_will_overwrite_the_base_property_in_1_If_this_is_intentional_add_an_initializer_Otherwise_add_a_declare_modifier_or_remove_the_redundant_declaration: DiagnosticMessage;
        Module_0_has_no_default_export_Did_you_mean_to_use_import_1_from_0_instead: DiagnosticMessage;
        Module_0_has_no_exported_member_1_Did_you_mean_to_use_import_1_from_0_instead: DiagnosticMessage;
        Type_of_property_0_circularly_references_itself_in_mapped_type_1: DiagnosticMessage;
        _0_can_only_be_imported_by_using_import_1_require_2_or_a_default_import: DiagnosticMessage;
        _0_can_only_be_imported_by_using_import_1_require_2_or_by_turning_on_the_esModuleInterop_flag_and_using_a_default_import: DiagnosticMessage;
        Source_has_0_element_s_but_target_requires_1: DiagnosticMessage;
        Source_has_0_element_s_but_target_allows_only_1: DiagnosticMessage;
        Target_requires_0_element_s_but_source_may_have_fewer: DiagnosticMessage;
        Target_allows_only_0_element_s_but_source_may_have_more: DiagnosticMessage;
        Source_provides_no_match_for_required_element_at_position_0_in_target: DiagnosticMessage;
        Source_provides_no_match_for_variadic_element_at_position_0_in_target: DiagnosticMessage;
        Variadic_element_at_position_0_in_source_does_not_match_element_at_position_1_in_target: DiagnosticMessage;
        Type_at_position_0_in_source_is_not_compatible_with_type_at_position_1_in_target: DiagnosticMessage;
        Type_at_positions_0_through_1_in_source_is_not_compatible_with_type_at_position_2_in_target: DiagnosticMessage;
        Cannot_augment_module_0_with_value_exports_because_it_resolves_to_a_non_module_entity: DiagnosticMessage;
        A_member_initializer_in_a_enum_declaration_cannot_reference_members_declared_after_it_including_members_defined_in_other_enums: DiagnosticMessage;
        Merged_declaration_0_cannot_include_a_default_export_declaration_Consider_adding_a_separate_export_default_0_declaration_instead: DiagnosticMessage;
        Non_abstract_class_expression_does_not_implement_inherited_abstract_member_0_from_class_1: DiagnosticMessage;
        Exported_external_package_typings_file_cannot_contain_tripleslash_references_Please_contact_the_package_author_to_update_the_package_definition: DiagnosticMessage;
        Exported_external_package_typings_file_0_is_not_a_module_Please_contact_the_package_author_to_update_the_package_definition: DiagnosticMessage;
        JSX_expressions_must_have_one_parent_element: DiagnosticMessage;
        Type_0_provides_no_match_for_the_signature_1: DiagnosticMessage;
        super_is_only_allowed_in_members_of_object_literal_expressions_when_option_target_is_ES2015_or_higher: DiagnosticMessage;
        super_can_only_be_referenced_in_members_of_derived_classes_or_object_literal_expressions: DiagnosticMessage;
        Cannot_export_0_Only_local_declarations_can_be_exported_from_a_module: DiagnosticMessage;
        Cannot_find_name_0_Did_you_mean_the_static_member_1_0: DiagnosticMessage;
        Cannot_find_name_0_Did_you_mean_the_instance_member_this_0: DiagnosticMessage;
        Invalid_module_name_in_augmentation_module_0_cannot_be_found: DiagnosticMessage;
        Invalid_module_name_in_augmentation_Module_0_resolves_to_an_untyped_module_at_1_which_cannot_be_augmented: DiagnosticMessage;
        Exports_and_export_assignments_are_not_permitted_in_module_augmentations: DiagnosticMessage;
        Imports_are_not_permitted_in_module_augmentations_Consider_moving_them_to_the_enclosing_external_module: DiagnosticMessage;
        export_modifier_cannot_be_applied_to_ambient_modules_and_module_augmentations_since_they_are_always_visible: DiagnosticMessage;
        Augmentations_for_the_global_scope_can_only_be_directly_nested_in_external_modules_or_ambient_module_declarations: DiagnosticMessage;
        Augmentations_for_the_global_scope_should_have_declare_modifier_unless_they_appear_in_already_ambient_context: DiagnosticMessage;
        Cannot_augment_module_0_because_it_resolves_to_a_non_module_entity: DiagnosticMessage;
        Cannot_assign_a_0_constructor_type_to_a_1_constructor_type: DiagnosticMessage;
        Constructor_of_class_0_is_private_and_only_accessible_within_the_class_declaration: DiagnosticMessage;
        Constructor_of_class_0_is_protected_and_only_accessible_within_the_class_declaration: DiagnosticMessage;
        Cannot_extend_a_class_0_Class_constructor_is_marked_as_private: DiagnosticMessage;
        Accessors_must_both_be_abstract_or_non_abstract: DiagnosticMessage;
        A_type_predicate_s_type_must_be_assignable_to_its_parameter_s_type: DiagnosticMessage;
        Type_0_is_not_comparable_to_type_1: DiagnosticMessage;
        A_function_that_is_called_with_the_new_keyword_cannot_have_a_this_type_that_is_void: DiagnosticMessage;
        A_0_parameter_must_be_the_first_parameter: DiagnosticMessage;
        A_constructor_cannot_have_a_this_parameter: DiagnosticMessage;
        get_and_set_accessor_must_have_the_same_this_type: DiagnosticMessage;
        this_implicitly_has_type_any_because_it_does_not_have_a_type_annotation: DiagnosticMessage;
        The_this_context_of_type_0_is_not_assignable_to_method_s_this_of_type_1: DiagnosticMessage;
        The_this_types_of_each_signature_are_incompatible: DiagnosticMessage;
        _0_refers_to_a_UMD_global_but_the_current_file_is_a_module_Consider_adding_an_import_instead: DiagnosticMessage;
        All_declarations_of_0_must_have_identical_modifiers: DiagnosticMessage;
        Cannot_find_type_definition_file_for_0: DiagnosticMessage;
        Cannot_extend_an_interface_0_Did_you_mean_implements: DiagnosticMessage;
        _0_only_refers_to_a_type_but_is_being_used_as_a_value_here_Did_you_mean_to_use_1_in_0: DiagnosticMessage;
        An_import_path_cannot_end_with_a_0_extension_Consider_importing_1_instead: DiagnosticMessage;
        _0_is_a_primitive_but_1_is_a_wrapper_object_Prefer_using_0_when_possible: DiagnosticMessage;
        _0_only_refers_to_a_type_but_is_being_used_as_a_value_here: DiagnosticMessage;
        Namespace_0_has_no_exported_member_1: DiagnosticMessage;
        Left_side_of_comma_operator_is_unused_and_has_no_side_effects: DiagnosticMessage;
        The_Object_type_is_assignable_to_very_few_other_types_Did_you_mean_to_use_the_any_type_instead: DiagnosticMessage;
        An_async_function_or_method_must_return_a_Promise_Make_sure_you_have_a_declaration_for_Promise_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
        Spread_types_may_only_be_created_from_object_types: DiagnosticMessage;
        Static_property_0_conflicts_with_built_in_property_Function_0_of_constructor_function_1: DiagnosticMessage;
        Rest_types_may_only_be_created_from_object_types: DiagnosticMessage;
        The_target_of_an_object_rest_assignment_must_be_a_variable_or_a_property_access: DiagnosticMessage;
        _0_only_refers_to_a_type_but_is_being_used_as_a_namespace_here: DiagnosticMessage;
        The_operand_of_a_delete_operator_must_be_a_property_reference: DiagnosticMessage;
        The_operand_of_a_delete_operator_cannot_be_a_read_only_property: DiagnosticMessage;
        An_async_function_or_method_in_ES5_SlashES3_requires_the_Promise_constructor_Make_sure_you_have_a_declaration_for_the_Promise_constructor_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
        Required_type_parameters_may_not_follow_optional_type_parameters: DiagnosticMessage;
        Generic_type_0_requires_between_1_and_2_type_arguments: DiagnosticMessage;
        Cannot_use_namespace_0_as_a_value: DiagnosticMessage;
        Cannot_use_namespace_0_as_a_type: DiagnosticMessage;
        _0_are_specified_twice_The_attribute_named_0_will_be_overwritten: DiagnosticMessage;
        A_dynamic_import_call_returns_a_Promise_Make_sure_you_have_a_declaration_for_Promise_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
        A_dynamic_import_call_in_ES5_SlashES3_requires_the_Promise_constructor_Make_sure_you_have_a_declaration_for_the_Promise_constructor_or_include_ES2015_in_your_lib_option: DiagnosticMessage;
        Cannot_access_0_1_because_0_is_a_type_but_not_a_namespace_Did_you_mean_to_retrieve_the_type_of_the_property_1_in_0_with_0_1: DiagnosticMessage;
        The_expression_of_an_export_assignment_must_be_an_identifier_or_qualified_name_in_an_ambient_context: DiagnosticMessage;
        Abstract_property_0_in_class_1_cannot_be_accessed_in_the_constructor: DiagnosticMessage;
        Type_parameter_0_has_a_circular_default: DiagnosticMessage;
        Subsequent_property_declarations_must_have_the_same_type_Property_0_must_be_of_type_1_but_here_has_type_2: DiagnosticMessage;
        Duplicate_property_0: DiagnosticMessage;
        Type_0_is_not_assignable_to_type_1_Two_different_types_with_this_name_exist_but_they_are_unrelated: DiagnosticMessage;
        Class_0_incorrectly_implements_class_1_Did_you_mean_to_extend_1_and_inherit_its_members_as_a_subclass: DiagnosticMessage;
        Cannot_invoke_an_object_which_is_possibly_null: DiagnosticMessage;
        Cannot_invoke_an_object_which_is_possibly_undefined: DiagnosticMessage;
        Cannot_invoke_an_object_which_is_possibly_null_or_undefined: DiagnosticMessage;
        _0_has_no_exported_member_named_1_Did_you_mean_2: DiagnosticMessage;
        Class_name_cannot_be_Object_when_targeting_ES5_with_module_0: DiagnosticMessage;
        Cannot_find_lib_definition_for_0: DiagnosticMessage;
        Cannot_find_lib_definition_for_0_Did_you_mean_1: DiagnosticMessage;
        _0_is_declared_here: DiagnosticMessage;
        Property_0_is_used_before_its_initialization: DiagnosticMessage;
        An_arrow_function_cannot_have_a_this_parameter: DiagnosticMessage;
        Implicit_conversion_of_a_symbol_to_a_string_will_fail_at_runtime_Consider_wrapping_this_expression_in_String: DiagnosticMessage;
        Cannot_find_module_0_Consider_using_resolveJsonModule_to_import_module_with_json_extension: DiagnosticMessage;
        Property_0_was_also_declared_here: DiagnosticMessage;
        Are_you_missing_a_semicolon: DiagnosticMessage;
        Did_you_mean_for_0_to_be_constrained_to_type_new_args_Colon_any_1: DiagnosticMessage;
        Operator_0_cannot_be_applied_to_type_1: DiagnosticMessage;
        BigInt_literals_are_not_available_when_targeting_lower_than_ES2020: DiagnosticMessage;
        An_outer_value_of_this_is_shadowed_by_this_container: DiagnosticMessage;
        Type_0_is_missing_the_following_properties_from_type_1_Colon_2: DiagnosticMessage;
        Type_0_is_missing_the_following_properties_from_type_1_Colon_2_and_3_more: DiagnosticMessage;
        Property_0_is_missing_in_type_1_but_required_in_type_2: DiagnosticMessage;
        The_inferred_type_of_0_cannot_be_named_without_a_reference_to_1_This_is_likely_not_portable_A_type_annotation_is_necessary: DiagnosticMessage;
        No_overload_expects_0_type_arguments_but_overloads_do_exist_that_expect_either_1_or_2_type_arguments: DiagnosticMessage;
        Type_parameter_defaults_can_only_reference_previously_declared_type_parameters: DiagnosticMessage;
        This_JSX_tag_s_0_prop_expects_type_1_which_requires_multiple_children_but_only_a_single_child_was_provided: DiagnosticMessage;
        This_JSX_tag_s_0_prop_expects_a_single_child_of_type_1_but_multiple_children_were_provided: DiagnosticMessage;
        _0_components_don_t_accept_text_as_child_elements_Text_in_JSX_has_the_type_string_but_the_expected_type_of_1_is_2: DiagnosticMessage;
        Cannot_access_ambient_const_enums_when_the_isolatedModules_flag_is_provided: DiagnosticMessage;
        _0_refers_to_a_value_but_is_being_used_as_a_type_here_Did_you_mean_typeof_0: DiagnosticMessage;
        The_implementation_signature_is_declared_here: DiagnosticMessage;
        Circularity_originates_in_type_at_this_location: DiagnosticMessage;
        The_first_export_default_is_here: DiagnosticMessage;
        Another_export_default_is_here: DiagnosticMessage;
        super_may_not_use_type_arguments: DiagnosticMessage;
        No_constituent_of_type_0_is_callable: DiagnosticMessage;
        Not_all_constituents_of_type_0_are_callable: DiagnosticMessage;
        Type_0_has_no_call_signatures: DiagnosticMessage;
        Each_member_of_the_union_type_0_has_signatures_but_none_of_those_signatures_are_compatible_with_each_other: DiagnosticMessage;
        No_constituent_of_type_0_is_constructable: DiagnosticMessage;
        Not_all_constituents_of_type_0_are_constructable: DiagnosticMessage;
        Type_0_has_no_construct_signatures: DiagnosticMessage;
        Each_member_of_the_union_type_0_has_construct_signatures_but_none_of_those_signatures_are_compatible_with_each_other: DiagnosticMessage;
        Cannot_iterate_value_because_the_next_method_of_its_iterator_expects_type_1_but_for_of_will_always_send_0: DiagnosticMessage;
        Cannot_iterate_value_because_the_next_method_of_its_iterator_expects_type_1_but_array_spread_will_always_send_0: DiagnosticMessage;
        Cannot_iterate_value_because_the_next_method_of_its_iterator_expects_type_1_but_array_destructuring_will_always_send_0: DiagnosticMessage;
        Cannot_delegate_iteration_to_value_because_the_next_method_of_its_iterator_expects_type_1_but_the_containing_generator_will_always_send_0: DiagnosticMessage;
        The_0_property_of_an_iterator_must_be_a_method: DiagnosticMessage;
        The_0_property_of_an_async_iterator_must_be_a_method: DiagnosticMessage;
        No_overload_matches_this_call: DiagnosticMessage;
        The_last_overload_gave_the_following_error: DiagnosticMessage;
        The_last_overload_is_declared_here: DiagnosticMessage;
        Overload_0_of_1_2_gave_the_following_error: DiagnosticMessage;
        Did_you_forget_to_use_await: DiagnosticMessage;
        This_condition_will_always_return_true_since_the_function_is_always_defined_Did_you_mean_to_call_it_instead: DiagnosticMessage;
        Assertions_require_every_name_in_the_call_target_to_be_declared_with_an_explicit_type_annotation: DiagnosticMessage;
        Assertions_require_the_call_target_to_be_an_identifier_or_qualified_name: DiagnosticMessage;
        The_operand_of_an_increment_or_decrement_operator_may_not_be_an_optional_property_access: DiagnosticMessage;
        The_target_of_an_object_rest_assignment_may_not_be_an_optional_property_access: DiagnosticMessage;
        The_left_hand_side_of_an_assignment_expression_may_not_be_an_optional_property_access: DiagnosticMessage;
        The_left_hand_side_of_a_for_in_statement_may_not_be_an_optional_property_access: DiagnosticMessage;
        The_left_hand_side_of_a_for_of_statement_may_not_be_an_optional_property_access: DiagnosticMessage;
        _0_needs_an_explicit_type_annotation: DiagnosticMessage;
        _0_is_specified_more_than_once_so_this_usage_will_be_overwritten: DiagnosticMessage;
        get_and_set_accessors_cannot_declare_this_parameters: DiagnosticMessage;
        This_spread_always_overwrites_this_property: DiagnosticMessage;
        _0_cannot_be_used_as_a_JSX_component: DiagnosticMessage;
        Its_return_type_0_is_not_a_valid_JSX_element: DiagnosticMessage;
        Its_instance_type_0_is_not_a_valid_JSX_element: DiagnosticMessage;
        Its_element_type_0_is_not_a_valid_JSX_element: DiagnosticMessage;
        The_operand_of_a_delete_operator_must_be_optional: DiagnosticMessage;
        Exponentiation_cannot_be_performed_on_bigint_values_unless_the_target_option_is_set_to_es2016_or_later: DiagnosticMessage;
        Cannot_find_module_0_Did_you_mean_to_set_the_moduleResolution_option_to_node_or_to_add_aliases_to_the_paths_option: DiagnosticMessage;
        The_call_would_have_succeeded_against_this_implementation_but_implementation_signatures_of_overloads_are_not_externally_visible: DiagnosticMessage;
        Expected_0_arguments_but_got_1_Did_you_forget_to_include_void_in_your_type_argument_to_Promise: DiagnosticMessage;
        The_intrinsic_keyword_can_only_be_used_to_declare_compiler_provided_intrinsic_types: DiagnosticMessage;
        It_is_likely_that_you_are_missing_a_comma_to_separate_these_two_template_expressions_They_form_a_tagged_template_expression_which_cannot_be_invoked: DiagnosticMessage;
        A_mixin_class_that_extends_from_a_type_variable_containing_an_abstract_construct_signature_must_also_be_declared_abstract: DiagnosticMessage;
        The_declaration_was_marked_as_deprecated_here: DiagnosticMessage;
        Type_produces_a_tuple_type_that_is_too_large_to_represent: DiagnosticMessage;
        Expression_produces_a_tuple_type_that_is_too_large_to_represent: DiagnosticMessage;
        Import_declaration_0_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_public_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_method_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_exported_function_has_or_is_using_private_name_1: DiagnosticMessage;
        Implements_clause_of_exported_class_0_has_or_is_using_private_name_1: DiagnosticMessage;
        extends_clause_of_exported_class_0_has_or_is_using_private_name_1: DiagnosticMessage;
        extends_clause_of_exported_class_has_or_is_using_private_name_0: DiagnosticMessage;
        extends_clause_of_exported_interface_0_has_or_is_using_private_name_1: DiagnosticMessage;
        Exported_variable_0_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Exported_variable_0_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Exported_variable_0_has_or_is_using_private_name_1: DiagnosticMessage;
        Public_static_property_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Public_static_property_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Public_static_property_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Public_property_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Public_property_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Public_property_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Property_0_of_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Property_0_of_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_type_of_public_static_setter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_type_of_public_static_setter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_type_of_public_setter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_type_of_public_setter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Return_type_of_public_static_getter_0_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Return_type_of_public_static_getter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Return_type_of_public_static_getter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Return_type_of_public_getter_0_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Return_type_of_public_getter_0_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Return_type_of_public_getter_0_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named: DiagnosticMessage;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_name_0: DiagnosticMessage;
        Return_type_of_public_method_from_exported_class_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named: DiagnosticMessage;
        Return_type_of_public_method_from_exported_class_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_name_0: DiagnosticMessage;
        Return_type_of_method_from_exported_interface_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_method_from_exported_interface_has_or_is_using_private_name_0: DiagnosticMessage;
        Return_type_of_exported_function_has_or_is_using_name_0_from_external_module_1_but_cannot_be_named: DiagnosticMessage;
        Return_type_of_exported_function_has_or_is_using_name_0_from_private_module_1: DiagnosticMessage;
        Return_type_of_exported_function_has_or_is_using_private_name_0: DiagnosticMessage;
        Parameter_0_of_constructor_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Parameter_0_of_constructor_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_constructor_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_public_method_from_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Parameter_0_of_public_method_from_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_public_method_from_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_method_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_method_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_exported_function_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Parameter_0_of_exported_function_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_exported_function_has_or_is_using_private_name_1: DiagnosticMessage;
        Exported_type_alias_0_has_or_is_using_private_name_1: DiagnosticMessage;
        Default_export_of_the_module_has_or_is_using_private_name_0: DiagnosticMessage;
        Type_parameter_0_of_exported_type_alias_has_or_is_using_private_name_1: DiagnosticMessage;
        Exported_type_alias_0_has_or_is_using_private_name_1_from_module_2: DiagnosticMessage;
        Conflicting_definitions_for_0_found_at_1_and_2_Consider_installing_a_specific_version_of_this_library_to_resolve_the_conflict: DiagnosticMessage;
        Parameter_0_of_index_signature_from_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_index_signature_from_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Property_0_of_exported_class_expression_may_not_be_private_or_protected: DiagnosticMessage;
        Public_static_method_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Public_static_method_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Public_static_method_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Public_method_0_of_exported_class_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Public_method_0_of_exported_class_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Public_method_0_of_exported_class_has_or_is_using_private_name_1: DiagnosticMessage;
        Method_0_of_exported_interface_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Method_0_of_exported_interface_has_or_is_using_private_name_1: DiagnosticMessage;
        Type_parameter_0_of_exported_mapped_object_type_is_using_private_name_1: DiagnosticMessage;
        The_type_0_is_readonly_and_cannot_be_assigned_to_the_mutable_type_1: DiagnosticMessage;
        Private_or_protected_member_0_cannot_be_accessed_on_a_type_parameter: DiagnosticMessage;
        Parameter_0_of_accessor_has_or_is_using_private_name_1: DiagnosticMessage;
        Parameter_0_of_accessor_has_or_is_using_name_1_from_private_module_2: DiagnosticMessage;
        Parameter_0_of_accessor_has_or_is_using_name_1_from_external_module_2_but_cannot_be_named: DiagnosticMessage;
        Type_arguments_for_0_circularly_reference_themselves: DiagnosticMessage;
        Tuple_type_arguments_circularly_reference_themselves: DiagnosticMessage;
        Property_0_comes_from_an_index_signature_so_it_must_be_accessed_with_0: DiagnosticMessage;
        The_current_host_does_not_support_the_0_option: DiagnosticMessage;
        Cannot_find_the_common_subdirectory_path_for_the_input_files: DiagnosticMessage;
        File_specification_cannot_end_in_a_recursive_directory_wildcard_Asterisk_Asterisk_Colon_0: DiagnosticMessage;
        Cannot_read_file_0_Colon_1: DiagnosticMessage;
        Failed_to_parse_file_0_Colon_1: DiagnosticMessage;
        Unknown_compiler_option_0: DiagnosticMessage;
        Compiler_option_0_requires_a_value_of_type_1: DiagnosticMessage;
        Unknown_compiler_option_0_Did_you_mean_1: DiagnosticMessage;
        Could_not_write_file_0_Colon_1: DiagnosticMessage;
        Option_project_cannot_be_mixed_with_source_files_on_a_command_line: DiagnosticMessage;
        Option_isolatedModules_can_only_be_used_when_either_option_module_is_provided_or_option_target_is_ES2015_or_higher: DiagnosticMessage;
        Option_0_cannot_be_specified_when_option_target_is_ES3: DiagnosticMessage;
        Option_0_can_only_be_used_when_either_option_inlineSourceMap_or_option_sourceMap_is_provided: DiagnosticMessage;
        Option_0_cannot_be_specified_without_specifying_option_1: DiagnosticMessage;
        Option_0_cannot_be_specified_with_option_1: DiagnosticMessage;
        A_tsconfig_json_file_is_already_defined_at_Colon_0: DiagnosticMessage;
        Cannot_write_file_0_because_it_would_overwrite_input_file: DiagnosticMessage;
        Cannot_write_file_0_because_it_would_be_overwritten_by_multiple_input_files: DiagnosticMessage;
        Cannot_find_a_tsconfig_json_file_at_the_specified_directory_Colon_0: DiagnosticMessage;
        The_specified_path_does_not_exist_Colon_0: DiagnosticMessage;
        Invalid_value_for_reactNamespace_0_is_not_a_valid_identifier: DiagnosticMessage;
        Pattern_0_can_have_at_most_one_Asterisk_character: DiagnosticMessage;
        Substitution_0_in_pattern_1_can_have_at_most_one_Asterisk_character: DiagnosticMessage;
        Substitutions_for_pattern_0_should_be_an_array: DiagnosticMessage;
        Substitution_0_for_pattern_1_has_incorrect_type_expected_string_got_2: DiagnosticMessage;
        File_specification_cannot_contain_a_parent_directory_that_appears_after_a_recursive_directory_wildcard_Asterisk_Asterisk_Colon_0: DiagnosticMessage;
        Substitutions_for_pattern_0_shouldn_t_be_an_empty_array: DiagnosticMessage;
        Invalid_value_for_jsxFactory_0_is_not_a_valid_identifier_or_qualified_name: DiagnosticMessage;
        Adding_a_tsconfig_json_file_will_help_organize_projects_that_contain_both_TypeScript_and_JavaScript_files_Learn_more_at_https_Colon_Slash_Slashaka_ms_Slashtsconfig: DiagnosticMessage;
        Option_0_cannot_be_specified_without_specifying_option_1_or_option_2: DiagnosticMessage;
        Option_resolveJsonModule_cannot_be_specified_without_node_module_resolution_strategy: DiagnosticMessage;
        Option_resolveJsonModule_can_only_be_specified_when_module_code_generation_is_commonjs_amd_es2015_or_esNext: DiagnosticMessage;
        Unknown_build_option_0: DiagnosticMessage;
        Build_option_0_requires_a_value_of_type_1: DiagnosticMessage;
        Option_incremental_can_only_be_specified_using_tsconfig_emitting_to_single_file_or_when_option_tsBuildInfoFile_is_specified: DiagnosticMessage;
        _0_is_assignable_to_the_constraint_of_type_1_but_1_could_be_instantiated_with_a_different_subtype_of_constraint_2: DiagnosticMessage;
        _0_and_1_operations_cannot_be_mixed_without_parentheses: DiagnosticMessage;
        Unknown_build_option_0_Did_you_mean_1: DiagnosticMessage;
        Unknown_watch_option_0: DiagnosticMessage;
        Unknown_watch_option_0_Did_you_mean_1: DiagnosticMessage;
        Watch_option_0_requires_a_value_of_type_1: DiagnosticMessage;
        Cannot_find_a_tsconfig_json_file_at_the_current_directory_Colon_0: DiagnosticMessage;
        _0_could_be_instantiated_with_an_arbitrary_type_which_could_be_unrelated_to_1: DiagnosticMessage;
        Cannot_read_file_0: DiagnosticMessage;
        Tuple_members_must_all_have_names_or_all_not_have_names: DiagnosticMessage;
        A_tuple_member_cannot_be_both_optional_and_rest: DiagnosticMessage;
        A_labeled_tuple_element_is_declared_as_optional_with_a_question_mark_after_the_name_and_before_the_colon_rather_than_after_the_type: DiagnosticMessage;
        A_labeled_tuple_element_is_declared_as_rest_with_a_before_the_name_rather_than_before_the_type: DiagnosticMessage;
        The_inferred_type_of_0_references_a_type_with_a_cyclic_structure_which_cannot_be_trivially_serialized_A_type_annotation_is_necessary: DiagnosticMessage;
        Option_0_cannot_be_specified_when_option_jsx_is_1: DiagnosticMessage;
        Non_relative_paths_are_not_allowed_when_baseUrl_is_not_set_Did_you_forget_a_leading_Slash: DiagnosticMessage;
        Option_preserveConstEnums_cannot_be_disabled_when_isolatedModules_is_enabled: DiagnosticMessage;
        Generates_a_sourcemap_for_each_corresponding_d_ts_file: DiagnosticMessage;
        Concatenate_and_emit_output_to_single_file: DiagnosticMessage;
        Generates_corresponding_d_ts_file: DiagnosticMessage;
        Specify_the_location_where_debugger_should_locate_map_files_instead_of_generated_locations: DiagnosticMessage;
        Specify_the_location_where_debugger_should_locate_TypeScript_files_instead_of_source_locations: DiagnosticMessage;
        Watch_input_files: DiagnosticMessage;
        Redirect_output_structure_to_the_directory: DiagnosticMessage;
        Do_not_erase_const_enum_declarations_in_generated_code: DiagnosticMessage;
        Do_not_emit_outputs_if_any_errors_were_reported: DiagnosticMessage;
        Do_not_emit_comments_to_output: DiagnosticMessage;
        Do_not_emit_outputs: DiagnosticMessage;
        Allow_default_imports_from_modules_with_no_default_export_This_does_not_affect_code_emit_just_typechecking: DiagnosticMessage;
        Skip_type_checking_of_declaration_files: DiagnosticMessage;
        Do_not_resolve_the_real_path_of_symlinks: DiagnosticMessage;
        Only_emit_d_ts_declaration_files: DiagnosticMessage;
        Specify_ECMAScript_target_version_Colon_ES3_default_ES5_ES2015_ES2016_ES2017_ES2018_ES2019_ES2020_or_ESNEXT: DiagnosticMessage;
        Specify_module_code_generation_Colon_none_commonjs_amd_system_umd_es2015_es2020_or_ESNext: DiagnosticMessage;
        Print_this_message: DiagnosticMessage;
        Print_the_compiler_s_version: DiagnosticMessage;
        Compile_the_project_given_the_path_to_its_configuration_file_or_to_a_folder_with_a_tsconfig_json: DiagnosticMessage;
        Syntax_Colon_0: DiagnosticMessage;
        options: DiagnosticMessage;
        file: DiagnosticMessage;
        Examples_Colon_0: DiagnosticMessage;
        Options_Colon: DiagnosticMessage;
        Version_0: DiagnosticMessage;
        Insert_command_line_options_and_files_from_a_file: DiagnosticMessage;
        Starting_compilation_in_watch_mode: DiagnosticMessage;
        File_change_detected_Starting_incremental_compilation: DiagnosticMessage;
        KIND: DiagnosticMessage;
        FILE: DiagnosticMessage;
        VERSION: DiagnosticMessage;
        LOCATION: DiagnosticMessage;
        DIRECTORY: DiagnosticMessage;
        STRATEGY: DiagnosticMessage;
        FILE_OR_DIRECTORY: DiagnosticMessage;
        Generates_corresponding_map_file: DiagnosticMessage;
        Compiler_option_0_expects_an_argument: DiagnosticMessage;
        Unterminated_quoted_string_in_response_file_0: DiagnosticMessage;
        Argument_for_0_option_must_be_Colon_1: DiagnosticMessage;
        Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1: DiagnosticMessage;
        Unsupported_locale_0: DiagnosticMessage;
        Unable_to_open_file_0: DiagnosticMessage;
        Corrupted_locale_file_0: DiagnosticMessage;
        Raise_error_on_expressions_and_declarations_with_an_implied_any_type: DiagnosticMessage;
        File_0_not_found: DiagnosticMessage;
        File_0_has_an_unsupported_extension_The_only_supported_extensions_are_1: DiagnosticMessage;
        Suppress_noImplicitAny_errors_for_indexing_objects_lacking_index_signatures: DiagnosticMessage;
        Do_not_emit_declarations_for_code_that_has_an_internal_annotation: DiagnosticMessage;
        Specify_the_root_directory_of_input_files_Use_to_control_the_output_directory_structure_with_outDir: DiagnosticMessage;
        File_0_is_not_under_rootDir_1_rootDir_is_expected_to_contain_all_source_files: DiagnosticMessage;
        Specify_the_end_of_line_sequence_to_be_used_when_emitting_files_Colon_CRLF_dos_or_LF_unix: DiagnosticMessage;
        NEWLINE: DiagnosticMessage;
        Option_0_can_only_be_specified_in_tsconfig_json_file_or_set_to_null_on_command_line: DiagnosticMessage;
        Enables_experimental_support_for_ES7_decorators: DiagnosticMessage;
        Enables_experimental_support_for_emitting_type_metadata_for_decorators: DiagnosticMessage;
        Enables_experimental_support_for_ES7_async_functions: DiagnosticMessage;
        Specify_module_resolution_strategy_Colon_node_Node_js_or_classic_TypeScript_pre_1_6: DiagnosticMessage;
        Initializes_a_TypeScript_project_and_creates_a_tsconfig_json_file: DiagnosticMessage;
        Successfully_created_a_tsconfig_json_file: DiagnosticMessage;
        Suppress_excess_property_checks_for_object_literals: DiagnosticMessage;
        Stylize_errors_and_messages_using_color_and_context_experimental: DiagnosticMessage;
        Do_not_report_errors_on_unused_labels: DiagnosticMessage;
        Report_error_when_not_all_code_paths_in_function_return_a_value: DiagnosticMessage;
        Report_errors_for_fallthrough_cases_in_switch_statement: DiagnosticMessage;
        Do_not_report_errors_on_unreachable_code: DiagnosticMessage;
        Disallow_inconsistently_cased_references_to_the_same_file: DiagnosticMessage;
        Specify_library_files_to_be_included_in_the_compilation: DiagnosticMessage;
        Specify_JSX_code_generation_Colon_preserve_react_native_react_react_jsx_or_react_jsxdev: DiagnosticMessage;
        File_0_has_an_unsupported_extension_so_skipping_it: DiagnosticMessage;
        Only_amd_and_system_modules_are_supported_alongside_0: DiagnosticMessage;
        Base_directory_to_resolve_non_absolute_module_names: DiagnosticMessage;
        Deprecated_Use_jsxFactory_instead_Specify_the_object_invoked_for_createElement_when_targeting_react_JSX_emit: DiagnosticMessage;
        Enable_tracing_of_the_name_resolution_process: DiagnosticMessage;
        Resolving_module_0_from_1: DiagnosticMessage;
        Explicitly_specified_module_resolution_kind_Colon_0: DiagnosticMessage;
        Module_resolution_kind_is_not_specified_using_0: DiagnosticMessage;
        Module_name_0_was_successfully_resolved_to_1: DiagnosticMessage;
        Module_name_0_was_not_resolved: DiagnosticMessage;
        paths_option_is_specified_looking_for_a_pattern_to_match_module_name_0: DiagnosticMessage;
        Module_name_0_matched_pattern_1: DiagnosticMessage;
        Trying_substitution_0_candidate_module_location_Colon_1: DiagnosticMessage;
        Resolving_module_name_0_relative_to_base_url_1_2: DiagnosticMessage;
        Loading_module_as_file_Slash_folder_candidate_module_location_0_target_file_type_1: DiagnosticMessage;
        File_0_does_not_exist: DiagnosticMessage;
        File_0_exist_use_it_as_a_name_resolution_result: DiagnosticMessage;
        Loading_module_0_from_node_modules_folder_target_file_type_1: DiagnosticMessage;
        Found_package_json_at_0: DiagnosticMessage;
        package_json_does_not_have_a_0_field: DiagnosticMessage;
        package_json_has_0_field_1_that_references_2: DiagnosticMessage;
        Allow_javascript_files_to_be_compiled: DiagnosticMessage;
        Option_0_should_have_array_of_strings_as_a_value: DiagnosticMessage;
        Checking_if_0_is_the_longest_matching_prefix_for_1_2: DiagnosticMessage;
        Expected_type_of_0_field_in_package_json_to_be_1_got_2: DiagnosticMessage;
        baseUrl_option_is_set_to_0_using_this_value_to_resolve_non_relative_module_name_1: DiagnosticMessage;
        rootDirs_option_is_set_using_it_to_resolve_relative_module_name_0: DiagnosticMessage;
        Longest_matching_prefix_for_0_is_1: DiagnosticMessage;
        Loading_0_from_the_root_dir_1_candidate_location_2: DiagnosticMessage;
        Trying_other_entries_in_rootDirs: DiagnosticMessage;
        Module_resolution_using_rootDirs_has_failed: DiagnosticMessage;
        Do_not_emit_use_strict_directives_in_module_output: DiagnosticMessage;
        Enable_strict_null_checks: DiagnosticMessage;
        Unknown_option_excludes_Did_you_mean_exclude: DiagnosticMessage;
        Raise_error_on_this_expressions_with_an_implied_any_type: DiagnosticMessage;
        Resolving_type_reference_directive_0_containing_file_1_root_directory_2: DiagnosticMessage;
        Resolving_using_primary_search_paths: DiagnosticMessage;
        Resolving_from_node_modules_folder: DiagnosticMessage;
        Type_reference_directive_0_was_successfully_resolved_to_1_primary_Colon_2: DiagnosticMessage;
        Type_reference_directive_0_was_not_resolved: DiagnosticMessage;
        Resolving_with_primary_search_path_0: DiagnosticMessage;
        Root_directory_cannot_be_determined_skipping_primary_search_paths: DiagnosticMessage;
        Resolving_type_reference_directive_0_containing_file_1_root_directory_not_set: DiagnosticMessage;
        Type_declaration_files_to_be_included_in_compilation: DiagnosticMessage;
        Looking_up_in_node_modules_folder_initial_location_0: DiagnosticMessage;
        Containing_file_is_not_specified_and_root_directory_cannot_be_determined_skipping_lookup_in_node_modules_folder: DiagnosticMessage;
        Resolving_type_reference_directive_0_containing_file_not_set_root_directory_1: DiagnosticMessage;
        Resolving_type_reference_directive_0_containing_file_not_set_root_directory_not_set: DiagnosticMessage;
        Resolving_real_path_for_0_result_1: DiagnosticMessage;
        Cannot_compile_modules_using_option_0_unless_the_module_flag_is_amd_or_system: DiagnosticMessage;
        File_name_0_has_a_1_extension_stripping_it: DiagnosticMessage;
        _0_is_declared_but_its_value_is_never_read: DiagnosticMessage;
        Report_errors_on_unused_locals: DiagnosticMessage;
        Report_errors_on_unused_parameters: DiagnosticMessage;
        The_maximum_dependency_depth_to_search_under_node_modules_and_load_JavaScript_files: DiagnosticMessage;
        Cannot_import_type_declaration_files_Consider_importing_0_instead_of_1: DiagnosticMessage;
        Property_0_is_declared_but_its_value_is_never_read: DiagnosticMessage;
        Import_emit_helpers_from_tslib: DiagnosticMessage;
        Auto_discovery_for_typings_is_enabled_in_project_0_Running_extra_resolution_pass_for_module_1_using_cache_location_2: DiagnosticMessage;
        Parse_in_strict_mode_and_emit_use_strict_for_each_source_file: DiagnosticMessage;
        Module_0_was_resolved_to_1_but_jsx_is_not_set: DiagnosticMessage;
        Module_0_was_resolved_as_locally_declared_ambient_module_in_file_1: DiagnosticMessage;
        Module_0_was_resolved_as_ambient_module_declared_in_1_since_this_file_was_not_modified: DiagnosticMessage;
        Specify_the_JSX_factory_function_to_use_when_targeting_react_JSX_emit_e_g_React_createElement_or_h: DiagnosticMessage;
        Resolution_for_module_0_was_found_in_cache_from_location_1: DiagnosticMessage;
        Directory_0_does_not_exist_skipping_all_lookups_in_it: DiagnosticMessage;
        Show_diagnostic_information: DiagnosticMessage;
        Show_verbose_diagnostic_information: DiagnosticMessage;
        Emit_a_single_file_with_source_maps_instead_of_having_a_separate_file: DiagnosticMessage;
        Emit_the_source_alongside_the_sourcemaps_within_a_single_file_requires_inlineSourceMap_or_sourceMap_to_be_set: DiagnosticMessage;
        Transpile_each_file_as_a_separate_module_similar_to_ts_transpileModule: DiagnosticMessage;
        Print_names_of_generated_files_part_of_the_compilation: DiagnosticMessage;
        Print_names_of_files_part_of_the_compilation: DiagnosticMessage;
        The_locale_used_when_displaying_messages_to_the_user_e_g_en_us: DiagnosticMessage;
        Do_not_generate_custom_helper_functions_like_extends_in_compiled_output: DiagnosticMessage;
        Do_not_include_the_default_library_file_lib_d_ts: DiagnosticMessage;
        Do_not_add_triple_slash_references_or_imported_modules_to_the_list_of_compiled_files: DiagnosticMessage;
        Deprecated_Use_skipLibCheck_instead_Skip_type_checking_of_default_library_declaration_files: DiagnosticMessage;
        List_of_folders_to_include_type_definitions_from: DiagnosticMessage;
        Disable_size_limitations_on_JavaScript_projects: DiagnosticMessage;
        The_character_set_of_the_input_files: DiagnosticMessage;
        Emit_a_UTF_8_Byte_Order_Mark_BOM_in_the_beginning_of_output_files: DiagnosticMessage;
        Do_not_truncate_error_messages: DiagnosticMessage;
        Output_directory_for_generated_declaration_files: DiagnosticMessage;
        A_series_of_entries_which_re_map_imports_to_lookup_locations_relative_to_the_baseUrl: DiagnosticMessage;
        List_of_root_folders_whose_combined_content_represents_the_structure_of_the_project_at_runtime: DiagnosticMessage;
        Show_all_compiler_options: DiagnosticMessage;
        Deprecated_Use_outFile_instead_Concatenate_and_emit_output_to_single_file: DiagnosticMessage;
        Command_line_Options: DiagnosticMessage;
        Basic_Options: DiagnosticMessage;
        Strict_Type_Checking_Options: DiagnosticMessage;
        Module_Resolution_Options: DiagnosticMessage;
        Source_Map_Options: DiagnosticMessage;
        Additional_Checks: DiagnosticMessage;
        Experimental_Options: DiagnosticMessage;
        Advanced_Options: DiagnosticMessage;
        Provide_full_support_for_iterables_in_for_of_spread_and_destructuring_when_targeting_ES5_or_ES3: DiagnosticMessage;
        Enable_all_strict_type_checking_options: DiagnosticMessage;
        List_of_language_service_plugins: DiagnosticMessage;
        Scoped_package_detected_looking_in_0: DiagnosticMessage;
        Reusing_resolution_of_module_0_to_file_1_from_old_program: DiagnosticMessage;
        Reusing_module_resolutions_originating_in_0_since_resolutions_are_unchanged_from_old_program: DiagnosticMessage;
        Disable_strict_checking_of_generic_signatures_in_function_types: DiagnosticMessage;
        Enable_strict_checking_of_function_types: DiagnosticMessage;
        Enable_strict_checking_of_property_initialization_in_classes: DiagnosticMessage;
        Numeric_separators_are_not_allowed_here: DiagnosticMessage;
        Multiple_consecutive_numeric_separators_are_not_permitted: DiagnosticMessage;
        Whether_to_keep_outdated_console_output_in_watch_mode_instead_of_clearing_the_screen: DiagnosticMessage;
        All_imports_in_import_declaration_are_unused: DiagnosticMessage;
        Found_1_error_Watching_for_file_changes: DiagnosticMessage;
        Found_0_errors_Watching_for_file_changes: DiagnosticMessage;
        Resolve_keyof_to_string_valued_property_names_only_no_numbers_or_symbols: DiagnosticMessage;
        _0_is_declared_but_never_used: DiagnosticMessage;
        Include_modules_imported_with_json_extension: DiagnosticMessage;
        All_destructured_elements_are_unused: DiagnosticMessage;
        All_variables_are_unused: DiagnosticMessage;
        Definitions_of_the_following_identifiers_conflict_with_those_in_another_file_Colon_0: DiagnosticMessage;
        Conflicts_are_in_this_file: DiagnosticMessage;
        Project_references_may_not_form_a_circular_graph_Cycle_detected_Colon_0: DiagnosticMessage;
        _0_was_also_declared_here: DiagnosticMessage;
        and_here: DiagnosticMessage;
        All_type_parameters_are_unused: DiagnosticMessage;
        package_json_has_a_typesVersions_field_with_version_specific_path_mappings: DiagnosticMessage;
        package_json_does_not_have_a_typesVersions_entry_that_matches_version_0: DiagnosticMessage;
        package_json_has_a_typesVersions_entry_0_that_matches_compiler_version_1_looking_for_a_pattern_to_match_module_name_2: DiagnosticMessage;
        package_json_has_a_typesVersions_entry_0_that_is_not_a_valid_semver_range: DiagnosticMessage;
        An_argument_for_0_was_not_provided: DiagnosticMessage;
        An_argument_matching_this_binding_pattern_was_not_provided: DiagnosticMessage;
        Did_you_mean_to_call_this_expression: DiagnosticMessage;
        Did_you_mean_to_use_new_with_this_expression: DiagnosticMessage;
        Enable_strict_bind_call_and_apply_methods_on_functions: DiagnosticMessage;
        Using_compiler_options_of_project_reference_redirect_0: DiagnosticMessage;
        Found_1_error: DiagnosticMessage;
        Found_0_errors: DiagnosticMessage;
        Module_name_0_was_successfully_resolved_to_1_with_Package_ID_2: DiagnosticMessage;
        Type_reference_directive_0_was_successfully_resolved_to_1_with_Package_ID_2_primary_Colon_3: DiagnosticMessage;
        package_json_had_a_falsy_0_field: DiagnosticMessage;
        Disable_use_of_source_files_instead_of_declaration_files_from_referenced_projects: DiagnosticMessage;
        Emit_class_fields_with_Define_instead_of_Set: DiagnosticMessage;
        Generates_a_CPU_profile: DiagnosticMessage;
        Disable_solution_searching_for_this_project: DiagnosticMessage;
        Specify_strategy_for_watching_file_Colon_FixedPollingInterval_default_PriorityPollingInterval_DynamicPriorityPolling_UseFsEvents_UseFsEventsOnParentDirectory: DiagnosticMessage;
        Specify_strategy_for_watching_directory_on_platforms_that_don_t_support_recursive_watching_natively_Colon_UseFsEvents_default_FixedPollingInterval_DynamicPriorityPolling: DiagnosticMessage;
        Specify_strategy_for_creating_a_polling_watch_when_it_fails_to_create_using_file_system_events_Colon_FixedInterval_default_PriorityInterval_DynamicPriority: DiagnosticMessage;
        Synchronously_call_callbacks_and_update_the_state_of_directory_watchers_on_platforms_that_don_t_support_recursive_watching_natively: DiagnosticMessage;
        Tag_0_expects_at_least_1_arguments_but_the_JSX_factory_2_provides_at_most_3: DiagnosticMessage;
        Option_0_can_only_be_specified_in_tsconfig_json_file_or_set_to_false_or_null_on_command_line: DiagnosticMessage;
        Could_not_resolve_the_path_0_with_the_extensions_Colon_1: DiagnosticMessage;
        Declaration_augments_declaration_in_another_file_This_cannot_be_serialized: DiagnosticMessage;
        This_is_the_declaration_being_augmented_Consider_moving_the_augmenting_declaration_into_the_same_file: DiagnosticMessage;
        This_expression_is_not_callable_because_it_is_a_get_accessor_Did_you_mean_to_use_it_without: DiagnosticMessage;
        Disable_loading_referenced_projects: DiagnosticMessage;
        Arguments_for_the_rest_parameter_0_were_not_provided: DiagnosticMessage;
        Generates_an_event_trace_and_a_list_of_types: DiagnosticMessage;
        Specify_the_module_specifier_to_be_used_to_import_the_jsx_and_jsxs_factory_functions_from_eg_react: DiagnosticMessage;
        Projects_to_reference: DiagnosticMessage;
        Enable_project_compilation: DiagnosticMessage;
        Composite_projects_may_not_disable_declaration_emit: DiagnosticMessage;
        Output_file_0_has_not_been_built_from_source_file_1: DiagnosticMessage;
        Referenced_project_0_must_have_setting_composite_Colon_true: DiagnosticMessage;
        File_0_is_not_listed_within_the_file_list_of_project_1_Projects_must_list_all_files_or_use_an_include_pattern: DiagnosticMessage;
        Cannot_prepend_project_0_because_it_does_not_have_outFile_set: DiagnosticMessage;
        Output_file_0_from_project_1_does_not_exist: DiagnosticMessage;
        Referenced_project_0_may_not_disable_emit: DiagnosticMessage;
        Project_0_is_out_of_date_because_oldest_output_1_is_older_than_newest_input_2: DiagnosticMessage;
        Project_0_is_up_to_date_because_newest_input_1_is_older_than_oldest_output_2: DiagnosticMessage;
        Project_0_is_out_of_date_because_output_file_1_does_not_exist: DiagnosticMessage;
        Project_0_is_out_of_date_because_its_dependency_1_is_out_of_date: DiagnosticMessage;
        Project_0_is_up_to_date_with_d_ts_files_from_its_dependencies: DiagnosticMessage;
        Projects_in_this_build_Colon_0: DiagnosticMessage;
        A_non_dry_build_would_delete_the_following_files_Colon_0: DiagnosticMessage;
        A_non_dry_build_would_build_project_0: DiagnosticMessage;
        Building_project_0: DiagnosticMessage;
        Updating_output_timestamps_of_project_0: DiagnosticMessage;
        delete_this_Project_0_is_up_to_date_because_it_was_previously_built: DiagnosticMessage;
        Project_0_is_up_to_date: DiagnosticMessage;
        Skipping_build_of_project_0_because_its_dependency_1_has_errors: DiagnosticMessage;
        Project_0_can_t_be_built_because_its_dependency_1_has_errors: DiagnosticMessage;
        Build_one_or_more_projects_and_their_dependencies_if_out_of_date: DiagnosticMessage;
        Delete_the_outputs_of_all_projects: DiagnosticMessage;
        Enable_verbose_logging: DiagnosticMessage;
        Show_what_would_be_built_or_deleted_if_specified_with_clean: DiagnosticMessage;
        Build_all_projects_including_those_that_appear_to_be_up_to_date: DiagnosticMessage;
        Option_build_must_be_the_first_command_line_argument: DiagnosticMessage;
        Options_0_and_1_cannot_be_combined: DiagnosticMessage;
        Updating_unchanged_output_timestamps_of_project_0: DiagnosticMessage;
        Project_0_is_out_of_date_because_output_of_its_dependency_1_has_changed: DiagnosticMessage;
        Updating_output_of_project_0: DiagnosticMessage;
        A_non_dry_build_would_update_timestamps_for_output_of_project_0: DiagnosticMessage;
        A_non_dry_build_would_update_output_of_project_0: DiagnosticMessage;
        Cannot_update_output_of_project_0_because_there_was_error_reading_file_1: DiagnosticMessage;
        Cannot_write_file_0_because_it_will_overwrite_tsbuildinfo_file_generated_by_referenced_project_1: DiagnosticMessage;
        Enable_incremental_compilation: DiagnosticMessage;
        Composite_projects_may_not_disable_incremental_compilation: DiagnosticMessage;
        Specify_file_to_store_incremental_compilation_information: DiagnosticMessage;
        Project_0_is_out_of_date_because_output_for_it_was_generated_with_version_1_that_differs_with_current_version_2: DiagnosticMessage;
        Skipping_build_of_project_0_because_its_dependency_1_was_not_built: DiagnosticMessage;
        Project_0_can_t_be_built_because_its_dependency_1_was_not_built: DiagnosticMessage;
        Have_recompiles_in_incremental_and_watch_assume_that_changes_within_a_file_will_only_affect_files_directly_depending_on_it: DiagnosticMessage;
        _0_is_deprecated: DiagnosticMessage;
        Performance_timings_for_diagnostics_or_extendedDiagnostics_are_not_available_in_this_session_A_native_implementation_of_the_Web_Performance_API_could_not_be_found: DiagnosticMessage;
        The_signature_0_of_1_is_deprecated: DiagnosticMessage;
        The_expected_type_comes_from_property_0_which_is_declared_here_on_type_1: DiagnosticMessage;
        The_expected_type_comes_from_this_index_signature: DiagnosticMessage;
        The_expected_type_comes_from_the_return_type_of_this_signature: DiagnosticMessage;
        Print_names_of_files_that_are_part_of_the_compilation_and_then_stop_processing: DiagnosticMessage;
        File_0_is_a_JavaScript_file_Did_you_mean_to_enable_the_allowJs_option: DiagnosticMessage;
        Print_names_of_files_and_the_reason_they_are_part_of_the_compilation: DiagnosticMessage;
        Require_undeclared_properties_from_index_signatures_to_use_element_accesses: DiagnosticMessage;
        Include_undefined_in_index_signature_results: DiagnosticMessage;
        Variable_0_implicitly_has_an_1_type: DiagnosticMessage;
        Parameter_0_implicitly_has_an_1_type: DiagnosticMessage;
        Member_0_implicitly_has_an_1_type: DiagnosticMessage;
        new_expression_whose_target_lacks_a_construct_signature_implicitly_has_an_any_type: DiagnosticMessage;
        _0_which_lacks_return_type_annotation_implicitly_has_an_1_return_type: DiagnosticMessage;
        Function_expression_which_lacks_return_type_annotation_implicitly_has_an_0_return_type: DiagnosticMessage;
        Construct_signature_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: DiagnosticMessage;
        Function_type_which_lacks_return_type_annotation_implicitly_has_an_0_return_type: DiagnosticMessage;
        Element_implicitly_has_an_any_type_because_index_expression_is_not_of_type_number: DiagnosticMessage;
        Could_not_find_a_declaration_file_for_module_0_1_implicitly_has_an_any_type: DiagnosticMessage;
        Element_implicitly_has_an_any_type_because_type_0_has_no_index_signature: DiagnosticMessage;
        Object_literal_s_property_0_implicitly_has_an_1_type: DiagnosticMessage;
        Rest_parameter_0_implicitly_has_an_any_type: DiagnosticMessage;
        Call_signature_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: DiagnosticMessage;
        _0_implicitly_has_type_any_because_it_does_not_have_a_type_annotation_and_is_referenced_directly_or_indirectly_in_its_own_initializer: DiagnosticMessage;
        _0_implicitly_has_return_type_any_because_it_does_not_have_a_return_type_annotation_and_is_referenced_directly_or_indirectly_in_one_of_its_return_expressions: DiagnosticMessage;
        Function_implicitly_has_return_type_any_because_it_does_not_have_a_return_type_annotation_and_is_referenced_directly_or_indirectly_in_one_of_its_return_expressions: DiagnosticMessage;
        Generator_implicitly_has_yield_type_0_because_it_does_not_yield_any_values_Consider_supplying_a_return_type_annotation: DiagnosticMessage;
        JSX_element_implicitly_has_type_any_because_no_interface_JSX_0_exists: DiagnosticMessage;
        Unreachable_code_detected: DiagnosticMessage;
        Unused_label: DiagnosticMessage;
        Fallthrough_case_in_switch: DiagnosticMessage;
        Not_all_code_paths_return_a_value: DiagnosticMessage;
        Binding_element_0_implicitly_has_an_1_type: DiagnosticMessage;
        Property_0_implicitly_has_type_any_because_its_set_accessor_lacks_a_parameter_type_annotation: DiagnosticMessage;
        Property_0_implicitly_has_type_any_because_its_get_accessor_lacks_a_return_type_annotation: DiagnosticMessage;
        Variable_0_implicitly_has_type_1_in_some_locations_where_its_type_cannot_be_determined: DiagnosticMessage;
        Try_npm_i_save_dev_types_Slash_1_if_it_exists_or_add_a_new_declaration_d_ts_file_containing_declare_module_0: DiagnosticMessage;
        Dynamic_import_s_specifier_must_be_of_type_string_but_here_has_type_0: DiagnosticMessage;
        Enables_emit_interoperability_between_CommonJS_and_ES_Modules_via_creation_of_namespace_objects_for_all_imports_Implies_allowSyntheticDefaultImports: DiagnosticMessage;
        Type_originates_at_this_import_A_namespace_style_import_cannot_be_called_or_constructed_and_will_cause_a_failure_at_runtime_Consider_using_a_default_import_or_import_require_here_instead: DiagnosticMessage;
        Mapped_object_type_implicitly_has_an_any_template_type: DiagnosticMessage;
        If_the_0_package_actually_exposes_this_module_consider_sending_a_pull_request_to_amend_https_Colon_Slash_Slashgithub_com_SlashDefinitelyTyped_SlashDefinitelyTyped_Slashtree_Slashmaster_Slashtypes_Slash_1: DiagnosticMessage;
        The_containing_arrow_function_captures_the_global_value_of_this: DiagnosticMessage;
        Module_0_was_resolved_to_1_but_resolveJsonModule_is_not_used: DiagnosticMessage;
        Variable_0_implicitly_has_an_1_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
        Parameter_0_implicitly_has_an_1_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
        Member_0_implicitly_has_an_1_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
        Variable_0_implicitly_has_type_1_in_some_locations_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
        Rest_parameter_0_implicitly_has_an_any_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
        Property_0_implicitly_has_type_any_but_a_better_type_for_its_get_accessor_may_be_inferred_from_usage: DiagnosticMessage;
        Property_0_implicitly_has_type_any_but_a_better_type_for_its_set_accessor_may_be_inferred_from_usage: DiagnosticMessage;
        _0_implicitly_has_an_1_return_type_but_a_better_type_may_be_inferred_from_usage: DiagnosticMessage;
        Parameter_has_a_name_but_no_type_Did_you_mean_0_Colon_1: DiagnosticMessage;
        Element_implicitly_has_an_any_type_because_type_0_has_no_index_signature_Did_you_mean_to_call_1: DiagnosticMessage;
        Element_implicitly_has_an_any_type_because_expression_of_type_0_can_t_be_used_to_index_type_1: DiagnosticMessage;
        No_index_signature_with_a_parameter_of_type_0_was_found_on_type_1: DiagnosticMessage;
        _0_which_lacks_return_type_annotation_implicitly_has_an_1_yield_type: DiagnosticMessage;
        The_inferred_type_of_this_node_exceeds_the_maximum_length_the_compiler_will_serialize_An_explicit_type_annotation_is_needed: DiagnosticMessage;
        yield_expression_implicitly_results_in_an_any_type_because_its_containing_generator_lacks_a_return_type_annotation: DiagnosticMessage;
        You_cannot_rename_this_element: DiagnosticMessage;
        You_cannot_rename_elements_that_are_defined_in_the_standard_TypeScript_library: DiagnosticMessage;
        import_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        export_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Type_parameter_declarations_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        implements_clauses_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        _0_declarations_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Type_aliases_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        The_0_modifier_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Type_annotations_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Type_arguments_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Parameter_modifiers_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Non_null_assertions_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Type_assertion_expressions_can_only_be_used_in_TypeScript_files: DiagnosticMessage;
        Octal_literal_types_must_use_ES2015_syntax_Use_the_syntax_0: DiagnosticMessage;
        Octal_literals_are_not_allowed_in_enums_members_initializer_Use_the_syntax_0: DiagnosticMessage;
        Report_errors_in_js_files: DiagnosticMessage;
        JSDoc_types_can_only_be_used_inside_documentation_comments: DiagnosticMessage;
        JSDoc_typedef_tag_should_either_have_a_type_annotation_or_be_followed_by_property_or_member_tags: DiagnosticMessage;
        JSDoc_0_is_not_attached_to_a_class: DiagnosticMessage;
        JSDoc_0_1_does_not_match_the_extends_2_clause: DiagnosticMessage;
        JSDoc_param_tag_has_name_0_but_there_is_no_parameter_with_that_name: DiagnosticMessage;
        Class_declarations_cannot_have_more_than_one_augments_or_extends_tag: DiagnosticMessage;
        Expected_0_type_arguments_provide_these_with_an_extends_tag: DiagnosticMessage;
        Expected_0_1_type_arguments_provide_these_with_an_extends_tag: DiagnosticMessage;
        JSDoc_may_only_appear_in_the_last_parameter_of_a_signature: DiagnosticMessage;
        JSDoc_param_tag_has_name_0_but_there_is_no_parameter_with_that_name_It_would_match_arguments_if_it_had_an_array_type: DiagnosticMessage;
        The_type_of_a_function_declaration_must_match_the_function_s_signature: DiagnosticMessage;
        You_cannot_rename_a_module_via_a_global_import: DiagnosticMessage;
        Qualified_name_0_is_not_allowed_without_a_leading_param_object_1: DiagnosticMessage;
        A_JSDoc_typedef_comment_may_not_contain_multiple_type_tags: DiagnosticMessage;
        The_tag_was_first_specified_here: DiagnosticMessage;
        Only_identifiers_Slashqualified_names_with_optional_type_arguments_are_currently_supported_in_a_class_extends_clause: DiagnosticMessage;
        class_expressions_are_not_currently_supported: DiagnosticMessage;
        Language_service_is_disabled: DiagnosticMessage;
        Declaration_emit_for_this_file_requires_using_private_name_0_An_explicit_type_annotation_may_unblock_declaration_emit: DiagnosticMessage;
        Declaration_emit_for_this_file_requires_using_private_name_0_from_module_1_An_explicit_type_annotation_may_unblock_declaration_emit: DiagnosticMessage;
        JSX_attributes_must_only_be_assigned_a_non_empty_expression: DiagnosticMessage;
        JSX_elements_cannot_have_multiple_attributes_with_the_same_name: DiagnosticMessage;
        Expected_corresponding_JSX_closing_tag_for_0: DiagnosticMessage;
        JSX_attribute_expected: DiagnosticMessage;
        Cannot_use_JSX_unless_the_jsx_flag_is_provided: DiagnosticMessage;
        A_constructor_cannot_contain_a_super_call_when_its_class_extends_null: DiagnosticMessage;
        An_unary_expression_with_the_0_operator_is_not_allowed_in_the_left_hand_side_of_an_exponentiation_expression_Consider_enclosing_the_expression_in_parentheses: DiagnosticMessage;
        A_type_assertion_expression_is_not_allowed_in_the_left_hand_side_of_an_exponentiation_expression_Consider_enclosing_the_expression_in_parentheses: DiagnosticMessage;
        JSX_element_0_has_no_corresponding_closing_tag: DiagnosticMessage;
        super_must_be_called_before_accessing_this_in_the_constructor_of_a_derived_class: DiagnosticMessage;
        Unknown_type_acquisition_option_0: DiagnosticMessage;
        super_must_be_called_before_accessing_a_property_of_super_in_the_constructor_of_a_derived_class: DiagnosticMessage;
        _0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2: DiagnosticMessage;
        Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constructor: DiagnosticMessage;
        JSX_fragment_has_no_corresponding_closing_tag: DiagnosticMessage;
        Expected_corresponding_closing_tag_for_JSX_fragment: DiagnosticMessage;
        The_jsxFragmentFactory_compiler_option_must_be_provided_to_use_JSX_fragments_with_the_jsxFactory_compiler_option: DiagnosticMessage;
        An_jsxFrag_pragma_is_required_when_using_an_jsx_pragma_with_JSX_fragments: DiagnosticMessage;
        Unknown_type_acquisition_option_0_Did_you_mean_1: DiagnosticMessage;
        Circularity_detected_while_resolving_configuration_Colon_0: DiagnosticMessage;
        A_path_in_an_extends_option_must_be_relative_or_rooted_but_0_is_not: DiagnosticMessage;
        The_files_list_in_config_file_0_is_empty: DiagnosticMessage;
        No_inputs_were_found_in_config_file_0_Specified_include_paths_were_1_and_exclude_paths_were_2: DiagnosticMessage;
        File_is_a_CommonJS_module_it_may_be_converted_to_an_ES6_module: DiagnosticMessage;
        This_constructor_function_may_be_converted_to_a_class_declaration: DiagnosticMessage;
        Import_may_be_converted_to_a_default_import: DiagnosticMessage;
        JSDoc_types_may_be_moved_to_TypeScript_types: DiagnosticMessage;
        require_call_may_be_converted_to_an_import: DiagnosticMessage;
        This_may_be_converted_to_an_async_function: DiagnosticMessage;
        await_has_no_effect_on_the_type_of_this_expression: DiagnosticMessage;
        Numeric_literals_with_absolute_values_equal_to_2_53_or_greater_are_too_large_to_be_represented_accurately_as_integers: DiagnosticMessage;
        Add_missing_super_call: DiagnosticMessage;
        Make_super_call_the_first_statement_in_the_constructor: DiagnosticMessage;
        Change_extends_to_implements: DiagnosticMessage;
        Remove_unused_declaration_for_Colon_0: DiagnosticMessage;
        Remove_import_from_0: DiagnosticMessage;
        Implement_interface_0: DiagnosticMessage;
        Implement_inherited_abstract_class: DiagnosticMessage;
        Add_0_to_unresolved_variable: DiagnosticMessage;
        Remove_variable_statement: DiagnosticMessage;
        Remove_template_tag: DiagnosticMessage;
        Remove_type_parameters: DiagnosticMessage;
        Import_0_from_module_1: DiagnosticMessage;
        Change_0_to_1: DiagnosticMessage;
        Add_0_to_existing_import_declaration_from_1: DiagnosticMessage;
        Declare_property_0: DiagnosticMessage;
        Add_index_signature_for_property_0: DiagnosticMessage;
        Disable_checking_for_this_file: DiagnosticMessage;
        Ignore_this_error_message: DiagnosticMessage;
        Initialize_property_0_in_the_constructor: DiagnosticMessage;
        Initialize_static_property_0: DiagnosticMessage;
        Change_spelling_to_0: DiagnosticMessage;
        Declare_method_0: DiagnosticMessage;
        Declare_static_method_0: DiagnosticMessage;
        Prefix_0_with_an_underscore: DiagnosticMessage;
        Rewrite_as_the_indexed_access_type_0: DiagnosticMessage;
        Declare_static_property_0: DiagnosticMessage;
        Call_decorator_expression: DiagnosticMessage;
        Add_async_modifier_to_containing_function: DiagnosticMessage;
        Replace_infer_0_with_unknown: DiagnosticMessage;
        Replace_all_unused_infer_with_unknown: DiagnosticMessage;
        Import_default_0_from_module_1: DiagnosticMessage;
        Add_default_import_0_to_existing_import_declaration_from_1: DiagnosticMessage;
        Add_parameter_name: DiagnosticMessage;
        Declare_private_property_0: DiagnosticMessage;
        Replace_0_with_Promise_1: DiagnosticMessage;
        Fix_all_incorrect_return_type_of_an_async_functions: DiagnosticMessage;
        Declare_private_method_0: DiagnosticMessage;
        Remove_unused_destructuring_declaration: DiagnosticMessage;
        Remove_unused_declarations_for_Colon_0: DiagnosticMessage;
        Declare_a_private_field_named_0: DiagnosticMessage;
        Convert_function_to_an_ES2015_class: DiagnosticMessage;
        Convert_function_0_to_class: DiagnosticMessage;
        Convert_0_to_1_in_0: DiagnosticMessage;
        Extract_to_0_in_1: DiagnosticMessage;
        Extract_function: DiagnosticMessage;
        Extract_constant: DiagnosticMessage;
        Extract_to_0_in_enclosing_scope: DiagnosticMessage;
        Extract_to_0_in_1_scope: DiagnosticMessage;
        Annotate_with_type_from_JSDoc: DiagnosticMessage;
        Annotate_with_types_from_JSDoc: DiagnosticMessage;
        Infer_type_of_0_from_usage: DiagnosticMessage;
        Infer_parameter_types_from_usage: DiagnosticMessage;
        Convert_to_default_import: DiagnosticMessage;
        Install_0: DiagnosticMessage;
        Replace_import_with_0: DiagnosticMessage;
        Use_synthetic_default_member: DiagnosticMessage;
        Convert_to_ES6_module: DiagnosticMessage;
        Add_undefined_type_to_property_0: DiagnosticMessage;
        Add_initializer_to_property_0: DiagnosticMessage;
        Add_definite_assignment_assertion_to_property_0: DiagnosticMessage;
        Convert_all_type_literals_to_mapped_type: DiagnosticMessage;
        Add_all_missing_members: DiagnosticMessage;
        Infer_all_types_from_usage: DiagnosticMessage;
        Delete_all_unused_declarations: DiagnosticMessage;
        Prefix_all_unused_declarations_with_where_possible: DiagnosticMessage;
        Fix_all_detected_spelling_errors: DiagnosticMessage;
        Add_initializers_to_all_uninitialized_properties: DiagnosticMessage;
        Add_definite_assignment_assertions_to_all_uninitialized_properties: DiagnosticMessage;
        Add_undefined_type_to_all_uninitialized_properties: DiagnosticMessage;
        Change_all_jsdoc_style_types_to_TypeScript: DiagnosticMessage;
        Change_all_jsdoc_style_types_to_TypeScript_and_add_undefined_to_nullable_types: DiagnosticMessage;
        Implement_all_unimplemented_interfaces: DiagnosticMessage;
        Install_all_missing_types_packages: DiagnosticMessage;
        Rewrite_all_as_indexed_access_types: DiagnosticMessage;
        Convert_all_to_default_imports: DiagnosticMessage;
        Make_all_super_calls_the_first_statement_in_their_constructor: DiagnosticMessage;
        Add_qualifier_to_all_unresolved_variables_matching_a_member_name: DiagnosticMessage;
        Change_all_extended_interfaces_to_implements: DiagnosticMessage;
        Add_all_missing_super_calls: DiagnosticMessage;
        Implement_all_inherited_abstract_classes: DiagnosticMessage;
        Add_all_missing_async_modifiers: DiagnosticMessage;
        Add_ts_ignore_to_all_error_messages: DiagnosticMessage;
        Annotate_everything_with_types_from_JSDoc: DiagnosticMessage;
        Add_to_all_uncalled_decorators: DiagnosticMessage;
        Convert_all_constructor_functions_to_classes: DiagnosticMessage;
        Generate_get_and_set_accessors: DiagnosticMessage;
        Convert_require_to_import: DiagnosticMessage;
        Convert_all_require_to_import: DiagnosticMessage;
        Move_to_a_new_file: DiagnosticMessage;
        Remove_unreachable_code: DiagnosticMessage;
        Remove_all_unreachable_code: DiagnosticMessage;
        Add_missing_typeof: DiagnosticMessage;
        Remove_unused_label: DiagnosticMessage;
        Remove_all_unused_labels: DiagnosticMessage;
        Convert_0_to_mapped_object_type: DiagnosticMessage;
        Convert_namespace_import_to_named_imports: DiagnosticMessage;
        Convert_named_imports_to_namespace_import: DiagnosticMessage;
        Add_or_remove_braces_in_an_arrow_function: DiagnosticMessage;
        Add_braces_to_arrow_function: DiagnosticMessage;
        Remove_braces_from_arrow_function: DiagnosticMessage;
        Convert_default_export_to_named_export: DiagnosticMessage;
        Convert_named_export_to_default_export: DiagnosticMessage;
        Add_missing_enum_member_0: DiagnosticMessage;
        Add_all_missing_imports: DiagnosticMessage;
        Convert_to_async_function: DiagnosticMessage;
        Convert_all_to_async_functions: DiagnosticMessage;
        Add_missing_call_parentheses: DiagnosticMessage;
        Add_all_missing_call_parentheses: DiagnosticMessage;
        Add_unknown_conversion_for_non_overlapping_types: DiagnosticMessage;
        Add_unknown_to_all_conversions_of_non_overlapping_types: DiagnosticMessage;
        Add_missing_new_operator_to_call: DiagnosticMessage;
        Add_missing_new_operator_to_all_calls: DiagnosticMessage;
        Add_names_to_all_parameters_without_names: DiagnosticMessage;
        Enable_the_experimentalDecorators_option_in_your_configuration_file: DiagnosticMessage;
        Convert_parameters_to_destructured_object: DiagnosticMessage;
        Allow_accessing_UMD_globals_from_modules: DiagnosticMessage;
        Extract_type: DiagnosticMessage;
        Extract_to_type_alias: DiagnosticMessage;
        Extract_to_typedef: DiagnosticMessage;
        Infer_this_type_of_0_from_usage: DiagnosticMessage;
        Add_const_to_unresolved_variable: DiagnosticMessage;
        Add_const_to_all_unresolved_variables: DiagnosticMessage;
        Add_await: DiagnosticMessage;
        Add_await_to_initializer_for_0: DiagnosticMessage;
        Fix_all_expressions_possibly_missing_await: DiagnosticMessage;
        Remove_unnecessary_await: DiagnosticMessage;
        Remove_all_unnecessary_uses_of_await: DiagnosticMessage;
        Enable_the_jsx_flag_in_your_configuration_file: DiagnosticMessage;
        Add_await_to_initializers: DiagnosticMessage;
        Extract_to_interface: DiagnosticMessage;
        Convert_to_a_bigint_numeric_literal: DiagnosticMessage;
        Convert_all_to_bigint_numeric_literals: DiagnosticMessage;
        Convert_const_to_let: DiagnosticMessage;
        Prefix_with_declare: DiagnosticMessage;
        Prefix_all_incorrect_property_declarations_with_declare: DiagnosticMessage;
        Convert_to_template_string: DiagnosticMessage;
        Add_export_to_make_this_file_into_a_module: DiagnosticMessage;
        Set_the_target_option_in_your_configuration_file_to_0: DiagnosticMessage;
        Set_the_module_option_in_your_configuration_file_to_0: DiagnosticMessage;
        Convert_invalid_character_to_its_html_entity_code: DiagnosticMessage;
        Convert_all_invalid_characters_to_HTML_entity_code: DiagnosticMessage;
        Add_class_tag: DiagnosticMessage;
        Add_this_tag: DiagnosticMessage;
        Add_this_parameter: DiagnosticMessage;
        Convert_function_expression_0_to_arrow_function: DiagnosticMessage;
        Convert_function_declaration_0_to_arrow_function: DiagnosticMessage;
        Fix_all_implicit_this_errors: DiagnosticMessage;
        Wrap_invalid_character_in_an_expression_container: DiagnosticMessage;
        Wrap_all_invalid_characters_in_an_expression_container: DiagnosticMessage;
        Visit_https_Colon_Slash_Slashaka_ms_Slashtsconfig_json_to_read_more_about_this_file: DiagnosticMessage;
        Add_a_return_statement: DiagnosticMessage;
        Remove_braces_from_arrow_function_body: DiagnosticMessage;
        Wrap_the_following_body_with_parentheses_which_should_be_an_object_literal: DiagnosticMessage;
        Add_all_missing_return_statement: DiagnosticMessage;
        Remove_braces_from_all_arrow_function_bodies_with_relevant_issues: DiagnosticMessage;
        Wrap_all_object_literal_with_parentheses: DiagnosticMessage;
        Move_labeled_tuple_element_modifiers_to_labels: DiagnosticMessage;
        Convert_overload_list_to_single_signature: DiagnosticMessage;
        Generate_get_and_set_accessors_for_all_overriding_properties: DiagnosticMessage;
        Wrap_in_JSX_fragment: DiagnosticMessage;
        Wrap_all_unparented_JSX_in_JSX_fragment: DiagnosticMessage;
        Convert_arrow_function_or_function_expression: DiagnosticMessage;
        Convert_to_anonymous_function: DiagnosticMessage;
        Convert_to_named_function: DiagnosticMessage;
        Convert_to_arrow_function: DiagnosticMessage;
        Remove_parentheses: DiagnosticMessage;
        Could_not_find_a_containing_arrow_function: DiagnosticMessage;
        Containing_function_is_not_an_arrow_function: DiagnosticMessage;
        Could_not_find_export_statement: DiagnosticMessage;
        This_file_already_has_a_default_export: DiagnosticMessage;
        Could_not_find_import_clause: DiagnosticMessage;
        Could_not_find_namespace_import_or_named_imports: DiagnosticMessage;
        Selection_is_not_a_valid_type_node: DiagnosticMessage;
        No_type_could_be_extracted_from_this_type_node: DiagnosticMessage;
        Could_not_find_property_for_which_to_generate_accessor: DiagnosticMessage;
        Name_is_not_valid: DiagnosticMessage;
        Can_only_convert_property_with_modifier: DiagnosticMessage;
        Switch_each_misused_0_to_1: DiagnosticMessage;
        Convert_to_optional_chain_expression: DiagnosticMessage;
        Could_not_find_convertible_access_expression: DiagnosticMessage;
        Could_not_find_matching_access_expressions: DiagnosticMessage;
        Can_only_convert_logical_AND_access_chains: DiagnosticMessage;
        Add_void_to_Promise_resolved_without_a_value: DiagnosticMessage;
        Add_void_to_all_Promises_resolved_without_a_value: DiagnosticMessage;
        Use_element_access_for_0: DiagnosticMessage;
        Use_element_access_for_all_undeclared_properties: DiagnosticMessage;
        Delete_all_unused_imports: DiagnosticMessage;
        Infer_function_return_type: DiagnosticMessage;
        Return_type_must_be_inferred_from_a_function: DiagnosticMessage;
        Could_not_determine_function_return_type: DiagnosticMessage;
        Could_not_convert_to_arrow_function: DiagnosticMessage;
        Could_not_convert_to_named_function: DiagnosticMessage;
        Could_not_convert_to_anonymous_function: DiagnosticMessage;
        Can_only_convert_string_concatenation: DiagnosticMessage;
        Selection_is_not_a_valid_statement_or_statements: DiagnosticMessage;
        Add_missing_function_declaration_0: DiagnosticMessage;
        Add_all_missing_function_declarations: DiagnosticMessage;
        Method_not_implemented: DiagnosticMessage;
        Function_not_implemented: DiagnosticMessage;
        No_value_exists_in_scope_for_the_shorthand_property_0_Either_declare_one_or_provide_an_initializer: DiagnosticMessage;
        Classes_may_not_have_a_field_named_constructor: DiagnosticMessage;
        JSX_expressions_may_not_use_the_comma_operator_Did_you_mean_to_write_an_array: DiagnosticMessage;
        Private_identifiers_cannot_be_used_as_parameters: DiagnosticMessage;
        An_accessibility_modifier_cannot_be_used_with_a_private_identifier: DiagnosticMessage;
        The_operand_of_a_delete_operator_cannot_be_a_private_identifier: DiagnosticMessage;
        constructor_is_a_reserved_word: DiagnosticMessage;
        Property_0_is_not_accessible_outside_class_1_because_it_has_a_private_identifier: DiagnosticMessage;
        The_property_0_cannot_be_accessed_on_type_1_within_this_class_because_it_is_shadowed_by_another_private_identifier_with_the_same_spelling: DiagnosticMessage;
        Property_0_in_type_1_refers_to_a_different_member_that_cannot_be_accessed_from_within_type_2: DiagnosticMessage;
        Private_identifiers_are_not_allowed_outside_class_bodies: DiagnosticMessage;
        The_shadowing_declaration_of_0_is_defined_here: DiagnosticMessage;
        The_declaration_of_0_that_you_probably_intended_to_use_is_defined_here: DiagnosticMessage;
        _0_modifier_cannot_be_used_with_a_private_identifier: DiagnosticMessage;
        A_method_cannot_be_named_with_a_private_identifier: DiagnosticMessage;
        An_accessor_cannot_be_named_with_a_private_identifier: DiagnosticMessage;
        An_enum_member_cannot_be_named_with_a_private_identifier: DiagnosticMessage;
        can_only_be_used_at_the_start_of_a_file: DiagnosticMessage;
        Compiler_reserves_name_0_when_emitting_private_identifier_downlevel: DiagnosticMessage;
        Private_identifiers_are_only_available_when_targeting_ECMAScript_2015_and_higher: DiagnosticMessage;
        Private_identifiers_are_not_allowed_in_variable_declarations: DiagnosticMessage;
        An_optional_chain_cannot_contain_private_identifiers: DiagnosticMessage;
        The_intersection_0_was_reduced_to_never_because_property_1_has_conflicting_types_in_some_constituents: DiagnosticMessage;
        The_intersection_0_was_reduced_to_never_because_property_1_exists_in_multiple_constituents_and_is_private_in_some: DiagnosticMessage;
        Only_numeric_enums_can_have_computed_members_but_this_expression_has_type_0_If_you_do_not_need_exhaustiveness_checks_consider_using_an_object_literal_instead: DiagnosticMessage;
        Specify_the_JSX_fragment_factory_function_to_use_when_targeting_react_JSX_emit_with_jsxFactory_compiler_option_is_specified_e_g_Fragment: DiagnosticMessage;
        Invalid_value_for_jsxFragmentFactory_0_is_not_a_valid_identifier_or_qualified_name: DiagnosticMessage;
    };
}
declare namespace ts {
    type ErrorCallback = (message: DiagnosticMessage, length: number) => void;
    function tokenIsIdentifierOrKeyword(token: SyntaxKind): boolean;
    function tokenIsIdentifierOrKeywordOrGreaterThan(token: SyntaxKind): boolean;
    interface Scanner {
        getStartPos(): number;
        getToken(): SyntaxKind;
        getTextPos(): number;
        getTokenPos(): number;
        getTokenText(): string;
        getTokenValue(): string;
        hasUnicodeEscape(): boolean;
        hasExtendedUnicodeEscape(): boolean;
        hasPrecedingLineBreak(): boolean;
        hasPrecedingJSDocComment(): boolean;
        isIdentifier(): boolean;
        isReservedWord(): boolean;
        isUnterminated(): boolean;
        getNumericLiteralFlags(): TokenFlags;
        getCommentDirectives(): CommentDirective[] | undefined;
        getTokenFlags(): TokenFlags;
        reScanGreaterToken(): SyntaxKind;
        reScanSlashToken(): SyntaxKind;
        reScanAsteriskEqualsToken(): SyntaxKind;
        reScanTemplateToken(isTaggedTemplate: boolean): SyntaxKind;
        reScanTemplateHeadOrNoSubstitutionTemplate(): SyntaxKind;
        scanJsxIdentifier(): SyntaxKind;
        scanJsxAttributeValue(): SyntaxKind;
        reScanJsxAttributeValue(): SyntaxKind;
        reScanJsxToken(): JsxTokenSyntaxKind;
        reScanLessThanToken(): SyntaxKind;
        reScanQuestionToken(): SyntaxKind;
        reScanInvalidIdentifier(): SyntaxKind;
        scanJsxToken(): JsxTokenSyntaxKind;
        scanJsDocToken(): JSDocSyntaxKind;
        scan(): SyntaxKind;
        getText(): string;
        clearCommentDirectives(): void;
        setText(text: string | undefined, start?: number, length?: number): void;
        setOnError(onError: ErrorCallback | undefined): void;
        setScriptTarget(scriptTarget: ScriptTarget): void;
        setLanguageVariant(variant: LanguageVariant): void;
        setTextPos(textPos: number): void;
        setInJSDocType(inType: boolean): void;
        lookAhead<T>(callback: () => T): T;
        scanRange<T>(start: number, length: number, callback: () => T): T;
        tryScan<T>(callback: () => T): T;
    }
    function isUnicodeIdentifierStart(code: number, languageVersion: ScriptTarget | undefined): boolean;
    function tokenToString(t: SyntaxKind): string | undefined;
    function stringToToken(s: string): SyntaxKind | undefined;
    function computeLineStarts(text: string): number[];
    function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number): number;
    function getPositionOfLineAndCharacter(sourceFile: SourceFileLike, line: number, character: number, allowEdits?: true): number;
    function computePositionOfLineAndCharacter(lineStarts: readonly number[], line: number, character: number, debugText?: string, allowEdits?: true): number;
    function getLineStarts(sourceFile: SourceFileLike): readonly number[];
    function computeLineAndCharacterOfPosition(lineStarts: readonly number[], position: number): LineAndCharacter;
    /**
     * @internal
     * We assume the first line starts at position 0 and 'position' is non-negative.
     */
    function computeLineOfPosition(lineStarts: readonly number[], position: number, lowerBound?: number): number;
    /** @internal */
    function getLinesBetweenPositions(sourceFile: SourceFileLike, pos1: number, pos2: number): number;
    function getLineAndCharacterOfPosition(sourceFile: SourceFileLike, position: number): LineAndCharacter;
    function isWhiteSpaceLike(ch: number): boolean;
    /** Does not include line breaks. For that, see isWhiteSpaceLike. */
    function isWhiteSpaceSingleLine(ch: number): boolean;
    function isLineBreak(ch: number): boolean;
    function isOctalDigit(ch: number): boolean;
    function couldStartTrivia(text: string, pos: number): boolean;
    function skipTrivia(text: string, pos: number, stopAfterLineBreak?: boolean, stopAtComments?: boolean): number;
    function isShebangTrivia(text: string, pos: number): boolean;
    function scanShebangTrivia(text: string, pos: number): number;
    function forEachLeadingCommentRange<U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean) => U): U | undefined;
    function forEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T): U | undefined;
    function forEachTrailingCommentRange<U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean) => U): U | undefined;
    function forEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T) => U, state: T): U | undefined;
    function reduceEachLeadingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T, memo: U) => U, state: T, initial: U): U | undefined;
    function reduceEachTrailingCommentRange<T, U>(text: string, pos: number, cb: (pos: number, end: number, kind: CommentKind, hasTrailingNewLine: boolean, state: T, memo: U) => U, state: T, initial: U): U | undefined;
    function getLeadingCommentRanges(text: string, pos: number): CommentRange[] | undefined;
    function getTrailingCommentRanges(text: string, pos: number): CommentRange[] | undefined;
    /** Optionally, get the shebang */
    function getShebang(text: string): string | undefined;
    function isIdentifierStart(ch: number, languageVersion: ScriptTarget | undefined): boolean;
    function isIdentifierPart(ch: number, languageVersion: ScriptTarget | undefined, identifierVariant?: LanguageVariant): boolean;
    function isIdentifierText(name: string, languageVersion: ScriptTarget | undefined, identifierVariant?: LanguageVariant): boolean;
    function createScanner(languageVersion: ScriptTarget, skipTrivia: boolean, languageVariant?: LanguageVariant, textInitial?: string, onError?: ErrorCallback, start?: number, length?: number): Scanner;
    function utf16EncodeAsString(codePoint: number): string;
}
declare namespace ts {
    function isExternalModuleNameRelative(moduleName: string): boolean;
    function sortAndDeduplicateDiagnostics<T extends Diagnostic>(diagnostics: readonly T[]): SortedReadonlyArray<T>;
    function getDefaultLibFileName(options: CompilerOptions): string;
    function textSpanEnd(span: TextSpan): number;
    function textSpanIsEmpty(span: TextSpan): boolean;
    function textSpanContainsPosition(span: TextSpan, position: number): boolean;
    function textRangeContainsPositionInclusive(span: TextRange, position: number): boolean;
    function textSpanContainsTextSpan(span: TextSpan, other: TextSpan): boolean;
    function textSpanOverlapsWith(span: TextSpan, other: TextSpan): boolean;
    function textSpanOverlap(span1: TextSpan, span2: TextSpan): TextSpan | undefined;
    function textSpanIntersectsWithTextSpan(span: TextSpan, other: TextSpan): boolean;
    function textSpanIntersectsWith(span: TextSpan, start: number, length: number): boolean;
    function decodedTextSpanIntersectsWith(start1: number, length1: number, start2: number, length2: number): boolean;
    function textSpanIntersectsWithPosition(span: TextSpan, position: number): boolean;
    function textSpanIntersection(span1: TextSpan, span2: TextSpan): TextSpan | undefined;
    function createTextSpan(start: number, length: number): TextSpan;
    function createTextSpanFromBounds(start: number, end: number): TextSpan;
    function textChangeRangeNewSpan(range: TextChangeRange): TextSpan;
    function textChangeRangeIsUnchanged(range: TextChangeRange): boolean;
    function createTextChangeRange(span: TextSpan, newLength: number): TextChangeRange;
    let unchangedTextChangeRange: TextChangeRange;
    /**
     * Called to merge all the changes that occurred across several versions of a script snapshot
     * into a single change.  i.e. if a user keeps making successive edits to a script we will
     * have a text change from V1 to V2, V2 to V3, ..., Vn.
     *
     * This function will then merge those changes into a single change range valid between V1 and
     * Vn.
     */
    function collapseTextChangeRangesAcrossMultipleVersions(changes: readonly TextChangeRange[]): TextChangeRange;
    function getTypeParameterOwner(d: Declaration): Declaration | undefined;
    type ParameterPropertyDeclaration = ParameterDeclaration & {
        parent: ConstructorDeclaration;
        name: Identifier;
    };
    function isParameterPropertyDeclaration(node: Node, parent: Node): node is ParameterPropertyDeclaration;
    function isEmptyBindingPattern(node: BindingName): node is BindingPattern;
    function isEmptyBindingElement(node: BindingElement): boolean;
    function walkUpBindingElementsAndPatterns(binding: BindingElement): VariableDeclaration | ParameterDeclaration;
    function getCombinedModifierFlags(node: Declaration): ModifierFlags;
    function getCombinedNodeFlagsAlwaysIncludeJSDoc(node: Declaration): ModifierFlags;
    function getCombinedNodeFlags(node: Node): NodeFlags;
    const supportedLocaleDirectories: string[];
    /**
     * Checks to see if the locale is in the appropriate format,
     * and if it is, attempts to set the appropriate language.
     */
    function validateLocaleAndSetLanguage(locale: string, sys: {
        getExecutingFilePath(): string;
        resolvePath(path: string): string;
        fileExists(fileName: string): boolean;
        readFile(fileName: string): string | undefined;
    }, errors?: Push<Diagnostic>): void;
    function getOriginalNode(node: Node): Node;
    function getOriginalNode<T extends Node>(node: Node, nodeTest: (node: Node) => node is T): T;
    function getOriginalNode(node: Node | undefined): Node | undefined;
    function getOriginalNode<T extends Node>(node: Node | undefined, nodeTest: (node: Node | undefined) => node is T): T | undefined;
    /**
     * Iterates through the parent chain of a node and performs the callback on each parent until the callback
     * returns a truthy value, then returns that value.
     * If no such value is found, it applies the callback until the parent pointer is undefined or the callback returns "quit"
     * At that point findAncestor returns undefined.
     */
    function findAncestor<T extends Node>(node: Node | undefined, callback: (element: Node) => element is T): T | undefined;
    function findAncestor(node: Node | undefined, callback: (element: Node) => boolean | "quit"): Node | undefined;
    /**
     * Gets a value indicating whether a node originated in the parse tree.
     *
     * @param node The node to test.
     */
    function isParseTreeNode(node: Node): boolean;
    /**
     * Gets the original parse tree node for a node.
     *
     * @param node The original node.
     * @returns The original parse tree node if found; otherwise, undefined.
     */
    function getParseTreeNode(node: Node | undefined): Node | undefined;
    /**
     * Gets the original parse tree node for a node.
     *
     * @param node The original node.
     * @param nodeTest A callback used to ensure the correct type of parse tree node is returned.
     * @returns The original parse tree node if found; otherwise, undefined.
     */
    function getParseTreeNode<T extends Node>(node: T | undefined, nodeTest?: (node: Node) => node is T): T | undefined;
    /** Add an extra underscore to identifiers that start with two underscores to avoid issues with magic names like '__proto__' */
    function escapeLeadingUnderscores(identifier: string): __String;
    /**
     * Remove extra underscore from escaped identifier text content.
     *
     * @param identifier The escaped identifier text.
     * @returns The unescaped identifier text.
     */
    function unescapeLeadingUnderscores(identifier: __String): string;
    function idText(identifierOrPrivateName: Identifier | PrivateIdentifier): string;
    function symbolName(symbol: Symbol): string;
    /** @internal */
    function nodeHasName(statement: Node, name: Identifier): boolean;
    function getNameOfJSDocTypedef(declaration: JSDocTypedefTag): Identifier | PrivateIdentifier | undefined;
    /** @internal */
    function isNamedDeclaration(node: Node): node is NamedDeclaration & {
        name: DeclarationName;
    };
    /** @internal */
    function getNonAssignedNameOfDeclaration(declaration: Declaration | Expression): DeclarationName | undefined;
    function getNameOfDeclaration(declaration: Declaration | Expression): DeclarationName | undefined;
    function getAssignedName(node: Node): DeclarationName | undefined;
    /**
     * Gets the JSDoc parameter tags for the node if present.
     *
     * @remarks Returns any JSDoc param tag whose name matches the provided
     * parameter, whether a param tag on a containing function
     * expression, or a param tag on a variable declaration whose
     * initializer is the containing function. The tags closest to the
     * node are returned first, so in the previous example, the param
     * tag on the containing function expression would be first.
     *
     * For binding patterns, parameter tags are matched by position.
     */
    function getJSDocParameterTags(param: ParameterDeclaration): readonly JSDocParameterTag[];
    function getJSDocParameterTagsNoCache(param: ParameterDeclaration): readonly JSDocParameterTag[];
    /**
     * Gets the JSDoc type parameter tags for the node if present.
     *
     * @remarks Returns any JSDoc template tag whose names match the provided
     * parameter, whether a template tag on a containing function
     * expression, or a template tag on a variable declaration whose
     * initializer is the containing function. The tags closest to the
     * node are returned first, so in the previous example, the template
     * tag on the containing function expression would be first.
     */
    function getJSDocTypeParameterTags(param: TypeParameterDeclaration): readonly JSDocTemplateTag[];
    function getJSDocTypeParameterTagsNoCache(param: TypeParameterDeclaration): readonly JSDocTemplateTag[];
    /**
     * Return true if the node has JSDoc parameter tags.
     *
     * @remarks Includes parameter tags that are not directly on the node,
     * for example on a variable declaration whose initializer is a function expression.
     */
    function hasJSDocParameterTags(node: FunctionLikeDeclaration | SignatureDeclaration): boolean;
    /** Gets the JSDoc augments tag for the node if present */
    function getJSDocAugmentsTag(node: Node): JSDocAugmentsTag | undefined;
    /** Gets the JSDoc implements tags for the node if present */
    function getJSDocImplementsTags(node: Node): readonly JSDocImplementsTag[];
    /** Gets the JSDoc class tag for the node if present */
    function getJSDocClassTag(node: Node): JSDocClassTag | undefined;
    /** Gets the JSDoc public tag for the node if present */
    function getJSDocPublicTag(node: Node): JSDocPublicTag | undefined;
    function getJSDocPublicTagNoCache(node: Node): JSDocPublicTag | undefined;
    /** Gets the JSDoc private tag for the node if present */
    function getJSDocPrivateTag(node: Node): JSDocPrivateTag | undefined;
    function getJSDocPrivateTagNoCache(node: Node): JSDocPrivateTag | undefined;
    /** Gets the JSDoc protected tag for the node if present */
    function getJSDocProtectedTag(node: Node): JSDocProtectedTag | undefined;
    function getJSDocProtectedTagNoCache(node: Node): JSDocProtectedTag | undefined;
    /** Gets the JSDoc protected tag for the node if present */
    function getJSDocReadonlyTag(node: Node): JSDocReadonlyTag | undefined;
    function getJSDocReadonlyTagNoCache(node: Node): JSDocReadonlyTag | undefined;
    /** Gets the JSDoc deprecated tag for the node if present */
    function getJSDocDeprecatedTag(node: Node): JSDocDeprecatedTag | undefined;
    function getJSDocDeprecatedTagNoCache(node: Node): JSDocDeprecatedTag | undefined;
    /** Gets the JSDoc enum tag for the node if present */
    function getJSDocEnumTag(node: Node): JSDocEnumTag | undefined;
    /** Gets the JSDoc this tag for the node if present */
    function getJSDocThisTag(node: Node): JSDocThisTag | undefined;
    /** Gets the JSDoc return tag for the node if present */
    function getJSDocReturnTag(node: Node): JSDocReturnTag | undefined;
    /** Gets the JSDoc template tag for the node if present */
    function getJSDocTemplateTag(node: Node): JSDocTemplateTag | undefined;
    /** Gets the JSDoc type tag for the node if present and valid */
    function getJSDocTypeTag(node: Node): JSDocTypeTag | undefined;
    /**
     * Gets the type node for the node if provided via JSDoc.
     *
     * @remarks The search includes any JSDoc param tag that relates
     * to the provided parameter, for example a type tag on the
     * parameter itself, or a param tag on a containing function
     * expression, or a param tag on a variable declaration whose
     * initializer is the containing function. The tags closest to the
     * node are examined first, so in the previous example, the type
     * tag directly on the node would be returned.
     */
    function getJSDocType(node: Node): TypeNode | undefined;
    /**
     * Gets the return type node for the node if provided via JSDoc return tag or type tag.
     *
     * @remarks `getJSDocReturnTag` just gets the whole JSDoc tag. This function
     * gets the type from inside the braces, after the fat arrow, etc.
     */
    function getJSDocReturnType(node: Node): TypeNode | undefined;
    /** Get all JSDoc tags related to a node, including those on parent nodes. */
    function getJSDocTags(node: Node): readonly JSDocTag[];
    function getJSDocTagsNoCache(node: Node): readonly JSDocTag[];
    /** Gets all JSDoc tags that match a specified predicate */
    function getAllJSDocTags<T extends JSDocTag>(node: Node, predicate: (tag: JSDocTag) => tag is T): readonly T[];
    /** Gets all JSDoc tags of a specified kind */
    function getAllJSDocTagsOfKind(node: Node, kind: SyntaxKind): readonly JSDocTag[];
    /**
     * Gets the effective type parameters. If the node was parsed in a
     * JavaScript file, gets the type parameters from the `@template` tag from JSDoc.
     */
    function getEffectiveTypeParameterDeclarations(node: DeclarationWithTypeParameters): readonly TypeParameterDeclaration[];
    function getEffectiveConstraintOfTypeParameter(node: TypeParameterDeclaration): TypeNode | undefined;
    function isIdentifierOrPrivateIdentifier(node: Node): node is Identifier | PrivateIdentifier;
    function isGetOrSetAccessorDeclaration(node: Node): node is AccessorDeclaration;
    function isPropertyAccessChain(node: Node): node is PropertyAccessChain;
    function isElementAccessChain(node: Node): node is ElementAccessChain;
    function isCallChain(node: Node): node is CallChain;
    function isOptionalChain(node: Node): node is PropertyAccessChain | ElementAccessChain | CallChain | NonNullChain;
    function isOptionalChainRoot(node: Node): node is OptionalChainRoot;
    /**
     * Determines whether a node is the expression preceding an optional chain (i.e. `a` in `a?.b`).
     */
    function isExpressionOfOptionalChainRoot(node: Node): node is Expression & {
        parent: OptionalChainRoot;
    };
    /**
     * Determines whether a node is the outermost `OptionalChain` in an ECMAScript `OptionalExpression`:
     *
     * 1. For `a?.b.c`, the outermost chain is `a?.b.c` (`c` is the end of the chain starting at `a?.`)
     * 2. For `a?.b!`, the outermost chain is `a?.b` (`b` is the end of the chain starting at `a?.`)
     * 3. For `(a?.b.c).d`, the outermost chain is `a?.b.c` (`c` is the end of the chain starting at `a?.` since parens end the chain)
     * 4. For `a?.b.c?.d`, both `a?.b.c` and `a?.b.c?.d` are outermost (`c` is the end of the chain starting at `a?.`, and `d` is
     *   the end of the chain starting at `c?.`)
     * 5. For `a?.(b?.c).d`, both `b?.c` and `a?.(b?.c)d` are outermost (`c` is the end of the chain starting at `b`, and `d` is
     *   the end of the chain starting at `a?.`)
     */
    function isOutermostOptionalChain(node: OptionalChain): boolean;
    function isNullishCoalesce(node: Node): boolean;
    function isConstTypeReference(node: Node): boolean;
    function skipPartiallyEmittedExpressions(node: Expression): Expression;
    function skipPartiallyEmittedExpressions(node: Node): Node;
    function isNonNullChain(node: Node): node is NonNullChain;
    function isBreakOrContinueStatement(node: Node): node is BreakOrContinueStatement;
    function isNamedExportBindings(node: Node): node is NamedExportBindings;
    function isUnparsedTextLike(node: Node): node is UnparsedTextLike;
    function isUnparsedNode(node: Node): node is UnparsedNode;
    function isJSDocPropertyLikeTag(node: Node): node is JSDocPropertyLikeTag;
    function isNode(node: Node): boolean;
    function isNodeKind(kind: SyntaxKind): boolean;
    /**
     * True if node is of some token syntax kind.
     * For example, this is true for an IfKeyword but not for an IfStatement.
     * Literals are considered tokens, except TemplateLiteral, but does include TemplateHead/Middle/Tail.
     */
    function isToken(n: Node): boolean;
    function isNodeArray<T extends Node>(array: readonly T[]): array is NodeArray<T>;
    function isLiteralKind(kind: SyntaxKind): kind is LiteralToken["kind"];
    function isLiteralExpression(node: Node): node is LiteralExpression;
    function isTemplateLiteralKind(kind: SyntaxKind): kind is TemplateLiteralToken["kind"];
    function isTemplateLiteralToken(node: Node): node is TemplateLiteralToken;
    function isTemplateMiddleOrTemplateTail(node: Node): node is TemplateMiddle | TemplateTail;
    function isImportOrExportSpecifier(node: Node): node is ImportSpecifier | ExportSpecifier;
    function isTypeOnlyImportOrExportDeclaration(node: Node): node is TypeOnlyCompatibleAliasDeclaration;
    function isStringTextContainingNode(node: Node): node is StringLiteral | TemplateLiteralToken;
    function isGeneratedIdentifier(node: Node): node is GeneratedIdentifier;
    function isPrivateIdentifierPropertyDeclaration(node: Node): node is PrivateIdentifierPropertyDeclaration;
    function isPrivateIdentifierPropertyAccessExpression(node: Node): node is PrivateIdentifierPropertyAccessExpression;
    function isModifierKind(token: SyntaxKind): token is Modifier["kind"];
    function isParameterPropertyModifier(kind: SyntaxKind): boolean;
    function isClassMemberModifier(idToken: SyntaxKind): boolean;
    function isModifier(node: Node): node is Modifier;
    function isEntityName(node: Node): node is EntityName;
    function isPropertyName(node: Node): node is PropertyName;
    function isBindingName(node: Node): node is BindingName;
    function isFunctionLike(node: Node): node is SignatureDeclaration;
    function isFunctionLikeDeclaration(node: Node): node is FunctionLikeDeclaration;
    function isFunctionLikeKind(kind: SyntaxKind): boolean;
    function isFunctionOrModuleBlock(node: Node): boolean;
    function isClassElement(node: Node): node is ClassElement;
    function isClassLike(node: Node): node is ClassLikeDeclaration;
    function isAccessor(node: Node): node is AccessorDeclaration;
    function isMethodOrAccessor(node: Node): node is MethodDeclaration | AccessorDeclaration;
    function isTypeElement(node: Node): node is TypeElement;
    function isClassOrTypeElement(node: Node): node is ClassElement | TypeElement;
    function isObjectLiteralElementLike(node: Node): node is ObjectLiteralElementLike;
    /**
     * Node test that determines whether a node is a valid type node.
     * This differs from the `isPartOfTypeNode` function which determines whether a node is *part*
     * of a TypeNode.
     */
    function isTypeNode(node: Node): node is TypeNode;
    function isFunctionOrConstructorTypeNode(node: Node): node is FunctionTypeNode | ConstructorTypeNode;
    function isBindingPattern(node: Node | undefined): node is BindingPattern;
    function isAssignmentPattern(node: Node): node is AssignmentPattern;
    function isArrayBindingElement(node: Node): node is ArrayBindingElement;
    /**
     * Determines whether the BindingOrAssignmentElement is a BindingElement-like declaration
     */
    function isDeclarationBindingElement(bindingElement: BindingOrAssignmentElement): bindingElement is VariableDeclaration | ParameterDeclaration | BindingElement;
    /**
     * Determines whether a node is a BindingOrAssignmentPattern
     */
    function isBindingOrAssignmentPattern(node: BindingOrAssignmentElementTarget): node is BindingOrAssignmentPattern;
    /**
     * Determines whether a node is an ObjectBindingOrAssignmentPattern
     */
    function isObjectBindingOrAssignmentPattern(node: BindingOrAssignmentElementTarget): node is ObjectBindingOrAssignmentPattern;
    /**
     * Determines whether a node is an ArrayBindingOrAssignmentPattern
     */
    function isArrayBindingOrAssignmentPattern(node: BindingOrAssignmentElementTarget): node is ArrayBindingOrAssignmentPattern;
    function isPropertyAccessOrQualifiedNameOrImportTypeNode(node: Node): node is PropertyAccessExpression | QualifiedName | ImportTypeNode;
    function isPropertyAccessOrQualifiedName(node: Node): node is PropertyAccessExpression | QualifiedName;
    function isCallLikeExpression(node: Node): node is CallLikeExpression;
    function isCallOrNewExpression(node: Node): node is CallExpression | NewExpression;
    function isTemplateLiteral(node: Node): node is TemplateLiteral;
    function isLeftHandSideExpression(node: Node): node is LeftHandSideExpression;
    function isUnaryExpression(node: Node): node is UnaryExpression;
    function isUnaryExpressionWithWrite(expr: Node): expr is PrefixUnaryExpression | PostfixUnaryExpression;
    /**
     * Determines whether a node is an expression based only on its kind.
     * Use `isExpressionNode` if not in transforms.
     */
    function isExpression(node: Node): node is Expression;
    function isAssertionExpression(node: Node): node is AssertionExpression;
    function isNotEmittedOrPartiallyEmittedNode(node: Node): node is NotEmittedStatement | PartiallyEmittedExpression;
    function isIterationStatement(node: Node, lookInLabeledStatements: false): node is IterationStatement;
    function isIterationStatement(node: Node, lookInLabeledStatements: boolean): node is IterationStatement | LabeledStatement;
    function isScopeMarker(node: Node): boolean;
    function hasScopeMarker(statements: readonly Statement[]): boolean;
    function needsScopeMarker(result: Statement): boolean;
    function isExternalModuleIndicator(result: Statement): boolean;
    function isForInOrOfStatement(node: Node): node is ForInOrOfStatement;
    function isConciseBody(node: Node): node is ConciseBody;
    function isFunctionBody(node: Node): node is FunctionBody;
    function isForInitializer(node: Node): node is ForInitializer;
    function isModuleBody(node: Node): node is ModuleBody;
    function isNamespaceBody(node: Node): node is NamespaceBody;
    function isJSDocNamespaceBody(node: Node): node is JSDocNamespaceBody;
    function isNamedImportBindings(node: Node): node is NamedImportBindings;
    function isModuleOrEnumDeclaration(node: Node): node is ModuleDeclaration | EnumDeclaration;
    function isDeclaration(node: Node): node is NamedDeclaration;
    function isDeclarationStatement(node: Node): node is DeclarationStatement;
    /**
     * Determines whether the node is a statement that is not also a declaration
     */
    function isStatementButNotDeclaration(node: Node): node is Statement;
    function isStatement(node: Node): node is Statement;
    /**
     * NOTE: This is similar to `isStatement` but does not access parent pointers.
     */
    function isStatementOrBlock(node: Node): node is Statement | Block;
    function isModuleReference(node: Node): node is ModuleReference;
    function isJsxTagNameExpression(node: Node): node is JsxTagNameExpression;
    function isJsxChild(node: Node): node is JsxChild;
    function isJsxAttributeLike(node: Node): node is JsxAttributeLike;
    function isStringLiteralOrJsxExpression(node: Node): node is StringLiteral | JsxExpression;
    function isJsxOpeningLikeElement(node: Node): node is JsxOpeningLikeElement;
    function isCaseOrDefaultClause(node: Node): node is CaseOrDefaultClause;
    /** True if node is of some JSDoc syntax kind. */
    function isJSDocNode(node: Node): boolean;
    /** True if node is of a kind that may contain comment text. */
    function isJSDocCommentContainingNode(node: Node): boolean;
    function isJSDocTag(node: Node): node is JSDocTag;
    function isSetAccessor(node: Node): node is SetAccessorDeclaration;
    function isGetAccessor(node: Node): node is GetAccessorDeclaration;
    /** True if has jsdoc nodes attached to it. */
    function hasJSDocNodes(node: Node): node is HasJSDoc;
    /** True if has type node attached to it. */
    function hasType(node: Node): node is HasType;
    /** True if has initializer node attached to it. */
    function hasInitializer(node: Node): node is HasInitializer;
    /** True if has initializer node attached to it. */
    function hasOnlyExpressionInitializer(node: Node): node is HasExpressionInitializer;
    function isObjectLiteralElement(node: Node): node is ObjectLiteralElement;
    function isTypeReferenceType(node: Node): node is TypeReferenceType;
    function guessIndentation(lines: string[]): number | undefined;
    function isStringLiteralLike(node: Node): node is StringLiteralLike;
}
declare namespace ts {
    export const resolvingEmptyArray: never[];
    export const externalHelpersModuleNameText = "tslib";
    export const defaultMaximumTruncationLength = 160;
    export const noTruncationMaximumTruncationLength = 1000000;
    export function getDeclarationOfKind<T extends Declaration>(symbol: Symbol, kind: T["kind"]): T | undefined;
    /**
     * Create a new escaped identifier map.
     * @deprecated Use `new Map<__String, T>()` instead.
     */
    export function createUnderscoreEscapedMap<T>(): UnderscoreEscapedMap<T>;
    /**
     * @deprecated Use `!!map?.size` instead
     */
    export function hasEntries(map: ReadonlyCollection<any> | undefined): map is ReadonlyCollection<any>;
    export function createSymbolTable(symbols?: readonly Symbol[]): SymbolTable;
    export function isTransientSymbol(symbol: Symbol): symbol is TransientSymbol;
    export function changesAffectModuleResolution(oldOptions: CompilerOptions, newOptions: CompilerOptions): boolean;
    export function optionsHaveModuleResolutionChanges(oldOptions: CompilerOptions, newOptions: CompilerOptions): boolean;
    export function forEachAncestor<T>(node: Node, callback: (n: Node) => T | undefined | "quit"): T | undefined;
    /**
     * Calls `callback` for each entry in the map, returning the first truthy result.
     * Use `map.forEach` instead for normal iteration.
     */
    export function forEachEntry<K, V, U>(map: ReadonlyESMap<K, V>, callback: (value: V, key: K) => U | undefined): U | undefined;
    /** `forEachEntry` for just keys. */
    export function forEachKey<K, T>(map: ReadonlyCollection<K>, callback: (key: K) => T | undefined): T | undefined;
    /** Copy entries from `source` to `target`. */
    export function copyEntries<K, V>(source: ReadonlyESMap<K, V>, target: ESMap<K, V>): void;
    export function usingSingleLineStringWriter(action: (writer: EmitTextWriter) => void): string;
    export function getFullWidth(node: Node): number;
    export function getResolvedModule(sourceFile: SourceFile | undefined, moduleNameText: string): ResolvedModuleFull | undefined;
    export function setResolvedModule(sourceFile: SourceFile, moduleNameText: string, resolvedModule: ResolvedModuleFull): void;
    export function setResolvedTypeReferenceDirective(sourceFile: SourceFile, typeReferenceDirectiveName: string, resolvedTypeReferenceDirective?: ResolvedTypeReferenceDirective): void;
    export function projectReferenceIsEqualTo(oldRef: ProjectReference, newRef: ProjectReference): boolean;
    export function moduleResolutionIsEqualTo(oldResolution: ResolvedModuleFull, newResolution: ResolvedModuleFull): boolean;
    export function packageIdToString({ name, subModuleName, version }: PackageId): string;
    export function typeDirectiveIsEqualTo(oldResolution: ResolvedTypeReferenceDirective, newResolution: ResolvedTypeReferenceDirective): boolean;
    export function hasChangesInResolutions<T>(names: readonly string[], newResolutions: readonly T[], oldResolutions: ReadonlyESMap<string, T> | undefined, comparer: (oldResolution: T, newResolution: T) => boolean): boolean;
    export function containsParseError(node: Node): boolean;
    export function getSourceFileOfNode(node: Node): SourceFile;
    export function getSourceFileOfNode(node: Node | undefined): SourceFile | undefined;
    export function isStatementWithLocals(node: Node): boolean;
    export function getStartPositionOfLine(line: number, sourceFile: SourceFileLike): number;
    export function nodePosToString(node: Node): string;
    export function getEndLinePosition(line: number, sourceFile: SourceFileLike): number;
    /**
     * Returns a value indicating whether a name is unique globally or within the current file.
     * Note: This does not consider whether a name appears as a free identifier or not, so at the expression `x.y` this includes both `x` and `y`.
     */
    export function isFileLevelUniqueName(sourceFile: SourceFile, name: string, hasGlobalName?: PrintHandlers["hasGlobalName"]): boolean;
    export function nodeIsMissing(node: Node | undefined): boolean;
    export function nodeIsPresent(node: Node | undefined): boolean;
    /**
     * Prepends statements to an array while taking care of prologue directives.
     */
    export function insertStatementsAfterStandardPrologue<T extends Statement>(to: T[], from: readonly T[] | undefined): T[];
    export function insertStatementsAfterCustomPrologue<T extends Statement>(to: T[], from: readonly T[] | undefined): T[];
    /**
     * Prepends statements to an array while taking care of prologue directives.
     */
    export function insertStatementAfterStandardPrologue<T extends Statement>(to: T[], statement: T | undefined): T[];
    export function insertStatementAfterCustomPrologue<T extends Statement>(to: T[], statement: T | undefined): T[];
    /**
     * Determine if the given comment is a triple-slash
     *
     * @return true if the comment is a triple-slash comment else false
     */
    export function isRecognizedTripleSlashComment(text: string, commentPos: number, commentEnd: number): boolean;
    export function isPinnedComment(text: string, start: number): boolean;
    export function createCommentDirectivesMap(sourceFile: SourceFile, commentDirectives: CommentDirective[]): CommentDirectivesMap;
    export function getTokenPosOfNode(node: Node, sourceFile?: SourceFileLike, includeJsDoc?: boolean): number;
    export function getNonDecoratorTokenPosOfNode(node: Node, sourceFile?: SourceFileLike): number;
    export function getSourceTextOfNodeFromSourceFile(sourceFile: SourceFile, node: Node, includeTrivia?: boolean): string;
    export function isExportNamespaceAsDefaultDeclaration(node: Node): boolean;
    export function getTextOfNodeFromSourceText(sourceText: string, node: Node, includeTrivia?: boolean): string;
    export function getTextOfNode(node: Node, includeTrivia?: boolean): string;
    /**
     * Note: it is expected that the `nodeArray` and the `node` are within the same file.
     * For example, searching for a `SourceFile` in a `SourceFile[]` wouldn't work.
     */
    export function indexOfNode(nodeArray: readonly Node[], node: Node): number;
    /**
     * Gets flags that control emit behavior of a node.
     */
    export function getEmitFlags(node: Node): EmitFlags;
    interface ScriptTargetFeatures {
        [key: string]: {
            [key: string]: string[] | undefined;
        };
    }
    export function getScriptTargetFeatures(): ScriptTargetFeatures;
    export const enum GetLiteralTextFlags {
        None = 0,
        NeverAsciiEscape = 1,
        JsxAttributeEscape = 2,
        TerminateUnterminatedLiterals = 4,
        AllowNumericSeparator = 8
    }
    export function getLiteralText(node: LiteralLikeNode, sourceFile: SourceFile, flags: GetLiteralTextFlags): string;
    export function getTextOfConstantValue(value: string | number): string;
    export function makeIdentifierFromModuleName(moduleName: string): string;
    export function isBlockOrCatchScoped(declaration: Declaration): boolean;
    export function isCatchClauseVariableDeclarationOrBindingElement(declaration: Declaration): boolean;
    export function isAmbientModule(node: Node): node is AmbientModuleDeclaration;
    export function isModuleWithStringLiteralName(node: Node): node is ModuleDeclaration;
    export function isNonGlobalAmbientModule(node: Node): node is ModuleDeclaration & {
        name: StringLiteral;
    };
    /**
     * An effective module (namespace) declaration is either
     * 1. An actual declaration: namespace X { ... }
     * 2. A Javascript declaration, which is:
     *    An identifier in a nested property access expression: Y in `X.Y.Z = { ... }`
     */
    export function isEffectiveModuleDeclaration(node: Node): boolean;
    /** Given a symbol for a module, checks that it is a shorthand ambient module. */
    export function isShorthandAmbientModuleSymbol(moduleSymbol: Symbol): boolean;
    export function isBlockScopedContainerTopLevel(node: Node): boolean;
    export function isGlobalScopeAugmentation(module: ModuleDeclaration): boolean;
    export function isExternalModuleAugmentation(node: Node): node is AmbientModuleDeclaration;
    export function isModuleAugmentationExternal(node: AmbientModuleDeclaration): boolean;
    export function getNonAugmentationDeclaration(symbol: Symbol): Declaration | undefined;
    export function isEffectiveExternalModule(node: SourceFile, compilerOptions: CompilerOptions): boolean;
    /**
     * Returns whether the source file will be treated as if it were in strict mode at runtime.
     */
    export function isEffectiveStrictModeSourceFile(node: SourceFile, compilerOptions: CompilerOptions): boolean;
    export function isBlockScope(node: Node, parentNode: Node): boolean;
    export function isDeclarationWithTypeParameters(node: Node): node is DeclarationWithTypeParameters;
    export function isDeclarationWithTypeParameterChildren(node: Node): node is DeclarationWithTypeParameterChildren;
    export function isAnyImportSyntax(node: Node): node is AnyImportSyntax;
    export function isLateVisibilityPaintedStatement(node: Node): node is LateVisibilityPaintedStatement;
    export function hasPossibleExternalModuleReference(node: Node): node is AnyImportOrReExport | ModuleDeclaration | ImportTypeNode | ImportCall;
    export function isAnyImportOrReExport(node: Node): node is AnyImportOrReExport;
    export function getEnclosingBlockScopeContainer(node: Node): Node;
    export function declarationNameToString(name: DeclarationName | QualifiedName | undefined): string;
    export function getNameFromIndexInfo(info: IndexInfo): string | undefined;
    export function isComputedNonLiteralName(name: PropertyName): boolean;
    export function getTextOfPropertyName(name: PropertyName | NoSubstitutionTemplateLiteral): __String;
    export function entityNameToString(name: EntityNameOrEntityNameExpression | JsxTagNameExpression | PrivateIdentifier): string;
    export function createDiagnosticForNode(node: Node, message: DiagnosticMessage, arg0?: string | number, arg1?: string | number, arg2?: string | number, arg3?: string | number): DiagnosticWithLocation;
    export function createDiagnosticForNodeArray(sourceFile: SourceFile, nodes: NodeArray<Node>, message: DiagnosticMessage, arg0?: string | number, arg1?: string | number, arg2?: string | number, arg3?: string | number): DiagnosticWithLocation;
    export function createDiagnosticForNodeInSourceFile(sourceFile: SourceFile, node: Node, message: DiagnosticMessage, arg0?: string | number, arg1?: string | number, arg2?: string | number, arg3?: string | number): DiagnosticWithLocation;
    export function createDiagnosticForNodeFromMessageChain(node: Node, messageChain: DiagnosticMessageChain, relatedInformation?: DiagnosticRelatedInformation[]): DiagnosticWithLocation;
    export function createFileDiagnosticFromMessageChain(file: SourceFile, start: number, length: number, messageChain: DiagnosticMessageChain, relatedInformation?: DiagnosticRelatedInformation[]): DiagnosticWithLocation;
    export function createDiagnosticForFileFromMessageChain(sourceFile: SourceFile, messageChain: DiagnosticMessageChain, relatedInformation?: DiagnosticRelatedInformation[]): DiagnosticWithLocation;
    export function createDiagnosticForRange(sourceFile: SourceFile, range: TextRange, message: DiagnosticMessage): DiagnosticWithLocation;
    export function getSpanOfTokenAtPosition(sourceFile: SourceFile, pos: number): TextSpan;
    export function getErrorSpanForNode(sourceFile: SourceFile, node: Node): TextSpan;
    export function isExternalOrCommonJsModule(file: SourceFile): boolean;
    export function isJsonSourceFile(file: SourceFile): file is JsonSourceFile;
    export function isEnumConst(node: EnumDeclaration): boolean;
    export function isDeclarationReadonly(declaration: Declaration): boolean;
    export function isVarConst(node: VariableDeclaration | VariableDeclarationList): boolean;
    export function isLet(node: Node): boolean;
    export function isSuperCall(n: Node): n is SuperCall;
    export function isImportCall(n: Node): n is ImportCall;
    export function isImportMeta(n: Node): n is ImportMetaProperty;
    export function isLiteralImportTypeNode(n: Node): n is LiteralImportTypeNode;
    export function isPrologueDirective(node: Node): node is PrologueDirective;
    export function isCustomPrologue(node: Statement): boolean;
    export function isHoistedFunction(node: Statement): boolean;
    export function isHoistedVariableStatement(node: Statement): boolean;
    export function getLeadingCommentRangesOfNode(node: Node, sourceFileOfNode: SourceFile): CommentRange[] | undefined;
    export function getJSDocCommentRanges(node: Node, text: string): CommentRange[] | undefined;
    export const fullTripleSlashReferencePathRegEx: RegExp;
    export const fullTripleSlashAMDReferencePathRegEx: RegExp;
    export function isPartOfTypeNode(node: Node): boolean;
    export function isChildOfNodeWithKind(node: Node, kind: SyntaxKind): boolean;
    export function forEachReturnStatement<T>(body: Block, visitor: (stmt: ReturnStatement) => T): T | undefined;
    export function forEachYieldExpression(body: Block, visitor: (expr: YieldExpression) => void): void;
    /**
     * Gets the most likely element type for a TypeNode. This is not an exhaustive test
     * as it assumes a rest argument can only be an array type (either T[], or Array<T>).
     *
     * @param node The type node.
     */
    export function getRestParameterElementType(node: TypeNode | undefined): TypeNode | undefined;
    export function getMembersOfDeclaration(node: Declaration): NodeArray<ClassElement | TypeElement | ObjectLiteralElement> | undefined;
    export function isVariableLike(node: Node): node is VariableLikeDeclaration;
    export function isVariableLikeOrAccessor(node: Node): node is AccessorDeclaration | VariableLikeDeclaration;
    export function isVariableDeclarationInVariableStatement(node: VariableDeclaration): boolean;
    export function isValidESSymbolDeclaration(node: Node): node is VariableDeclaration | PropertyDeclaration | SignatureDeclaration;
    export function introducesArgumentsExoticObject(node: Node): boolean;
    export function unwrapInnermostStatementOfLabel(node: LabeledStatement, beforeUnwrapLabelCallback?: (node: LabeledStatement) => void): Statement;
    export function isFunctionBlock(node: Node): boolean;
    export function isObjectLiteralMethod(node: Node): node is MethodDeclaration;
    export function isObjectLiteralOrClassExpressionMethod(node: Node): node is MethodDeclaration;
    export function isIdentifierTypePredicate(predicate: TypePredicate): predicate is IdentifierTypePredicate;
    export function isThisTypePredicate(predicate: TypePredicate): predicate is ThisTypePredicate;
    export function getPropertyAssignment(objectLiteral: ObjectLiteralExpression, key: string, key2?: string): readonly PropertyAssignment[];
    export function getPropertyArrayElementValue(objectLiteral: ObjectLiteralExpression, propKey: string, elementValue: string): StringLiteral | undefined;
    export function getTsConfigObjectLiteralExpression(tsConfigSourceFile: TsConfigSourceFile | undefined): ObjectLiteralExpression | undefined;
    export function getTsConfigPropArrayElementValue(tsConfigSourceFile: TsConfigSourceFile | undefined, propKey: string, elementValue: string): StringLiteral | undefined;
    export function getTsConfigPropArray(tsConfigSourceFile: TsConfigSourceFile | undefined, propKey: string): readonly PropertyAssignment[];
    export function getContainingFunction(node: Node): SignatureDeclaration | undefined;
    export function getContainingFunctionDeclaration(node: Node): FunctionLikeDeclaration | undefined;
    export function getContainingClass(node: Node): ClassLikeDeclaration | undefined;
    export function getThisContainer(node: Node, includeArrowFunctions: boolean): Node;
    export function isInTopLevelContext(node: Node): boolean;
    export function getNewTargetContainer(node: Node): Node | undefined;
    /**
     * Given an super call/property node, returns the closest node where
     * - a super call/property access is legal in the node and not legal in the parent node the node.
     *   i.e. super call is legal in constructor but not legal in the class body.
     * - the container is an arrow function (so caller might need to call getSuperContainer again in case it needs to climb higher)
     * - a super call/property is definitely illegal in the container (but might be legal in some subnode)
     *   i.e. super property access is illegal in function declaration but can be legal in the statement list
     */
    export function getSuperContainer(node: Node, stopOnFunctions: boolean): Node;
    export function getImmediatelyInvokedFunctionExpression(func: Node): CallExpression | undefined;
    export function isSuperOrSuperProperty(node: Node): node is SuperExpression | SuperProperty;
    /**
     * Determines whether a node is a property or element access expression for `super`.
     */
    export function isSuperProperty(node: Node): node is SuperProperty;
    /**
     * Determines whether a node is a property or element access expression for `this`.
     */
    export function isThisProperty(node: Node): boolean;
    export function isThisInitializedDeclaration(node: Node | undefined): boolean;
    export function getEntityNameFromTypeNode(node: TypeNode): EntityNameOrEntityNameExpression | undefined;
    export function getInvokedExpression(node: CallLikeExpression): Expression;
    export function nodeCanBeDecorated(node: ClassDeclaration): true;
    export function nodeCanBeDecorated(node: ClassElement, parent: Node): boolean;
    export function nodeCanBeDecorated(node: Node, parent: Node, grandparent: Node): boolean;
    export function nodeIsDecorated(node: ClassDeclaration): boolean;
    export function nodeIsDecorated(node: ClassElement, parent: Node): boolean;
    export function nodeIsDecorated(node: Node, parent: Node, grandparent: Node): boolean;
    export function nodeOrChildIsDecorated(node: ClassDeclaration): boolean;
    export function nodeOrChildIsDecorated(node: ClassElement, parent: Node): boolean;
    export function nodeOrChildIsDecorated(node: Node, parent: Node, grandparent: Node): boolean;
    export function childIsDecorated(node: ClassDeclaration): boolean;
    export function childIsDecorated(node: Node, parent: Node): boolean;
    export function isJSXTagName(node: Node): boolean;
    export function isExpressionNode(node: Node): boolean;
    export function isInExpressionContext(node: Node): boolean;
    export function isPartOfTypeQuery(node: Node): boolean;
    export function isExternalModuleImportEqualsDeclaration(node: Node): node is ImportEqualsDeclaration & {
        moduleReference: ExternalModuleReference;
    };
    export function getExternalModuleImportEqualsDeclarationExpression(node: Node): Expression;
    export function getExternalModuleRequireArgument(node: Node): false | StringLiteral;
    export function isInternalModuleImportEqualsDeclaration(node: Node): node is ImportEqualsDeclaration;
    export function isSourceFileJS(file: SourceFile): boolean;
    export function isSourceFileNotJS(file: SourceFile): boolean;
    export function isInJSFile(node: Node | undefined): boolean;
    export function isInJsonFile(node: Node | undefined): boolean;
    export function isSourceFileNotJson(file: SourceFile): boolean;
    export function isInJSDoc(node: Node | undefined): boolean;
    export function isJSDocIndexSignature(node: TypeReferenceNode | ExpressionWithTypeArguments): boolean | undefined;
    /**
     * Returns true if the node is a CallExpression to the identifier 'require' with
     * exactly one argument (of the form 'require("name")').
     * This function does not test if the node is in a JavaScript file or not.
     */
    export function isRequireCall(callExpression: Node, requireStringLiteralLikeArgument: true): callExpression is RequireOrImportCall & {
        expression: Identifier;
        arguments: [StringLiteralLike];
    };
    export function isRequireCall(callExpression: Node, requireStringLiteralLikeArgument: boolean): callExpression is CallExpression;
    /**
     * Returns true if the node is a VariableDeclaration initialized to a require call (see `isRequireCall`).
     * This function does not test if the node is in a JavaScript file or not.
     */
    export function isRequireVariableDeclaration(node: Node, requireStringLiteralLikeArgument: true): node is RequireVariableDeclaration;
    export function isRequireVariableDeclaration(node: Node, requireStringLiteralLikeArgument: boolean): node is VariableDeclaration;
    export function isRequireVariableStatement(node: Node, requireStringLiteralLikeArgument?: boolean): node is RequireVariableStatement;
    export function isSingleOrDoubleQuote(charCode: number): boolean;
    export function isStringDoubleQuoted(str: StringLiteralLike, sourceFile: SourceFile): boolean;
    export function isAssignmentDeclaration(decl: Declaration): boolean;
    /** Get the initializer, taking into account defaulted Javascript initializers */
    export function getEffectiveInitializer(node: HasExpressionInitializer): Expression | undefined;
    /** Get the declaration initializer when it is container-like (See getExpandoInitializer). */
    export function getDeclaredExpandoInitializer(node: HasExpressionInitializer): Expression | undefined;
    /**
     * Get the assignment 'initializer' -- the righthand side-- when the initializer is container-like (See getExpandoInitializer).
     * We treat the right hand side of assignments with container-like initializers as declarations.
     */
    export function getAssignedExpandoInitializer(node: Node | undefined): Expression | undefined;
    /**
     * Recognized expando initializers are:
     * 1. (function() {})() -- IIFEs
     * 2. function() { } -- Function expressions
     * 3. class { } -- Class expressions
     * 4. {} -- Empty object literals
     * 5. { ... } -- Non-empty object literals, when used to initialize a prototype, like `C.prototype = { m() { } }`
     *
     * This function returns the provided initializer, or undefined if it is not valid.
     */
    export function getExpandoInitializer(initializer: Node, isPrototypeAssignment: boolean): Expression | undefined;
    export function isDefaultedExpandoInitializer(node: BinaryExpression): boolean | undefined;
    /** Given an expando initializer, return its declaration name, or the left-hand side of the assignment if it's part of an assignment declaration. */
    export function getNameOfExpando(node: Declaration): DeclarationName | undefined;
    /**
     * Is the 'declared' name the same as the one in the initializer?
     * @return true for identical entity names, as well as ones where the initializer is prefixed with
     * 'window', 'self' or 'global'. For example:
     *
     * var my = my || {}
     * var min = window.min || {}
     * my.app = self.my.app || class { }
     */
    export function isSameEntityName(name: Expression, initializer: Expression): boolean;
    export function getRightMostAssignedExpression(node: Expression): Expression;
    export function isExportsIdentifier(node: Node): boolean;
    export function isModuleIdentifier(node: Node): boolean;
    export function isModuleExportsAccessExpression(node: Node): node is LiteralLikeElementAccessExpression & {
        expression: Identifier;
    };
    export function getAssignmentDeclarationKind(expr: BinaryExpression | CallExpression): AssignmentDeclarationKind;
    export function isBindableObjectDefinePropertyCall(expr: CallExpression): expr is BindableObjectDefinePropertyCall;
    /** x.y OR x[0] */
    export function isLiteralLikeAccess(node: Node): node is LiteralLikeElementAccessExpression | PropertyAccessExpression;
    /** x[0] OR x['a'] OR x[Symbol.y] */
    export function isLiteralLikeElementAccess(node: Node): node is LiteralLikeElementAccessExpression;
    /** Any series of property and element accesses. */
    export function isBindableStaticAccessExpression(node: Node, excludeThisKeyword?: boolean): node is BindableStaticAccessExpression;
    /** Any series of property and element accesses, ending in a literal element access */
    export function isBindableStaticElementAccessExpression(node: Node, excludeThisKeyword?: boolean): node is BindableStaticElementAccessExpression;
    export function isBindableStaticNameExpression(node: Node, excludeThisKeyword?: boolean): node is BindableStaticNameExpression;
    export function getNameOrArgument(expr: PropertyAccessExpression | LiteralLikeElementAccessExpression): Identifier | PrivateIdentifier | (Expression & (NumericLiteral | StringLiteralLike | WellKnownSymbolExpression));
    /**
     * Does not handle signed numeric names like `a[+0]` - handling those would require handling prefix unary expressions
     * throughout late binding handling as well, which is awkward (but ultimately probably doable if there is demand)
     */
    export function getElementOrPropertyAccessArgumentExpressionOrName(node: AccessExpression): Identifier | PrivateIdentifier | StringLiteralLike | NumericLiteral | ElementAccessExpression | undefined;
    export function getElementOrPropertyAccessName(node: LiteralLikeElementAccessExpression | PropertyAccessExpression): __String;
    export function getElementOrPropertyAccessName(node: AccessExpression): __String | undefined;
    export function getAssignmentDeclarationPropertyAccessKind(lhs: AccessExpression): AssignmentDeclarationKind;
    export function getInitializerOfBinaryExpression(expr: BinaryExpression): Expression;
    export function isPrototypePropertyAssignment(node: Node): boolean;
    export function isSpecialPropertyDeclaration(expr: PropertyAccessExpression | ElementAccessExpression): expr is PropertyAccessExpression | LiteralLikeElementAccessExpression;
    export function setValueDeclaration(symbol: Symbol, node: Declaration): void;
    export function isFunctionSymbol(symbol: Symbol | undefined): boolean | undefined;
    export function importFromModuleSpecifier(node: StringLiteralLike): AnyValidImportOrReExport;
    export function tryGetImportFromModuleSpecifier(node: StringLiteralLike): AnyValidImportOrReExport | undefined;
    export function getExternalModuleName(node: AnyImportOrReExport | ImportTypeNode | ImportCall | ModuleDeclaration): Expression | undefined;
    export function getNamespaceDeclarationNode(node: ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration): ImportEqualsDeclaration | NamespaceImport | NamespaceExport | undefined;
    export function isDefaultImport(node: ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration): boolean;
    export function forEachImportClauseDeclaration<T>(node: ImportClause, action: (declaration: ImportClause | NamespaceImport | ImportSpecifier) => T | undefined): T | undefined;
    export function hasQuestionToken(node: Node): boolean;
    export function isJSDocConstructSignature(node: Node): boolean;
    export function isJSDocTypeAlias(node: Node): node is JSDocTypedefTag | JSDocCallbackTag | JSDocEnumTag;
    export function isTypeAlias(node: Node): node is JSDocTypedefTag | JSDocCallbackTag | JSDocEnumTag | TypeAliasDeclaration;
    export function getSingleInitializerOfVariableStatementOrPropertyDeclaration(node: Node): Expression | undefined;
    export function getSingleVariableOfVariableStatement(node: Node): VariableDeclaration | undefined;
    export function getJSDocCommentsAndTags(hostNode: Node, noCache?: boolean): readonly (JSDoc | JSDocTag)[];
    export function getNextJSDocCommentLocation(node: Node): Node | undefined;
    /** Does the opposite of `getJSDocParameterTags`: given a JSDoc parameter, finds the parameter corresponding to it. */
    export function getParameterSymbolFromJSDoc(node: JSDocParameterTag): Symbol | undefined;
    export function getHostSignatureFromJSDoc(node: Node): SignatureDeclaration | undefined;
    export function getEffectiveJSDocHost(node: Node): Node | undefined;
    /** Use getEffectiveJSDocHost if you additionally need to look for jsdoc on parent nodes, like assignments. */
    export function getJSDocHost(node: Node): HasJSDoc | undefined;
    export function getJSDocRoot(node: Node): JSDoc | undefined;
    export function getTypeParameterFromJsDoc(node: TypeParameterDeclaration & {
        parent: JSDocTemplateTag;
    }): TypeParameterDeclaration | undefined;
    export function hasRestParameter(s: SignatureDeclaration | JSDocSignature): boolean;
    export function isRestParameter(node: ParameterDeclaration | JSDocParameterTag): boolean;
    export function hasTypeArguments(node: Node): node is HasTypeArguments;
    export const enum AssignmentKind {
        None = 0,
        Definite = 1,
        Compound = 2
    }
    export function getAssignmentTargetKind(node: Node): AssignmentKind;
    export function isAssignmentTarget(node: Node): boolean;
    export type NodeWithPossibleHoistedDeclaration = Block | VariableStatement | WithStatement | IfStatement | SwitchStatement | CaseBlock | CaseClause | DefaultClause | LabeledStatement | ForStatement | ForInStatement | ForOfStatement | DoStatement | WhileStatement | TryStatement | CatchClause;
    /**
     * Indicates whether a node could contain a `var` VariableDeclarationList that contributes to
     * the same `var` declaration scope as the node's parent.
     */
    export function isNodeWithPossibleHoistedDeclaration(node: Node): node is NodeWithPossibleHoistedDeclaration;
    export type ValueSignatureDeclaration = FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | AccessorDeclaration | FunctionExpression | ArrowFunction;
    export function isValueSignatureDeclaration(node: Node): node is ValueSignatureDeclaration;
    export function walkUpParenthesizedTypes(node: Node): Node;
    export function walkUpParenthesizedExpressions(node: Node): Node;
    /**
     * Walks up parenthesized types.
     * It returns both the outermost parenthesized type and its parent.
     * If given node is not a parenthesiezd type, undefined is return as the former.
     */
    export function walkUpParenthesizedTypesAndGetParentAndChild(node: Node): [ParenthesizedTypeNode | undefined, Node];
    export function skipParentheses(node: Expression): Expression;
    export function skipParentheses(node: Node): Node;
    export function isDeleteTarget(node: Node): boolean;
    export function isNodeDescendantOf(node: Node, ancestor: Node | undefined): boolean;
    export function isDeclarationName(name: Node): boolean;
    export function getDeclarationFromName(name: Node): Declaration | undefined;
    export function isLiteralComputedPropertyDeclarationName(node: Node): boolean;
    export function isIdentifierName(node: Identifier): boolean;
    export function isAliasSymbolDeclaration(node: Node): boolean;
    export function getAliasDeclarationFromName(node: EntityName): Declaration | undefined;
    export function isAliasableExpression(e: Expression): boolean;
    export function exportAssignmentIsAlias(node: ExportAssignment | BinaryExpression): boolean;
    export function getExportAssignmentExpression(node: ExportAssignment | BinaryExpression): Expression;
    export function getPropertyAssignmentAliasLikeExpression(node: PropertyAssignment | ShorthandPropertyAssignment | PropertyAccessExpression): Expression;
    export function getEffectiveBaseTypeNode(node: ClassLikeDeclaration | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
    export function getClassExtendsHeritageElement(node: ClassLikeDeclaration | InterfaceDeclaration): ExpressionWithTypeArguments | undefined;
    export function getEffectiveImplementsTypeNodes(node: ClassLikeDeclaration): undefined | readonly ExpressionWithTypeArguments[];
    /** Returns the node in an `extends` or `implements` clause of a class or interface. */
    export function getAllSuperTypeNodes(node: Node): readonly TypeNode[];
    export function getInterfaceBaseTypeNodes(node: InterfaceDeclaration): NodeArray<ExpressionWithTypeArguments> | undefined;
    export function getHeritageClause(clauses: NodeArray<HeritageClause> | undefined, kind: SyntaxKind): HeritageClause | undefined;
    export function getAncestor(node: Node | undefined, kind: SyntaxKind): Node | undefined;
    export function isKeyword(token: SyntaxKind): boolean;
    export function isContextualKeyword(token: SyntaxKind): boolean;
    export function isNonContextualKeyword(token: SyntaxKind): boolean;
    export function isFutureReservedKeyword(token: SyntaxKind): boolean;
    export function isStringANonContextualKeyword(name: string): boolean;
    export function isStringAKeyword(name: string): boolean;
    export function isIdentifierANonContextualKeyword({ originalKeywordKind }: Identifier): boolean;
    export function isTrivia(token: SyntaxKind): token is TriviaSyntaxKind;
    export const enum FunctionFlags {
        Normal = 0,
        Generator = 1,
        Async = 2,
        Invalid = 4,
        AsyncGenerator = 3
    }
    export function getFunctionFlags(node: SignatureDeclaration | undefined): FunctionFlags;
    export function isAsyncFunction(node: Node): boolean;
    export function isStringOrNumericLiteralLike(node: Node): node is StringLiteralLike | NumericLiteral;
    export function isSignedNumericLiteral(node: Node): node is PrefixUnaryExpression & {
        operand: NumericLiteral;
    };
    /**
     * A declaration has a dynamic name if all of the following are true:
     *   1. The declaration has a computed property name.
     *   2. The computed name is *not* expressed as a StringLiteral.
     *   3. The computed name is *not* expressed as a NumericLiteral.
     *   4. The computed name is *not* expressed as a PlusToken or MinusToken
     *      immediately followed by a NumericLiteral.
     *   5. The computed name is *not* expressed as `Symbol.<name>`, where `<name>`
     *      is a property of the Symbol constructor that denotes a built-in
     *      Symbol.
     */
    export function hasDynamicName(declaration: Declaration): declaration is DynamicNamedDeclaration | DynamicNamedBinaryExpression;
    export function isDynamicName(name: DeclarationName): boolean;
    /**
     * Checks if the expression is of the form:
     *    Symbol.name
     * where Symbol is literally the word "Symbol", and name is any identifierName
     */
    export function isWellKnownSymbolSyntactically(node: Node): node is WellKnownSymbolExpression;
    export function getPropertyNameForPropertyNameNode(name: PropertyName): __String | undefined;
    export function isPropertyNameLiteral(node: Node): node is PropertyNameLiteral;
    export function getTextOfIdentifierOrLiteral(node: PropertyNameLiteral): string;
    export function getEscapedTextOfIdentifierOrLiteral(node: PropertyNameLiteral): __String;
    export function getPropertyNameForUniqueESSymbol(symbol: Symbol): __String;
    export function getPropertyNameForKnownSymbolName(symbolName: string): __String;
    export function getSymbolNameForPrivateIdentifier(containingClassSymbol: Symbol, description: __String): __String;
    export function isKnownSymbol(symbol: Symbol): boolean;
    /**
     * Includes the word "Symbol" with unicode escapes
     */
    export function isESSymbolIdentifier(node: Node): boolean;
    export function isPushOrUnshiftIdentifier(node: Identifier): boolean;
    export function isParameterDeclaration(node: VariableLikeDeclaration): boolean;
    export function getRootDeclaration(node: Node): Node;
    export function nodeStartsNewLexicalEnvironment(node: Node): boolean;
    export function nodeIsSynthesized(range: TextRange): boolean;
    export function getOriginalSourceFile(sourceFile: SourceFile): SourceFile;
    export const enum Associativity {
        Left = 0,
        Right = 1
    }
    export function getExpressionAssociativity(expression: Expression): Associativity;
    export function getOperatorAssociativity(kind: SyntaxKind, operator: SyntaxKind, hasArguments?: boolean): Associativity;
    export function getExpressionPrecedence(expression: Expression): OperatorPrecedence;
    export function getOperator(expression: Expression): SyntaxKind;
    export const enum OperatorPrecedence {
        Comma = 0,
        Spread = 1,
        Yield = 2,
        Assignment = 3,
        Conditional = 4,
        Coalesce = 4,
        LogicalOR = 5,
        LogicalAND = 6,
        BitwiseOR = 7,
        BitwiseXOR = 8,
        BitwiseAND = 9,
        Equality = 10,
        Relational = 11,
        Shift = 12,
        Additive = 13,
        Multiplicative = 14,
        Exponentiation = 15,
        Unary = 16,
        Update = 17,
        LeftHandSide = 18,
        Member = 19,
        Primary = 20,
        Highest = 20,
        Lowest = 0,
        Invalid = -1
    }
    export function getOperatorPrecedence(nodeKind: SyntaxKind, operatorKind: SyntaxKind, hasArguments?: boolean): OperatorPrecedence;
    export function getBinaryOperatorPrecedence(kind: SyntaxKind): OperatorPrecedence;
    export function getSemanticJsxChildren(children: readonly JsxChild[]): readonly JsxChild[];
    export function createDiagnosticCollection(): DiagnosticCollection;
    /** @internal */
    export function hasInvalidEscape(template: TemplateLiteral): boolean;
    /**
     * Based heavily on the abstract 'Quote'/'QuoteJSONString' operation from ECMA-262 (24.3.2.2),
     * but augmented for a few select characters (e.g. lineSeparator, paragraphSeparator, nextLine)
     * Note that this doesn't actually wrap the input in double quotes.
     */
    export function escapeString(s: string, quoteChar?: CharacterCodes.doubleQuote | CharacterCodes.singleQuote | CharacterCodes.backtick): string;
    export function escapeNonAsciiString(s: string, quoteChar?: CharacterCodes.doubleQuote | CharacterCodes.singleQuote | CharacterCodes.backtick): string;
    export function escapeJsxAttributeString(s: string, quoteChar?: CharacterCodes.doubleQuote | CharacterCodes.singleQuote): string;
    /**
     * Strip off existed surrounding single quotes, double quotes, or backticks from a given string
     *
     * @return non-quoted string
     */
    export function stripQuotes(name: string): string;
    export function isIntrinsicJsxName(name: __String | string): boolean;
    export function getIndentString(level: number): string;
    export function getIndentSize(): number;
    export function createTextWriter(newLine: string): EmitTextWriter;
    export function getTrailingSemicolonDeferringWriter(writer: EmitTextWriter): EmitTextWriter;
    export function hostUsesCaseSensitiveFileNames(host: {
        useCaseSensitiveFileNames?(): boolean;
    }): boolean;
    export function hostGetCanonicalFileName(host: {
        useCaseSensitiveFileNames?(): boolean;
    }): GetCanonicalFileName;
    export interface ResolveModuleNameResolutionHost {
        getCanonicalFileName(p: string): string;
        getCommonSourceDirectory(): string;
        getCurrentDirectory(): string;
    }
    export function getResolvedExternalModuleName(host: ResolveModuleNameResolutionHost, file: SourceFile, referenceFile?: SourceFile): string;
    export function getExternalModuleNameFromDeclaration(host: ResolveModuleNameResolutionHost, resolver: EmitResolver, declaration: ImportEqualsDeclaration | ImportDeclaration | ExportDeclaration | ModuleDeclaration | ImportTypeNode): string | undefined;
    /**
     * Resolves a local path to a path which is absolute to the base of the emit
     */
    export function getExternalModuleNameFromPath(host: ResolveModuleNameResolutionHost, fileName: string, referencePath?: string): string;
    export function getOwnEmitOutputFilePath(fileName: string, host: EmitHost, extension: string): string;
    export function getDeclarationEmitOutputFilePath(fileName: string, host: EmitHost): string;
    export function getDeclarationEmitOutputFilePathWorker(fileName: string, options: CompilerOptions, currentDirectory: string, commonSourceDirectory: string, getCanonicalFileName: GetCanonicalFileName): string;
    export function outFile(options: CompilerOptions): string | undefined;
    /** Returns 'undefined' if and only if 'options.paths' is undefined. */
    export function getPathsBasePath(options: CompilerOptions, host: {
        getCurrentDirectory?(): string;
    }): string | undefined;
    export interface EmitFileNames {
        jsFilePath?: string | undefined;
        sourceMapFilePath?: string | undefined;
        declarationFilePath?: string | undefined;
        declarationMapPath?: string | undefined;
        buildInfoPath?: string | undefined;
    }
    /**
     * Gets the source files that are expected to have an emit output.
     *
     * Originally part of `forEachExpectedEmitFile`, this functionality was extracted to support
     * transformations.
     *
     * @param host An EmitHost.
     * @param targetSourceFile An optional target source file to emit.
     */
    export function getSourceFilesToEmit(host: EmitHost, targetSourceFile?: SourceFile, forceDtsEmit?: boolean): readonly SourceFile[];
    /** Don't call this for `--outFile`, just for `--outDir` or plain emit. `--outFile` needs additional checks. */
    export function sourceFileMayBeEmitted(sourceFile: SourceFile, host: SourceFileMayBeEmittedHost, forceDtsEmit?: boolean): boolean;
    export function getSourceFilePathInNewDir(fileName: string, host: EmitHost, newDirPath: string): string;
    export function getSourceFilePathInNewDirWorker(fileName: string, newDirPath: string, currentDirectory: string, commonSourceDirectory: string, getCanonicalFileName: GetCanonicalFileName): string;
    export function writeFile(host: {
        writeFile: WriteFileCallback;
    }, diagnostics: DiagnosticCollection, fileName: string, data: string, writeByteOrderMark: boolean, sourceFiles?: readonly SourceFile[]): void;
    export function writeFileEnsuringDirectories(path: string, data: string, writeByteOrderMark: boolean, writeFile: (path: string, data: string, writeByteOrderMark: boolean) => void, createDirectory: (path: string) => void, directoryExists: (path: string) => boolean): void;
    export function getLineOfLocalPosition(sourceFile: SourceFile, pos: number): number;
    export function getLineOfLocalPositionFromLineMap(lineMap: readonly number[], pos: number): number;
    export function getFirstConstructorWithBody(node: ClassLikeDeclaration): ConstructorDeclaration & {
        body: FunctionBody;
    } | undefined;
    export function getSetAccessorValueParameter(accessor: SetAccessorDeclaration): ParameterDeclaration | undefined;
    /** Get the type annotation for the value parameter. */
    export function getSetAccessorTypeAnnotationNode(accessor: SetAccessorDeclaration): TypeNode | undefined;
    export function getThisParameter(signature: SignatureDeclaration | JSDocSignature): ParameterDeclaration | undefined;
    export function parameterIsThisKeyword(parameter: ParameterDeclaration): boolean;
    export function isThisIdentifier(node: Node | undefined): boolean;
    export function identifierIsThisKeyword(id: Identifier): boolean;
    export function getAllAccessorDeclarations(declarations: readonly Declaration[], accessor: AccessorDeclaration): AllAccessorDeclarations;
    /**
     * Gets the effective type annotation of a variable, parameter, or property. If the node was
     * parsed in a JavaScript file, gets the type annotation from JSDoc.  Also gets the type of
     * functions only the JSDoc case.
     */
    export function getEffectiveTypeAnnotationNode(node: Node): TypeNode | undefined;
    export function getTypeAnnotationNode(node: Node): TypeNode | undefined;
    /**
     * Gets the effective return type annotation of a signature. If the node was parsed in a
     * JavaScript file, gets the return type annotation from JSDoc.
     */
    export function getEffectiveReturnTypeNode(node: SignatureDeclaration | JSDocSignature): TypeNode | undefined;
    export function getJSDocTypeParameterDeclarations(node: DeclarationWithTypeParameters): readonly TypeParameterDeclaration[];
    /**
     * Gets the effective type annotation of the value parameter of a set accessor. If the node
     * was parsed in a JavaScript file, gets the type annotation from JSDoc.
     */
    export function getEffectiveSetAccessorTypeAnnotationNode(node: SetAccessorDeclaration): TypeNode | undefined;
    export function emitNewLineBeforeLeadingComments(lineMap: readonly number[], writer: EmitTextWriter, node: TextRange, leadingComments: readonly CommentRange[] | undefined): void;
    export function emitNewLineBeforeLeadingCommentsOfPosition(lineMap: readonly number[], writer: EmitTextWriter, pos: number, leadingComments: readonly CommentRange[] | undefined): void;
    export function emitNewLineBeforeLeadingCommentOfPosition(lineMap: readonly number[], writer: EmitTextWriter, pos: number, commentPos: number): void;
    export function emitComments(text: string, lineMap: readonly number[], writer: EmitTextWriter, comments: readonly CommentRange[] | undefined, leadingSeparator: boolean, trailingSeparator: boolean, newLine: string, writeComment: (text: string, lineMap: readonly number[], writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string) => void): void;
    /**
     * Detached comment is a comment at the top of file or function body that is separated from
     * the next statement by space.
     */
    export function emitDetachedComments(text: string, lineMap: readonly number[], writer: EmitTextWriter, writeComment: (text: string, lineMap: readonly number[], writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string) => void, node: TextRange, newLine: string, removeComments: boolean): {
        nodePos: number;
        detachedCommentEndPos: number;
    } | undefined;
    export function writeCommentRange(text: string, lineMap: readonly number[], writer: EmitTextWriter, commentPos: number, commentEnd: number, newLine: string): void;
    export function hasEffectiveModifiers(node: Node): boolean;
    export function hasSyntacticModifiers(node: Node): boolean;
    export function hasEffectiveModifier(node: Node, flags: ModifierFlags): boolean;
    export function hasSyntacticModifier(node: Node, flags: ModifierFlags): boolean;
    export function hasStaticModifier(node: Node): boolean;
    export function hasEffectiveReadonlyModifier(node: Node): boolean;
    export function getSelectedEffectiveModifierFlags(node: Node, flags: ModifierFlags): ModifierFlags;
    export function getSelectedSyntacticModifierFlags(node: Node, flags: ModifierFlags): ModifierFlags;
    /**
     * Gets the effective ModifierFlags for the provided node, including JSDoc modifiers. The modifiers will be cached on the node to improve performance.
     *
     * NOTE: This function may use `parent` pointers.
     */
    export function getEffectiveModifierFlags(node: Node): ModifierFlags;
    export function getEffectiveModifierFlagsAlwaysIncludeJSDoc(node: Node): ModifierFlags;
    /**
     * Gets the ModifierFlags for syntactic modifiers on the provided node. The modifiers will be cached on the node to improve performance.
     *
     * NOTE: This function does not use `parent` pointers and will not include modifiers from JSDoc.
     */
    export function getSyntacticModifierFlags(node: Node): ModifierFlags;
    /**
     * Gets the effective ModifierFlags for the provided node, including JSDoc modifiers. The modifier flags cache on the node is ignored.
     *
     * NOTE: This function may use `parent` pointers.
     */
    export function getEffectiveModifierFlagsNoCache(node: Node): ModifierFlags;
    /**
     * Gets the ModifierFlags for syntactic modifiers on the provided node. The modifier flags cache on the node is ignored.
     *
     * NOTE: This function does not use `parent` pointers and will not include modifiers from JSDoc.
     */
    export function getSyntacticModifierFlagsNoCache(node: Node): ModifierFlags;
    export function modifiersToFlags(modifiers: readonly Modifier[] | undefined): ModifierFlags;
    export function modifierToFlag(token: SyntaxKind): ModifierFlags;
    export function isLogicalOperator(token: SyntaxKind): boolean;
    export function isLogicalOrCoalescingAssignmentOperator(token: SyntaxKind): token is LogicalOrCoalescingAssignmentOperator;
    export function isLogicalOrCoalescingAssignmentExpression(expr: BinaryExpression): expr is AssignmentExpression<Token<LogicalOrCoalescingAssignmentOperator>>;
    export function isAssignmentOperator(token: SyntaxKind): boolean;
    /** Get `C` given `N` if `N` is in the position `class C extends N` where `N` is an ExpressionWithTypeArguments. */
    export function tryGetClassExtendingExpressionWithTypeArguments(node: Node): ClassLikeDeclaration | undefined;
    export interface ClassImplementingOrExtendingExpressionWithTypeArguments {
        readonly class: ClassLikeDeclaration;
        readonly isImplements: boolean;
    }
    export function tryGetClassImplementingOrExtendingExpressionWithTypeArguments(node: Node): ClassImplementingOrExtendingExpressionWithTypeArguments | undefined;
    export function isAssignmentExpression(node: Node, excludeCompoundAssignment: true): node is AssignmentExpression<EqualsToken>;
    export function isAssignmentExpression(node: Node, excludeCompoundAssignment?: false): node is AssignmentExpression<AssignmentOperatorToken>;
    export function isDestructuringAssignment(node: Node): node is DestructuringAssignment;
    export function isExpressionWithTypeArgumentsInClassExtendsClause(node: Node): node is ExpressionWithTypeArguments;
    export function isEntityNameExpression(node: Node): node is EntityNameExpression;
    export function getFirstIdentifier(node: EntityNameOrEntityNameExpression): Identifier;
    export function isDottedName(node: Expression): boolean;
    export function isPropertyAccessEntityNameExpression(node: Node): node is PropertyAccessEntityNameExpression;
    export function tryGetPropertyAccessOrIdentifierToString(expr: Expression): string | undefined;
    export function isPrototypeAccess(node: Node): node is BindableStaticAccessExpression;
    export function isRightSideOfQualifiedNameOrPropertyAccess(node: Node): boolean;
    export function isEmptyObjectLiteral(expression: Node): boolean;
    export function isEmptyArrayLiteral(expression: Node): boolean;
    export function getLocalSymbolForExportDefault(symbol: Symbol): Symbol | undefined;
    /** Return ".ts", ".d.ts", or ".tsx", if that is the extension. */
    export function tryExtractTSExtension(fileName: string): string | undefined;
    /**
     * Converts a string to a base-64 encoded ASCII string.
     */
    export function convertToBase64(input: string): string;
    export function base64encode(host: {
        base64encode?(input: string): string;
    } | undefined, input: string): string;
    export function base64decode(host: {
        base64decode?(input: string): string;
    } | undefined, input: string): string;
    export function readJson(path: string, host: {
        readFile(fileName: string): string | undefined;
    }): object;
    export function directoryProbablyExists(directoryName: string, host: {
        directoryExists?: (directoryName: string) => boolean;
    }): boolean;
    export function getNewLineCharacter(options: CompilerOptions | PrinterOptions, getNewLine?: () => string): string;
    /**
     * Creates a new TextRange from the provided pos and end.
     *
     * @param pos The start position.
     * @param end The end position.
     */
    export function createRange(pos: number, end?: number): TextRange;
    /**
     * Creates a new TextRange from a provided range with a new end position.
     *
     * @param range A TextRange.
     * @param end The new end position.
     */
    export function moveRangeEnd(range: TextRange, end: number): TextRange;
    /**
     * Creates a new TextRange from a provided range with a new start position.
     *
     * @param range A TextRange.
     * @param pos The new Start position.
     */
    export function moveRangePos(range: TextRange, pos: number): TextRange;
    /**
     * Moves the start position of a range past any decorators.
     */
    export function moveRangePastDecorators(node: Node): TextRange;
    /**
     * Moves the start position of a range past any decorators or modifiers.
     */
    export function moveRangePastModifiers(node: Node): TextRange;
    /**
     * Determines whether a TextRange has the same start and end positions.
     *
     * @param range A TextRange.
     */
    export function isCollapsedRange(range: TextRange): boolean;
    /**
     * Creates a new TextRange for a token at the provides start position.
     *
     * @param pos The start position.
     * @param token The token.
     */
    export function createTokenRange(pos: number, token: SyntaxKind): TextRange;
    export function rangeIsOnSingleLine(range: TextRange, sourceFile: SourceFile): boolean;
    export function rangeStartPositionsAreOnSameLine(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
    export function rangeEndPositionsAreOnSameLine(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
    export function rangeStartIsOnSameLineAsRangeEnd(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
    export function rangeEndIsOnSameLineAsRangeStart(range1: TextRange, range2: TextRange, sourceFile: SourceFile): boolean;
    export function getLinesBetweenRangeEndAndRangeStart(range1: TextRange, range2: TextRange, sourceFile: SourceFile, includeSecondRangeComments: boolean): number;
    export function getLinesBetweenRangeEndPositions(range1: TextRange, range2: TextRange, sourceFile: SourceFile): number;
    export function isNodeArrayMultiLine(list: NodeArray<Node>, sourceFile: SourceFile): boolean;
    export function positionsAreOnSameLine(pos1: number, pos2: number, sourceFile: SourceFile): boolean;
    export function getStartPositionOfRange(range: TextRange, sourceFile: SourceFile, includeComments: boolean): number;
    export function getLinesBetweenPositionAndPrecedingNonWhitespaceCharacter(pos: number, stopPos: number, sourceFile: SourceFile, includeComments?: boolean): number;
    export function getLinesBetweenPositionAndNextNonWhitespaceCharacter(pos: number, stopPos: number, sourceFile: SourceFile, includeComments?: boolean): number;
    /**
     * Determines whether a name was originally the declaration name of an enum or namespace
     * declaration.
     */
    export function isDeclarationNameOfEnumOrNamespace(node: Identifier): boolean;
    export function getInitializedVariables(node: VariableDeclarationList): readonly InitializedVariableDeclaration[];
    export function isWatchSet(options: CompilerOptions): boolean | undefined;
    export function closeFileWatcher(watcher: FileWatcher): void;
    export function getCheckFlags(symbol: Symbol): CheckFlags;
    export function getDeclarationModifierFlagsFromSymbol(s: Symbol): ModifierFlags;
    export function skipAlias(symbol: Symbol, checker: TypeChecker): Symbol;
    /** See comment on `declareModuleMember` in `binder.ts`. */
    export function getCombinedLocalAndExportSymbolFlags(symbol: Symbol): SymbolFlags;
    export function isWriteOnlyAccess(node: Node): boolean;
    export function isWriteAccess(node: Node): boolean;
    export function compareDataObjects(dst: any, src: any): boolean;
    /**
     * clears already present map by calling onDeleteExistingValue callback before deleting that key/value
     */
    export function clearMap<T>(map: {
        forEach: ESMap<string, T>["forEach"];
        clear: ESMap<string, T>["clear"];
    }, onDeleteValue: (valueInMap: T, key: string) => void): void;
    export interface MutateMapSkippingNewValuesOptions<T, U> {
        onDeleteValue(existingValue: T, key: string): void;
        /**
         * If present this is called with the key when there is value for that key both in new map as well as existing map provided
         * Caller can then decide to update or remove this key.
         * If the key is removed, caller will get callback of createNewValue for that key.
         * If this callback is not provided, the value of such keys is not updated.
         */
        onExistingValue?(existingValue: T, valueInNewMap: U, key: string): void;
    }
    /**
     * Mutates the map with newMap such that keys in map will be same as newMap.
     */
    export function mutateMapSkippingNewValues<T, U>(map: ESMap<string, T>, newMap: ReadonlyESMap<string, U>, options: MutateMapSkippingNewValuesOptions<T, U>): void;
    export interface MutateMapOptions<T, U> extends MutateMapSkippingNewValuesOptions<T, U> {
        createNewValue(key: string, valueInNewMap: U): T;
    }
    /**
     * Mutates the map with newMap such that keys in map will be same as newMap.
     */
    export function mutateMap<T, U>(map: ESMap<string, T>, newMap: ReadonlyESMap<string, U>, options: MutateMapOptions<T, U>): void;
    export function isAbstractConstructorSymbol(symbol: Symbol): boolean;
    export function getClassLikeDeclarationOfSymbol(symbol: Symbol): ClassLikeDeclaration | undefined;
    export function getObjectFlags(type: Type): ObjectFlags;
    export function typeHasCallOrConstructSignatures(type: Type, checker: TypeChecker): boolean;
    export function forSomeAncestorDirectory(directory: string, callback: (directory: string) => boolean): boolean;
    export function isUMDExportSymbol(symbol: Symbol | undefined): boolean;
    export function showModuleSpecifier({ moduleSpecifier }: ImportDeclaration): string;
    export function getLastChild(node: Node): Node | undefined;
    /** Add a value to a set, and return true if it wasn't already present. */
    export function addToSeen(seen: ESMap<string, true>, key: string | number): boolean;
    export function addToSeen<T>(seen: ESMap<string, T>, key: string | number, value: T): boolean;
    export function isObjectTypeDeclaration(node: Node): node is ObjectTypeDeclaration;
    export function isTypeNodeKind(kind: SyntaxKind): kind is TypeNodeSyntaxKind;
    export function isAccessExpression(node: Node): node is AccessExpression;
    export function getNameOfAccessExpression(node: AccessExpression): Expression | PrivateIdentifier;
    export function isBundleFileTextLike(section: BundleFileSection): section is BundleFileTextLike;
    export function isNamedImportsOrExports(node: Node): node is NamedImportsOrExports;
    export function getLeftmostAccessExpression(expr: Expression): Expression;
    export function getLeftmostExpression(node: Expression, stopAtCallExpressions: boolean): Expression;
    export interface ObjectAllocator {
        getNodeConstructor(): new (kind: SyntaxKind, pos?: number, end?: number) => Node;
        getTokenConstructor(): new <TKind extends SyntaxKind>(kind: TKind, pos?: number, end?: number) => Token<TKind>;
        getIdentifierConstructor(): new (kind: SyntaxKind.Identifier, pos?: number, end?: number) => Identifier;
        getPrivateIdentifierConstructor(): new (kind: SyntaxKind.PrivateIdentifier, pos?: number, end?: number) => PrivateIdentifier;
        getSourceFileConstructor(): new (kind: SyntaxKind.SourceFile, pos?: number, end?: number) => SourceFile;
        getSymbolConstructor(): new (flags: SymbolFlags, name: __String) => Symbol;
        getTypeConstructor(): new (checker: TypeChecker, flags: TypeFlags) => Type;
        getSignatureConstructor(): new (checker: TypeChecker, flags: SignatureFlags) => Signature;
        getSourceMapSourceConstructor(): new (fileName: string, text: string, skipTrivia?: (pos: number) => number) => SourceMapSource;
    }
    export let objectAllocator: ObjectAllocator;
    export function setObjectAllocator(alloc: ObjectAllocator): void;
    export function formatStringFromArgs(text: string, args: ArrayLike<string | number>, baseIndex?: number): string;
    export let localizedDiagnosticMessages: MapLike<string> | undefined;
    export function setLocalizedDiagnosticMessages(messages: typeof localizedDiagnosticMessages): void;
    export function getLocaleSpecificMessage(message: DiagnosticMessage): string;
    export function createDetachedDiagnostic(fileName: string, start: number, length: number, message: DiagnosticMessage, ...args: (string | number | undefined)[]): DiagnosticWithDetachedLocation;
    export function attachFileToDiagnostics(diagnostics: DiagnosticWithDetachedLocation[], file: SourceFile): DiagnosticWithLocation[];
    export function createFileDiagnostic(file: SourceFile, start: number, length: number, message: DiagnosticMessage, ...args: (string | number | undefined)[]): DiagnosticWithLocation;
    export function formatMessage(_dummy: any, message: DiagnosticMessage, ...args: (string | number | undefined)[]): string;
    export function createCompilerDiagnostic(message: DiagnosticMessage, ...args: (string | number | undefined)[]): Diagnostic;
    export function createCompilerDiagnosticFromMessageChain(chain: DiagnosticMessageChain, relatedInformation?: DiagnosticRelatedInformation[]): Diagnostic;
    export function chainDiagnosticMessages(details: DiagnosticMessageChain | DiagnosticMessageChain[] | undefined, message: DiagnosticMessage, ...args: (string | number | undefined)[]): DiagnosticMessageChain;
    export function concatenateDiagnosticMessageChains(headChain: DiagnosticMessageChain, tailChain: DiagnosticMessageChain): void;
    export function compareDiagnostics(d1: Diagnostic, d2: Diagnostic): Comparison;
    export function compareDiagnosticsSkipRelatedInformation(d1: Diagnostic, d2: Diagnostic): Comparison;
    export function getLanguageVariant(scriptKind: ScriptKind): LanguageVariant;
    export function getEmitScriptTarget(compilerOptions: CompilerOptions): ScriptTarget;
    export function getEmitModuleKind(compilerOptions: {
        module?: CompilerOptions["module"];
        target?: CompilerOptions["target"];
    }): ModuleKind;
    export function getEmitModuleResolutionKind(compilerOptions: CompilerOptions): ModuleResolutionKind;
    export function hasJsonModuleEmitEnabled(options: CompilerOptions): boolean;
    export function unreachableCodeIsError(options: CompilerOptions): boolean;
    export function unusedLabelIsError(options: CompilerOptions): boolean;
    export function getAreDeclarationMapsEnabled(options: CompilerOptions): boolean;
    export function getAllowSyntheticDefaultImports(compilerOptions: CompilerOptions): boolean;
    export function getEmitDeclarations(compilerOptions: CompilerOptions): boolean;
    export function shouldPreserveConstEnums(compilerOptions: CompilerOptions): boolean;
    export function isIncrementalCompilation(options: CompilerOptions): boolean;
    export type StrictOptionName = "noImplicitAny" | "noImplicitThis" | "strictNullChecks" | "strictFunctionTypes" | "strictBindCallApply" | "strictPropertyInitialization" | "alwaysStrict";
    export function getStrictOptionValue(compilerOptions: CompilerOptions, flag: StrictOptionName): boolean;
    export function getAllowJSCompilerOption(compilerOptions: CompilerOptions): boolean;
    export function compilerOptionsAffectSemanticDiagnostics(newOptions: CompilerOptions, oldOptions: CompilerOptions): boolean;
    export function compilerOptionsAffectEmit(newOptions: CompilerOptions, oldOptions: CompilerOptions): boolean;
    export function getCompilerOptionValue(options: CompilerOptions, option: CommandLineOption): unknown;
    export function getJSXTransformEnabled(options: CompilerOptions): boolean;
    export function getJSXImplicitImportBase(compilerOptions: CompilerOptions, file?: SourceFile): string | undefined;
    export function getJSXRuntimeImport(base: string | undefined, options: CompilerOptions): string | undefined;
    export function hasZeroOrOneAsteriskCharacter(str: string): boolean;
    export interface SymlinkedDirectory {
        real: string;
        realPath: Path;
    }
    export interface SymlinkCache {
        /** Gets a map from symlink to realpath. Keys have trailing directory separators. */
        getSymlinkedDirectories(): ReadonlyESMap<Path, SymlinkedDirectory | false> | undefined;
        /** Gets a map from realpath to symlinks. Keys have trailing directory separators. */
        getSymlinkedDirectoriesByRealpath(): MultiMap<Path, string> | undefined;
        /** Gets a map from symlink to realpath */
        getSymlinkedFiles(): ReadonlyESMap<Path, string> | undefined;
        setSymlinkedDirectory(symlink: string, real: SymlinkedDirectory | false): void;
        setSymlinkedFile(symlinkPath: Path, real: string): void;
    }
    export function createSymlinkCache(cwd: string, getCanonicalFileName: GetCanonicalFileName): SymlinkCache;
    export function discoverProbableSymlinks(files: readonly SourceFile[], getCanonicalFileName: GetCanonicalFileName, cwd: string): SymlinkCache;
    export function tryRemoveDirectoryPrefix(path: string, dirPath: string, getCanonicalFileName: GetCanonicalFileName): string | undefined;
    export function regExpEscape(text: string): string;
    export const commonPackageFolders: readonly string[];
    export function getRegularExpressionForWildcard(specs: readonly string[] | undefined, basePath: string, usage: "files" | "directories" | "exclude"): string | undefined;
    export function getRegularExpressionsForWildcards(specs: readonly string[] | undefined, basePath: string, usage: "files" | "directories" | "exclude"): readonly string[] | undefined;
    /**
     * An "includes" path "foo" is implicitly a glob "foo/** /*" (without the space) if its last component has no extension,
     * and does not contain any glob characters itself.
     */
    export function isImplicitGlob(lastPathComponent: string): boolean;
    export function getPatternFromSpec(spec: string, basePath: string, usage: "files" | "directories" | "exclude"): string | undefined;
    export interface FileSystemEntries {
        readonly files: readonly string[];
        readonly directories: readonly string[];
    }
    export interface FileMatcherPatterns {
        /** One pattern for each "include" spec. */
        includeFilePatterns: readonly string[] | undefined;
        /** One pattern matching one of any of the "include" specs. */
        includeFilePattern: string | undefined;
        includeDirectoryPattern: string | undefined;
        excludePattern: string | undefined;
        basePaths: readonly string[];
    }
    /** @param path directory of the tsconfig.json */
    export function getFileMatcherPatterns(path: string, excludes: readonly string[] | undefined, includes: readonly string[] | undefined, useCaseSensitiveFileNames: boolean, currentDirectory: string): FileMatcherPatterns;
    export function getRegexFromPattern(pattern: string, useCaseSensitiveFileNames: boolean): RegExp;
    /** @param path directory of the tsconfig.json */
    export function matchFiles(path: string, extensions: readonly string[] | undefined, excludes: readonly string[] | undefined, includes: readonly string[] | undefined, useCaseSensitiveFileNames: boolean, currentDirectory: string, depth: number | undefined, getFileSystemEntries: (path: string) => FileSystemEntries, realpath: (path: string) => string): string[];
    export function ensureScriptKind(fileName: string, scriptKind: ScriptKind | undefined): ScriptKind;
    export function getScriptKindFromFileName(fileName: string): ScriptKind;
    /**
     *  List of supported extensions in order of file resolution precedence.
     */
    export const supportedTSExtensions: readonly Extension[];
    export const supportedTSExtensionsWithJson: readonly Extension[];
    /** Must have ".d.ts" first because if ".ts" goes first, that will be detected as the extension instead of ".d.ts". */
    export const supportedTSExtensionsForExtractExtension: readonly Extension[];
    export const supportedJSExtensions: readonly Extension[];
    export const supportedJSAndJsonExtensions: readonly Extension[];
    export function getSupportedExtensions(options?: CompilerOptions): readonly Extension[];
    export function getSupportedExtensions(options?: CompilerOptions, extraFileExtensions?: readonly FileExtensionInfo[]): readonly string[];
    export function getSuppoertedExtensionsWithJsonIfResolveJsonModule(options: CompilerOptions | undefined, supportedExtensions: readonly string[]): readonly string[];
    export function hasJSFileExtension(fileName: string): boolean;
    export function hasTSFileExtension(fileName: string): boolean;
    export function isSupportedSourceFileName(fileName: string, compilerOptions?: CompilerOptions, extraFileExtensions?: readonly FileExtensionInfo[]): boolean;
    export function compareNumberOfDirectorySeparators(path1: string, path2: string): Comparison;
    /**
     * Extension boundaries by priority. Lower numbers indicate higher priorities, and are
     * aligned to the offset of the highest priority extension in the
     * allSupportedExtensions array.
     */
    export const enum ExtensionPriority {
        TypeScriptFiles = 0,
        DeclarationAndJavaScriptFiles = 2,
        Highest = 0,
        Lowest = 2
    }
    export function getExtensionPriority(path: string, supportedExtensions: readonly string[]): ExtensionPriority;
    /**
     * Adjusts an extension priority to be the highest priority within the same range.
     */
    export function adjustExtensionPriority(extensionPriority: ExtensionPriority, supportedExtensions: readonly string[]): ExtensionPriority;
    /**
     * Gets the next lowest extension priority for a given priority.
     */
    export function getNextLowestExtensionPriority(extensionPriority: ExtensionPriority, supportedExtensions: readonly string[]): ExtensionPriority;
    export function removeFileExtension(path: string): string;
    export function tryRemoveExtension(path: string, extension: string): string | undefined;
    export function removeExtension(path: string, extension: string): string;
    export function changeExtension<T extends string | Path>(path: T, newExtension: string): T;
    export function tryParsePattern(pattern: string): Pattern | undefined;
    export function positionIsSynthesized(pos: number): boolean;
    /** True if an extension is one of the supported TypeScript extensions. */
    export function extensionIsTS(ext: Extension): boolean;
    export function resolutionExtensionIsTSOrJson(ext: Extension): boolean;
    /**
     * Gets the extension from a path.
     * Path must have a valid extension.
     */
    export function extensionFromPath(path: string): Extension;
    export function isAnySupportedFileExtension(path: string): boolean;
    export function tryGetExtensionFromPath(path: string): Extension | undefined;
    export function isCheckJsEnabledForFile(sourceFile: SourceFile, compilerOptions: CompilerOptions): boolean | undefined;
    export const emptyFileSystemEntries: FileSystemEntries;
    /**
     * patternStrings contains both pattern strings (containing "*") and regular strings.
     * Return an exact match if possible, or a pattern match, or undefined.
     * (These are verified by verifyCompilerOptions to have 0 or 1 "*" characters.)
     */
    export function matchPatternOrExact(patternStrings: readonly string[], candidate: string): string | Pattern | undefined;
    export type Mutable<T extends object> = {
        -readonly [K in keyof T]: T[K];
    };
    export function sliceAfter<T>(arr: readonly T[], value: T): readonly T[];
    export function addRelatedInfo<T extends Diagnostic>(diagnostic: T, ...relatedInformation: DiagnosticRelatedInformation[]): T;
    export function minAndMax<T>(arr: readonly T[], getValue: (value: T) => number): {
        readonly min: number;
        readonly max: number;
    };
    /** @deprecated Use `ReadonlySet<TNode>` instead. */
    export type ReadonlyNodeSet<TNode extends Node> = ReadonlySet<TNode>;
    /** @deprecated Use `Set<TNode>` instead. */
    export type NodeSet<TNode extends Node> = Set<TNode>;
    /** @deprecated Use `ReadonlyMap<TNode, TValue>` instead. */
    export type ReadonlyNodeMap<TNode extends Node, TValue> = ReadonlyESMap<TNode, TValue>;
    /** @deprecated Use `Map<TNode, TValue>` instead. */
    export type NodeMap<TNode extends Node, TValue> = ESMap<TNode, TValue>;
    export function rangeOfNode(node: Node): TextRange;
    export function rangeOfTypeParameters(sourceFile: SourceFile, typeParameters: NodeArray<TypeParameterDeclaration>): TextRange;
    export interface HostWithIsSourceOfProjectReferenceRedirect {
        isSourceOfProjectReferenceRedirect(fileName: string): boolean;
    }
    export function skipTypeChecking(sourceFile: SourceFile, options: CompilerOptions, host: HostWithIsSourceOfProjectReferenceRedirect): boolean;
    export function isJsonEqual(a: unknown, b: unknown): boolean;
    /**
     * Converts a bigint literal string, e.g. `0x1234n`,
     * to its decimal string representation, e.g. `4660`.
     */
    export function parsePseudoBigInt(stringValue: string): string;
    export function pseudoBigIntToString({ negative, base10Value }: PseudoBigInt): string;
    export function isValidTypeOnlyAliasUseSite(useSite: Node): boolean;
    export function typeOnlyDeclarationIsExport(typeOnlyDeclaration: Node): boolean;
    export function isIdentifierTypeReference(node: Node): node is TypeReferenceNode & {
        typeName: Identifier;
    };
    export function arrayIsHomogeneous<T>(array: readonly T[], comparer?: EqualityComparer<T>): boolean;
    /**
     * Bypasses immutability and directly sets the `pos` property of a `TextRange` or `Node`.
     */
    export function setTextRangePos<T extends ReadonlyTextRange>(range: T, pos: number): T;
    /**
     * Bypasses immutability and directly sets the `end` property of a `TextRange` or `Node`.
     */
    export function setTextRangeEnd<T extends ReadonlyTextRange>(range: T, end: number): T;
    /**
     * Bypasses immutability and directly sets the `pos` and `end` properties of a `TextRange` or `Node`.
     */
    export function setTextRangePosEnd<T extends ReadonlyTextRange>(range: T, pos: number, end: number): T;
    /**
     * Bypasses immutability and directly sets the `pos` and `end` properties of a `TextRange` or `Node` from the
     * provided position and width.
     */
    export function setTextRangePosWidth<T extends ReadonlyTextRange>(range: T, pos: number, width: number): T;
    /**
     * Bypasses immutability and directly sets the `flags` property of a `Node`.
     */
    export function setNodeFlags<T extends Node>(node: T, newFlags: NodeFlags): T;
    export function setNodeFlags<T extends Node>(node: T | undefined, newFlags: NodeFlags): T | undefined;
    /**
     * Bypasses immutability and directly sets the `parent` property of a `Node`.
     */
    export function setParent<T extends Node>(child: T, parent: T["parent"] | undefined): T;
    export function setParent<T extends Node>(child: T | undefined, parent: T["parent"] | undefined): T | undefined;
    /**
     * Bypasses immutability and directly sets the `parent` property of each `Node` in an array of nodes, if is not already set.
     */
    export function setEachParent<T extends readonly Node[]>(children: T, parent: T[number]["parent"]): T;
    export function setEachParent<T extends readonly Node[]>(children: T | undefined, parent: T[number]["parent"]): T | undefined;
    /**
     * Bypasses immutability and directly sets the `parent` property of each `Node` recursively.
     * @param rootNode The root node from which to start the recursion.
     * @param incremental When `true`, only recursively descends through nodes whose `parent` pointers are incorrect.
     * This allows us to quickly bail out of setting `parent` for subtrees during incremental parsing.
     */
    export function setParentRecursive<T extends Node>(rootNode: T, incremental: boolean): T;
    export function setParentRecursive<T extends Node>(rootNode: T | undefined, incremental: boolean): T | undefined;
    /**
     * Determines whether the provided node is an ArrayLiteralExpression that contains no missing elements.
     */
    export function isPackedArrayLiteral(node: Expression): boolean;
    /**
     * Indicates whether the result of an `Expression` will be unused.
     *
     * NOTE: This requires a node with a valid `parent` pointer.
     */
    export function expressionResultIsUnused(node: Expression): boolean;
    export function containsIgnoredPath(path: string): boolean;
    export {};
}
declare namespace ts {
    /**
     * A `BaseNodeFactory` is an abstraction over an `ObjectAllocator` that handles caching `Node` constructors
     * and allocating `Node` instances based on a set of predefined types.
     */
    interface BaseNodeFactory {
        createBaseSourceFileNode(kind: SyntaxKind): Node;
        createBaseIdentifierNode(kind: SyntaxKind): Node;
        createBasePrivateIdentifierNode(kind: SyntaxKind): Node;
        createBaseTokenNode(kind: SyntaxKind): Node;
        createBaseNode(kind: SyntaxKind): Node;
    }
    /**
     * Creates a `BaseNodeFactory` which can be used to create `Node` instances from the constructors provided by the object allocator.
     */
    function createBaseNodeFactory(): BaseNodeFactory;
}
declare namespace ts {
    function createParenthesizerRules(factory: NodeFactory): ParenthesizerRules;
    const nullParenthesizerRules: ParenthesizerRules;
}
declare namespace ts {
    function createNodeConverters(factory: NodeFactory): NodeConverters;
    const nullNodeConverters: NodeConverters;
}
declare namespace ts {
    const enum NodeFactoryFlags {
        None = 0,
        NoParenthesizerRules = 1,
        NoNodeConverters = 2,
        NoIndentationOnFreshPropertyAccess = 4,
        NoOriginalNode = 8
    }
    /**
     * Creates a `NodeFactory` that can be used to create and update a syntax tree.
     * @param flags Flags that control factory behavior.
     * @param baseFactory A `BaseNodeFactory` used to create the base `Node` objects.
     */
    function createNodeFactory(flags: NodeFactoryFlags, baseFactory: BaseNodeFactory): NodeFactory;
    /**
     * Gets the transform flags to exclude when unioning the transform flags of a subtree.
     */
    function getTransformFlagsSubtreeExclusions(kind: SyntaxKind): TransformFlags;
    const factory: NodeFactory;
    function createUnparsedSourceFile(text: string): UnparsedSource;
    function createUnparsedSourceFile(inputFile: InputFiles, type: "js" | "dts", stripInternal?: boolean): UnparsedSource;
    function createUnparsedSourceFile(text: string, mapPath: string | undefined, map: string | undefined): UnparsedSource;
    function createInputFiles(javascriptText: string, declarationText: string): InputFiles;
    function createInputFiles(readFileText: (path: string) => string | undefined, javascriptPath: string, javascriptMapPath: string | undefined, declarationPath: string, declarationMapPath: string | undefined, buildInfoPath: string | undefined): InputFiles;
    function createInputFiles(javascriptText: string, declarationText: string, javascriptMapPath: string | undefined, javascriptMapText: string | undefined, declarationMapPath: string | undefined, declarationMapText: string | undefined): InputFiles;
    function createInputFiles(javascriptText: string, declarationText: string, javascriptMapPath: string | undefined, javascriptMapText: string | undefined, declarationMapPath: string | undefined, declarationMapText: string | undefined, javascriptPath: string | undefined, declarationPath: string | undefined, buildInfoPath?: string | undefined, buildInfo?: BuildInfo, oldFileOfCurrentEmit?: boolean): InputFiles;
    /**
     * Create an external source map source file reference
     */
    function createSourceMapSource(fileName: string, text: string, skipTrivia?: (pos: number) => number): SourceMapSource;
    function setOriginalNode<T extends Node>(node: T, original: Node | undefined): T;
}
declare namespace ts {
    /**
     * Associates a node with the current transformation, initializing
     * various transient transformation properties.
     * @internal
     */
    function getOrCreateEmitNode(node: Node): EmitNode;
    /**
     * Clears any `EmitNode` entries from parse-tree nodes.
     * @param sourceFile A source file.
     */
    function disposeEmitNodes(sourceFile: SourceFile | undefined): void;
    /**
     * Sets `EmitFlags.NoComments` on a node and removes any leading and trailing synthetic comments.
     * @internal
     */
    function removeAllComments<T extends Node>(node: T): T;
    /**
     * Sets flags that control emit behavior of a node.
     */
    function setEmitFlags<T extends Node>(node: T, emitFlags: EmitFlags): T;
    /**
     * Sets flags that control emit behavior of a node.
     */
    function addEmitFlags<T extends Node>(node: T, emitFlags: EmitFlags): T;
    /**
     * Gets a custom text range to use when emitting source maps.
     */
    function getSourceMapRange(node: Node): SourceMapRange;
    /**
     * Sets a custom text range to use when emitting source maps.
     */
    function setSourceMapRange<T extends Node>(node: T, range: SourceMapRange | undefined): T;
    /**
     * Gets the TextRange to use for source maps for a token of a node.
     */
    function getTokenSourceMapRange(node: Node, token: SyntaxKind): SourceMapRange | undefined;
    /**
     * Sets the TextRange to use for source maps for a token of a node.
     */
    function setTokenSourceMapRange<T extends Node>(node: T, token: SyntaxKind, range: SourceMapRange | undefined): T;
    /**
     * Gets a custom text range to use when emitting comments.
     */
    function getStartsOnNewLine(node: Node): boolean | undefined;
    /**
     * Sets a custom text range to use when emitting comments.
     */
    function setStartsOnNewLine<T extends Node>(node: T, newLine: boolean): T;
    /**
     * Gets a custom text range to use when emitting comments.
     */
    function getCommentRange(node: Node): TextRange;
    /**
     * Sets a custom text range to use when emitting comments.
     */
    function setCommentRange<T extends Node>(node: T, range: TextRange): T;
    function getSyntheticLeadingComments(node: Node): SynthesizedComment[] | undefined;
    function setSyntheticLeadingComments<T extends Node>(node: T, comments: SynthesizedComment[] | undefined): T;
    function addSyntheticLeadingComment<T extends Node>(node: T, kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia, text: string, hasTrailingNewLine?: boolean): T;
    function getSyntheticTrailingComments(node: Node): SynthesizedComment[] | undefined;
    function setSyntheticTrailingComments<T extends Node>(node: T, comments: SynthesizedComment[] | undefined): T;
    function addSyntheticTrailingComment<T extends Node>(node: T, kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia, text: string, hasTrailingNewLine?: boolean): T;
    function moveSyntheticComments<T extends Node>(node: T, original: Node): T;
    /**
     * Gets the constant value to emit for an expression representing an enum.
     */
    function getConstantValue(node: AccessExpression): string | number | undefined;
    /**
     * Sets the constant value to emit for an expression.
     */
    function setConstantValue(node: AccessExpression, value: string | number): AccessExpression;
    /**
     * Adds an EmitHelper to a node.
     */
    function addEmitHelper<T extends Node>(node: T, helper: EmitHelper): T;
    /**
     * Add EmitHelpers to a node.
     */
    function addEmitHelpers<T extends Node>(node: T, helpers: EmitHelper[] | undefined): T;
    /**
     * Removes an EmitHelper from a node.
     */
    function removeEmitHelper(node: Node, helper: EmitHelper): boolean;
    /**
     * Gets the EmitHelpers of a node.
     */
    function getEmitHelpers(node: Node): EmitHelper[] | undefined;
    /**
     * Moves matching emit helpers from a source node to a target node.
     */
    function moveEmitHelpers(source: Node, target: Node, predicate: (helper: EmitHelper) => boolean): void;
    function ignoreSourceNewlines<T extends Node>(node: T): T;
}
declare namespace ts {
    interface EmitHelperFactory {
        getUnscopedHelperName(name: string): Identifier;
        createDecorateHelper(decoratorExpressions: readonly Expression[], target: Expression, memberName?: Expression, descriptor?: Expression): Expression;
        createMetadataHelper(metadataKey: string, metadataValue: Expression): Expression;
        createParamHelper(expression: Expression, parameterOffset: number): Expression;
        createAssignHelper(attributesSegments: readonly Expression[]): Expression;
        createAwaitHelper(expression: Expression): Expression;
        createAsyncGeneratorHelper(generatorFunc: FunctionExpression, hasLexicalThis: boolean): Expression;
        createAsyncDelegatorHelper(expression: Expression): Expression;
        createAsyncValuesHelper(expression: Expression): Expression;
        createRestHelper(value: Expression, elements: readonly BindingOrAssignmentElement[], computedTempVariables: readonly Expression[] | undefined, location: TextRange): Expression;
        createAwaiterHelper(hasLexicalThis: boolean, hasLexicalArguments: boolean, promiseConstructor: EntityName | Expression | undefined, body: Block): Expression;
        createExtendsHelper(name: Identifier): Expression;
        createTemplateObjectHelper(cooked: ArrayLiteralExpression, raw: ArrayLiteralExpression): Expression;
        createSpreadArrayHelper(to: Expression, from: Expression): Expression;
        createValuesHelper(expression: Expression): Expression;
        createReadHelper(iteratorRecord: Expression, count: number | undefined): Expression;
        createGeneratorHelper(body: FunctionExpression): Expression;
        createCreateBindingHelper(module: Expression, inputName: Expression, outputName: Expression | undefined): Expression;
        createImportStarHelper(expression: Expression): Expression;
        createImportStarCallbackHelper(): Expression;
        createImportDefaultHelper(expression: Expression): Expression;
        createExportStarHelper(moduleExpression: Expression, exportsExpression?: Expression): Expression;
        createClassPrivateFieldGetHelper(receiver: Expression, privateField: Identifier): Expression;
        createClassPrivateFieldSetHelper(receiver: Expression, privateField: Identifier, value: Expression): Expression;
    }
    function createEmitHelperFactory(context: TransformationContext): EmitHelperFactory;
    function compareEmitHelpers(x: EmitHelper, y: EmitHelper): Comparison;
    /**
     * @param input Template string input strings
     * @param args Names which need to be made file-level unique
     */
    function helperString(input: TemplateStringsArray, ...args: string[]): (uniqueName: EmitHelperUniqueNameCallback) => string;
    const decorateHelper: UnscopedEmitHelper;
    const metadataHelper: UnscopedEmitHelper;
    const paramHelper: UnscopedEmitHelper;
    const assignHelper: UnscopedEmitHelper;
    const awaitHelper: UnscopedEmitHelper;
    const asyncGeneratorHelper: UnscopedEmitHelper;
    const asyncDelegator: UnscopedEmitHelper;
    const asyncValues: UnscopedEmitHelper;
    const restHelper: UnscopedEmitHelper;
    const awaiterHelper: UnscopedEmitHelper;
    const extendsHelper: UnscopedEmitHelper;
    const templateObjectHelper: UnscopedEmitHelper;
    const readHelper: UnscopedEmitHelper;
    const spreadArrayHelper: UnscopedEmitHelper;
    const valuesHelper: UnscopedEmitHelper;
    const generatorHelper: UnscopedEmitHelper;
    const createBindingHelper: UnscopedEmitHelper;
    const setModuleDefaultHelper: UnscopedEmitHelper;
    const importStarHelper: UnscopedEmitHelper;
    const importDefaultHelper: UnscopedEmitHelper;
    const exportStarHelper: UnscopedEmitHelper;
    const classPrivateFieldGetHelper: UnscopedEmitHelper;
    const classPrivateFieldSetHelper: UnscopedEmitHelper;
    function getAllUnscopedEmitHelpers(): ReadonlyESMap<string, UnscopedEmitHelper>;
    const asyncSuperHelper: EmitHelper;
    const advancedAsyncSuperHelper: EmitHelper;
    function isCallToHelper(firstSegment: Expression, helperName: __String): boolean | 0;
}
declare namespace ts {
    function isNumericLiteral(node: Node): node is NumericLiteral;
    function isBigIntLiteral(node: Node): node is BigIntLiteral;
    function isStringLiteral(node: Node): node is StringLiteral;
    function isJsxText(node: Node): node is JsxText;
    function isRegularExpressionLiteral(node: Node): node is RegularExpressionLiteral;
    function isNoSubstitutionTemplateLiteral(node: Node): node is NoSubstitutionTemplateLiteral;
    function isTemplateHead(node: Node): node is TemplateHead;
    function isTemplateMiddle(node: Node): node is TemplateMiddle;
    function isTemplateTail(node: Node): node is TemplateTail;
    function isIdentifier(node: Node): node is Identifier;
    function isQualifiedName(node: Node): node is QualifiedName;
    function isComputedPropertyName(node: Node): node is ComputedPropertyName;
    function isPrivateIdentifier(node: Node): node is PrivateIdentifier;
    function isSuperKeyword(node: Node): node is Token<SyntaxKind.SuperKeyword>;
    function isImportKeyword(node: Node): node is Token<SyntaxKind.ImportKeyword>;
    function isCommaToken(node: Node): node is Token<SyntaxKind.CommaToken>;
    function isQuestionToken(node: Node): node is Token<SyntaxKind.QuestionToken>;
    function isExclamationToken(node: Node): node is Token<SyntaxKind.ExclamationToken>;
    function isTypeParameterDeclaration(node: Node): node is TypeParameterDeclaration;
    function isParameter(node: Node): node is ParameterDeclaration;
    function isDecorator(node: Node): node is Decorator;
    function isPropertySignature(node: Node): node is PropertySignature;
    function isPropertyDeclaration(node: Node): node is PropertyDeclaration;
    function isMethodSignature(node: Node): node is MethodSignature;
    function isMethodDeclaration(node: Node): node is MethodDeclaration;
    function isConstructorDeclaration(node: Node): node is ConstructorDeclaration;
    function isGetAccessorDeclaration(node: Node): node is GetAccessorDeclaration;
    function isSetAccessorDeclaration(node: Node): node is SetAccessorDeclaration;
    function isCallSignatureDeclaration(node: Node): node is CallSignatureDeclaration;
    function isConstructSignatureDeclaration(node: Node): node is ConstructSignatureDeclaration;
    function isIndexSignatureDeclaration(node: Node): node is IndexSignatureDeclaration;
    function isTypePredicateNode(node: Node): node is TypePredicateNode;
    function isTypeReferenceNode(node: Node): node is TypeReferenceNode;
    function isFunctionTypeNode(node: Node): node is FunctionTypeNode;
    function isConstructorTypeNode(node: Node): node is ConstructorTypeNode;
    function isTypeQueryNode(node: Node): node is TypeQueryNode;
    function isTypeLiteralNode(node: Node): node is TypeLiteralNode;
    function isArrayTypeNode(node: Node): node is ArrayTypeNode;
    function isTupleTypeNode(node: Node): node is TupleTypeNode;
    function isNamedTupleMember(node: Node): node is NamedTupleMember;
    function isOptionalTypeNode(node: Node): node is OptionalTypeNode;
    function isRestTypeNode(node: Node): node is RestTypeNode;
    function isUnionTypeNode(node: Node): node is UnionTypeNode;
    function isIntersectionTypeNode(node: Node): node is IntersectionTypeNode;
    function isConditionalTypeNode(node: Node): node is ConditionalTypeNode;
    function isInferTypeNode(node: Node): node is InferTypeNode;
    function isParenthesizedTypeNode(node: Node): node is ParenthesizedTypeNode;
    function isThisTypeNode(node: Node): node is ThisTypeNode;
    function isTypeOperatorNode(node: Node): node is TypeOperatorNode;
    function isIndexedAccessTypeNode(node: Node): node is IndexedAccessTypeNode;
    function isMappedTypeNode(node: Node): node is MappedTypeNode;
    function isLiteralTypeNode(node: Node): node is LiteralTypeNode;
    function isImportTypeNode(node: Node): node is ImportTypeNode;
    function isTemplateLiteralTypeSpan(node: Node): node is TemplateLiteralTypeSpan;
    function isTemplateLiteralTypeNode(node: Node): node is TemplateLiteralTypeNode;
    function isObjectBindingPattern(node: Node): node is ObjectBindingPattern;
    function isArrayBindingPattern(node: Node): node is ArrayBindingPattern;
    function isBindingElement(node: Node): node is BindingElement;
    function isArrayLiteralExpression(node: Node): node is ArrayLiteralExpression;
    function isObjectLiteralExpression(node: Node): node is ObjectLiteralExpression;
    function isPropertyAccessExpression(node: Node): node is PropertyAccessExpression;
    function isElementAccessExpression(node: Node): node is ElementAccessExpression;
    function isCallExpression(node: Node): node is CallExpression;
    function isNewExpression(node: Node): node is NewExpression;
    function isTaggedTemplateExpression(node: Node): node is TaggedTemplateExpression;
    function isTypeAssertionExpression(node: Node): node is TypeAssertion;
    function isParenthesizedExpression(node: Node): node is ParenthesizedExpression;
    function isFunctionExpression(node: Node): node is FunctionExpression;
    function isArrowFunction(node: Node): node is ArrowFunction;
    function isDeleteExpression(node: Node): node is DeleteExpression;
    function isTypeOfExpression(node: Node): node is TypeOfExpression;
    function isVoidExpression(node: Node): node is VoidExpression;
    function isAwaitExpression(node: Node): node is AwaitExpression;
    function isPrefixUnaryExpression(node: Node): node is PrefixUnaryExpression;
    function isPostfixUnaryExpression(node: Node): node is PostfixUnaryExpression;
    function isBinaryExpression(node: Node): node is BinaryExpression;
    function isConditionalExpression(node: Node): node is ConditionalExpression;
    function isTemplateExpression(node: Node): node is TemplateExpression;
    function isYieldExpression(node: Node): node is YieldExpression;
    function isSpreadElement(node: Node): node is SpreadElement;
    function isClassExpression(node: Node): node is ClassExpression;
    function isOmittedExpression(node: Node): node is OmittedExpression;
    function isExpressionWithTypeArguments(node: Node): node is ExpressionWithTypeArguments;
    function isAsExpression(node: Node): node is AsExpression;
    function isNonNullExpression(node: Node): node is NonNullExpression;
    function isMetaProperty(node: Node): node is MetaProperty;
    function isSyntheticExpression(node: Node): node is SyntheticExpression;
    function isPartiallyEmittedExpression(node: Node): node is PartiallyEmittedExpression;
    function isCommaListExpression(node: Node): node is CommaListExpression;
    function isTemplateSpan(node: Node): node is TemplateSpan;
    function isSemicolonClassElement(node: Node): node is SemicolonClassElement;
    function isBlock(node: Node): node is Block;
    function isVariableStatement(node: Node): node is VariableStatement;
    function isEmptyStatement(node: Node): node is EmptyStatement;
    function isExpressionStatement(node: Node): node is ExpressionStatement;
    function isIfStatement(node: Node): node is IfStatement;
    function isDoStatement(node: Node): node is DoStatement;
    function isWhileStatement(node: Node): node is WhileStatement;
    function isForStatement(node: Node): node is ForStatement;
    function isForInStatement(node: Node): node is ForInStatement;
    function isForOfStatement(node: Node): node is ForOfStatement;
    function isContinueStatement(node: Node): node is ContinueStatement;
    function isBreakStatement(node: Node): node is BreakStatement;
    function isReturnStatement(node: Node): node is ReturnStatement;
    function isWithStatement(node: Node): node is WithStatement;
    function isSwitchStatement(node: Node): node is SwitchStatement;
    function isLabeledStatement(node: Node): node is LabeledStatement;
    function isThrowStatement(node: Node): node is ThrowStatement;
    function isTryStatement(node: Node): node is TryStatement;
    function isDebuggerStatement(node: Node): node is DebuggerStatement;
    function isVariableDeclaration(node: Node): node is VariableDeclaration;
    function isVariableDeclarationList(node: Node): node is VariableDeclarationList;
    function isFunctionDeclaration(node: Node): node is FunctionDeclaration;
    function isClassDeclaration(node: Node): node is ClassDeclaration;
    function isInterfaceDeclaration(node: Node): node is InterfaceDeclaration;
    function isTypeAliasDeclaration(node: Node): node is TypeAliasDeclaration;
    function isEnumDeclaration(node: Node): node is EnumDeclaration;
    function isModuleDeclaration(node: Node): node is ModuleDeclaration;
    function isModuleBlock(node: Node): node is ModuleBlock;
    function isCaseBlock(node: Node): node is CaseBlock;
    function isNamespaceExportDeclaration(node: Node): node is NamespaceExportDeclaration;
    function isImportEqualsDeclaration(node: Node): node is ImportEqualsDeclaration;
    function isImportDeclaration(node: Node): node is ImportDeclaration;
    function isImportClause(node: Node): node is ImportClause;
    function isNamespaceImport(node: Node): node is NamespaceImport;
    function isNamespaceExport(node: Node): node is NamespaceExport;
    function isNamedImports(node: Node): node is NamedImports;
    function isImportSpecifier(node: Node): node is ImportSpecifier;
    function isExportAssignment(node: Node): node is ExportAssignment;
    function isExportDeclaration(node: Node): node is ExportDeclaration;
    function isNamedExports(node: Node): node is NamedExports;
    function isExportSpecifier(node: Node): node is ExportSpecifier;
    function isMissingDeclaration(node: Node): node is MissingDeclaration;
    function isNotEmittedStatement(node: Node): node is NotEmittedStatement;
    function isSyntheticReference(node: Node): node is SyntheticReferenceExpression;
    function isMergeDeclarationMarker(node: Node): node is MergeDeclarationMarker;
    function isEndOfDeclarationMarker(node: Node): node is EndOfDeclarationMarker;
    function isExternalModuleReference(node: Node): node is ExternalModuleReference;
    function isJsxElement(node: Node): node is JsxElement;
    function isJsxSelfClosingElement(node: Node): node is JsxSelfClosingElement;
    function isJsxOpeningElement(node: Node): node is JsxOpeningElement;
    function isJsxClosingElement(node: Node): node is JsxClosingElement;
    function isJsxFragment(node: Node): node is JsxFragment;
    function isJsxOpeningFragment(node: Node): node is JsxOpeningFragment;
    function isJsxClosingFragment(node: Node): node is JsxClosingFragment;
    function isJsxAttribute(node: Node): node is JsxAttribute;
    function isJsxAttributes(node: Node): node is JsxAttributes;
    function isJsxSpreadAttribute(node: Node): node is JsxSpreadAttribute;
    function isJsxExpression(node: Node): node is JsxExpression;
    function isCaseClause(node: Node): node is CaseClause;
    function isDefaultClause(node: Node): node is DefaultClause;
    function isHeritageClause(node: Node): node is HeritageClause;
    function isCatchClause(node: Node): node is CatchClause;
    function isPropertyAssignment(node: Node): node is PropertyAssignment;
    function isShorthandPropertyAssignment(node: Node): node is ShorthandPropertyAssignment;
    function isSpreadAssignment(node: Node): node is SpreadAssignment;
    function isEnumMember(node: Node): node is EnumMember;
    function isUnparsedPrepend(node: Node): node is UnparsedPrepend;
    function isSourceFile(node: Node): node is SourceFile;
    function isBundle(node: Node): node is Bundle;
    function isUnparsedSource(node: Node): node is UnparsedSource;
    function isJSDocTypeExpression(node: Node): node is JSDocTypeExpression;
    function isJSDocNameReference(node: Node): node is JSDocNameReference;
    function isJSDocAllType(node: Node): node is JSDocAllType;
    function isJSDocUnknownType(node: Node): node is JSDocUnknownType;
    function isJSDocNullableType(node: Node): node is JSDocNullableType;
    function isJSDocNonNullableType(node: Node): node is JSDocNonNullableType;
    function isJSDocOptionalType(node: Node): node is JSDocOptionalType;
    function isJSDocFunctionType(node: Node): node is JSDocFunctionType;
    function isJSDocVariadicType(node: Node): node is JSDocVariadicType;
    function isJSDocNamepathType(node: Node): node is JSDocNamepathType;
    function isJSDoc(node: Node): node is JSDoc;
    function isJSDocTypeLiteral(node: Node): node is JSDocTypeLiteral;
    function isJSDocSignature(node: Node): node is JSDocSignature;
    function isJSDocAugmentsTag(node: Node): node is JSDocAugmentsTag;
    function isJSDocAuthorTag(node: Node): node is JSDocAuthorTag;
    function isJSDocClassTag(node: Node): node is JSDocClassTag;
    function isJSDocCallbackTag(node: Node): node is JSDocCallbackTag;
    function isJSDocPublicTag(node: Node): node is JSDocPublicTag;
    function isJSDocPrivateTag(node: Node): node is JSDocPrivateTag;
    function isJSDocProtectedTag(node: Node): node is JSDocProtectedTag;
    function isJSDocReadonlyTag(node: Node): node is JSDocReadonlyTag;
    function isJSDocDeprecatedTag(node: Node): node is JSDocDeprecatedTag;
    function isJSDocSeeTag(node: Node): node is JSDocSeeTag;
    function isJSDocEnumTag(node: Node): node is JSDocEnumTag;
    function isJSDocParameterTag(node: Node): node is JSDocParameterTag;
    function isJSDocReturnTag(node: Node): node is JSDocReturnTag;
    function isJSDocThisTag(node: Node): node is JSDocThisTag;
    function isJSDocTypeTag(node: Node): node is JSDocTypeTag;
    function isJSDocTemplateTag(node: Node): node is JSDocTemplateTag;
    function isJSDocTypedefTag(node: Node): node is JSDocTypedefTag;
    function isJSDocUnknownTag(node: Node): node is JSDocUnknownTag;
    function isJSDocPropertyTag(node: Node): node is JSDocPropertyTag;
    function isJSDocImplementsTag(node: Node): node is JSDocImplementsTag;
    function isSyntaxList(n: Node): n is SyntaxList;
}
declare namespace ts {
    function createEmptyExports(factory: NodeFactory): ExportDeclaration;
    function createMemberAccessForPropertyName(factory: NodeFactory, target: Expression, memberName: PropertyName, location?: TextRange): MemberExpression;
    function createJsxFactoryExpression(factory: NodeFactory, jsxFactoryEntity: EntityName | undefined, reactNamespace: string, parent: JsxOpeningLikeElement | JsxOpeningFragment): Expression;
    function createExpressionForJsxElement(factory: NodeFactory, callee: Expression, tagName: Expression, props: Expression | undefined, children: readonly Expression[] | undefined, location: TextRange): LeftHandSideExpression;
    function createExpressionForJsxFragment(factory: NodeFactory, jsxFactoryEntity: EntityName | undefined, jsxFragmentFactoryEntity: EntityName | undefined, reactNamespace: string, children: readonly Expression[], parentElement: JsxOpeningFragment, location: TextRange): LeftHandSideExpression;
    function createForOfBindingStatement(factory: NodeFactory, node: ForInitializer, boundValue: Expression): Statement;
    function insertLeadingStatement(factory: NodeFactory, dest: Statement, source: Statement): Block;
    function createExpressionFromEntityName(factory: NodeFactory, node: EntityName | Expression): Expression;
    function createExpressionForPropertyName(factory: NodeFactory, memberName: Exclude<PropertyName, PrivateIdentifier>): Expression;
    function createExpressionForObjectLiteralElementLike(factory: NodeFactory, node: ObjectLiteralExpression, property: ObjectLiteralElementLike, receiver: Expression): Expression | undefined;
    /**
     * Gets whether an identifier should only be referred to by its internal name.
     */
    function isInternalName(node: Identifier): boolean;
    /**
     * Gets whether an identifier should only be referred to by its local name.
     */
    function isLocalName(node: Identifier): boolean;
    /**
     * Gets whether an identifier should only be referred to by its export representation if the
     * name points to an exported symbol.
     */
    function isExportName(node: Identifier): boolean;
    function findUseStrictPrologue(statements: readonly Statement[]): Statement | undefined;
    function startsWithUseStrict(statements: readonly Statement[]): boolean;
    function isCommaSequence(node: Expression): node is BinaryExpression & {
        operatorToken: Token<SyntaxKind.CommaToken>;
    } | CommaListExpression;
    function isOuterExpression(node: Node, kinds?: OuterExpressionKinds): node is OuterExpression;
    function skipOuterExpressions(node: Expression, kinds?: OuterExpressionKinds): Expression;
    function skipOuterExpressions(node: Node, kinds?: OuterExpressionKinds): Node;
    function skipAssertions(node: Expression): Expression;
    function skipAssertions(node: Node): Node;
    function startOnNewLine<T extends Node>(node: T): T;
    function getExternalHelpersModuleName(node: SourceFile): Identifier | undefined;
    function hasRecordedExternalHelpers(sourceFile: SourceFile): boolean;
    function createExternalHelpersImportDeclarationIfNeeded(nodeFactory: NodeFactory, helperFactory: EmitHelperFactory, sourceFile: SourceFile, compilerOptions: CompilerOptions, hasExportStarsToExportValues?: boolean, hasImportStar?: boolean, hasImportDefault?: boolean): ImportDeclaration | undefined;
    function getOrCreateExternalHelpersModuleNameIfNeeded(factory: NodeFactory, node: SourceFile, compilerOptions: CompilerOptions, hasExportStarsToExportValues?: boolean, hasImportStarOrImportDefault?: boolean): Identifier | undefined;
    /**
     * Get the name of that target module from an import or export declaration
     */
    function getLocalNameForExternalImport(factory: NodeFactory, node: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration, sourceFile: SourceFile): Identifier | undefined;
    /**
     * Get the name of a target module from an import/export declaration as should be written in the emitted output.
     * The emitted output name can be different from the input if:
     *  1. The module has a /// <amd-module name="<new name>" />
     *  2. --out or --outFile is used, making the name relative to the rootDir
     *  3- The containing SourceFile has an entry in renamedDependencies for the import as requested by some module loaders (e.g. System).
     * Otherwise, a new StringLiteral node representing the module name will be returned.
     */
    function getExternalModuleNameLiteral(factory: NodeFactory, importNode: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration | ImportCall, sourceFile: SourceFile, host: EmitHost, resolver: EmitResolver, compilerOptions: CompilerOptions): StringLiteral | undefined;
    /**
     * Get the name of a module as should be written in the emitted output.
     * The emitted output name can be different from the input if:
     *  1. The module has a /// <amd-module name="<new name>" />
     *  2. --out or --outFile is used, making the name relative to the rootDir
     * Otherwise, a new StringLiteral node representing the module name will be returned.
     */
    function tryGetModuleNameFromFile(factory: NodeFactory, file: SourceFile | undefined, host: EmitHost, options: CompilerOptions): StringLiteral | undefined;
    /**
     * Gets the initializer of an BindingOrAssignmentElement.
     */
    function getInitializerOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): Expression | undefined;
    /**
     * Gets the name of an BindingOrAssignmentElement.
     */
    function getTargetOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): BindingOrAssignmentElementTarget | undefined;
    /**
     * Determines whether an BindingOrAssignmentElement is a rest element.
     */
    function getRestIndicatorOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): BindingOrAssignmentElementRestIndicator | undefined;
    /**
     * Gets the property name of a BindingOrAssignmentElement
     */
    function getPropertyNameOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): Exclude<PropertyName, PrivateIdentifier> | undefined;
    function tryGetPropertyNameOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): Exclude<PropertyName, PrivateIdentifier> | undefined;
    /**
     * Gets the elements of a BindingOrAssignmentPattern
     */
    function getElementsOfBindingOrAssignmentPattern(name: BindingOrAssignmentPattern): readonly BindingOrAssignmentElement[];
    function getJSDocTypeAliasName(fullName: JSDocNamespaceBody | undefined): Identifier | undefined;
    function canHaveModifiers(node: Node): node is HasModifiers;
    function isExportModifier(node: Modifier): node is ExportKeyword;
    function isAsyncModifier(node: Modifier): node is AsyncKeyword;
    function isStaticModifier(node: Modifier): node is StaticKeyword;
}
declare namespace ts {
    function setTextRange<T extends TextRange>(range: T, location: TextRange | undefined): T;
}
declare namespace ts {
    /**
     * NOTE: You should not use this, it is only exported to support `createNode` in `~/src/deprecatedCompat/deprecations.ts`.
     */
    export const parseBaseNodeFactory: BaseNodeFactory;
    export const parseNodeFactory: NodeFactory;
    export function isJSDocLikeText(text: string, start: number): boolean;
    /**
     * Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
     * stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
     * embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
     * a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
     *
     * @param node a given node to visit its children
     * @param cbNode a callback to be invoked for all child nodes
     * @param cbNodes a callback to be invoked for embedded array
     *
     * @remarks `forEachChild` must visit the children of a node in the order
     * that they appear in the source code. The language service depends on this property to locate nodes by position.
     */
    export function forEachChild<T>(node: Node, cbNode: (node: Node) => T | undefined, cbNodes?: (nodes: NodeArray<Node>) => T | undefined): T | undefined;
    /** @internal */
    /**
     * Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
     * stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; additionally,
     * unlike `forEachChild`, embedded arrays are flattened and the 'cbNode' callback is invoked for each element.
     *  If a callback returns a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
     *
     * @param node a given node to visit its children
     * @param cbNode a callback to be invoked for all child nodes
     * @param cbNodes a callback to be invoked for embedded array
     *
     * @remarks Unlike `forEachChild`, `forEachChildRecursively` handles recursively invoking the traversal on each child node found,
     * and while doing so, handles traversing the structure without relying on the callstack to encode the tree structure.
     */
    export function forEachChildRecursively<T>(rootNode: Node, cbNode: (node: Node, parent: Node) => T | "skip" | undefined, cbNodes?: (nodes: NodeArray<Node>, parent: Node) => T | "skip" | undefined): T | undefined;
    export function createSourceFile(fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes?: boolean, scriptKind?: ScriptKind): SourceFile;
    export function parseIsolatedEntityName(text: string, languageVersion: ScriptTarget): EntityName | undefined;
    /**
     * Parse json text into SyntaxTree and return node and parse errors if any
     * @param fileName
     * @param sourceText
     */
    export function parseJsonText(fileName: string, sourceText: string): JsonSourceFile;
    export function isExternalModule(file: SourceFile): boolean;
    export function updateSourceFile(sourceFile: SourceFile, newText: string, textChangeRange: TextChangeRange, aggressiveChecks?: boolean): SourceFile;
    export function parseIsolatedJSDocComment(content: string, start?: number, length?: number): {
        jsDoc: JSDoc;
        diagnostics: Diagnostic[];
    } | undefined;
    export function parseJSDocTypeExpressionForTests(content: string, start?: number, length?: number): {
        jsDocTypeExpression: JSDocTypeExpression;
        diagnostics: Diagnostic[];
    } | undefined;
    /** @internal */
    export function isDeclarationFileName(fileName: string): boolean;
    export interface PragmaContext {
        languageVersion: ScriptTarget;
        pragmas?: PragmaMap;
        checkJsDirective?: CheckJsDirective;
        referencedFiles: FileReference[];
        typeReferenceDirectives: FileReference[];
        libReferenceDirectives: FileReference[];
        amdDependencies: AmdDependency[];
        hasNoDefaultLib?: boolean;
        moduleName?: string;
    }
    export function processCommentPragmas(context: PragmaContext, sourceText: string): void;
    type PragmaDiagnosticReporter = (pos: number, length: number, message: DiagnosticMessage) => void;
    export function processPragmasIntoFields(context: PragmaContext, reportDiagnostic: PragmaDiagnosticReporter): void;
    /** @internal */
    export function tagNamesAreEquivalent(lhs: JsxTagNameExpression, rhs: JsxTagNameExpression): boolean;
    export {};
}
declare namespace ts {
    export const compileOnSaveCommandLineOption: CommandLineOption;
    export const inverseJsxOptionMap: ESMap<string, string>;
    /**
     * An array of supported "lib" reference file names used to determine the order for inclusion
     * when referenced, as well as for spelling suggestions. This ensures the correct ordering for
     * overload resolution when a type declared in one lib is extended by another.
     */
    export const libs: string[];
    /**
     * A map of lib names to lib files. This map is used both for parsing the "lib" command line
     * option as well as for resolving lib reference directives.
     */
    export const libMap: ESMap<string, string>;
    export const optionsForWatch: CommandLineOption[];
    export const commonOptionsWithBuild: CommandLineOption[];
    export const targetOptionDeclaration: CommandLineOptionOfCustomType;
    export const optionDeclarations: CommandLineOption[];
    export const semanticDiagnosticsOptionDeclarations: readonly CommandLineOption[];
    export const affectsEmitOptionDeclarations: readonly CommandLineOption[];
    export const moduleResolutionOptionDeclarations: readonly CommandLineOption[];
    export const sourceFileAffectingCompilerOptions: readonly CommandLineOption[];
    export const transpileOptionValueCompilerOptions: readonly CommandLineOption[];
    export const buildOpts: CommandLineOption[];
    export const typeAcquisitionDeclarations: CommandLineOption[];
    export interface OptionsNameMap {
        optionsNameMap: ESMap<string, CommandLineOption>;
        shortOptionNames: ESMap<string, string>;
    }
    export function createOptionNameMap(optionDeclarations: readonly CommandLineOption[]): OptionsNameMap;
    export function getOptionsNameMap(): OptionsNameMap;
    export const defaultInitCompilerOptions: CompilerOptions;
    export function convertEnableAutoDiscoveryToEnable(typeAcquisition: TypeAcquisition): TypeAcquisition;
    export function createCompilerDiagnosticForInvalidCustomType(opt: CommandLineOptionOfCustomType): Diagnostic;
    export function parseCustomTypeOption(opt: CommandLineOptionOfCustomType, value: string, errors: Push<Diagnostic>): string | number | undefined;
    export function parseListTypeOption(opt: CommandLineOptionOfListType, value: string | undefined, errors: Push<Diagnostic>): (string | number)[] | undefined;
    export interface OptionsBase {
        [option: string]: CompilerOptionsValue | TsConfigSourceFile | undefined;
    }
    export interface ParseCommandLineWorkerDiagnostics extends DidYouMeanOptionsDiagnostics {
        getOptionsNameMap: () => OptionsNameMap;
        optionTypeMismatchDiagnostic: DiagnosticMessage;
    }
    export function parseCommandLineWorker(diagnostics: ParseCommandLineWorkerDiagnostics, commandLine: readonly string[], readFile?: (path: string) => string | undefined): {
        options: OptionsBase;
        watchOptions: WatchOptions | undefined;
        fileNames: string[];
        errors: Diagnostic[];
    };
    export const compilerOptionsDidYouMeanDiagnostics: ParseCommandLineWorkerDiagnostics;
    export function parseCommandLine(commandLine: readonly string[], readFile?: (path: string) => string | undefined): ParsedCommandLine;
    /** @internal */
    export function getOptionFromName(optionName: string, allowShort?: boolean): CommandLineOption | undefined;
    export interface ParsedBuildCommand {
        buildOptions: BuildOptions;
        watchOptions: WatchOptions | undefined;
        projects: string[];
        errors: Diagnostic[];
    }
    export function parseBuildCommand(args: readonly string[]): ParsedBuildCommand;
    export function getDiagnosticText(_message: DiagnosticMessage, ..._args: any[]): string;
    export type DiagnosticReporter = (diagnostic: Diagnostic) => void;
    /**
     * Reports config file diagnostics
     */
    export interface ConfigFileDiagnosticsReporter {
        /**
         * Reports unrecoverable error when parsing config file
         */
        onUnRecoverableConfigFileDiagnostic: DiagnosticReporter;
    }
    /**
     * Interface extending ParseConfigHost to support ParseConfigFile that reads config file and reports errors
     */
    export interface ParseConfigFileHost extends ParseConfigHost, ConfigFileDiagnosticsReporter {
        getCurrentDirectory(): string;
    }
    /**
     * Reads the config file, reports errors if any and exits if the config file cannot be found
     */
    export function getParsedCommandLineOfConfigFile(configFileName: string, optionsToExtend: CompilerOptions, host: ParseConfigFileHost, extendedConfigCache?: Map<ExtendedConfigCacheEntry>, watchOptionsToExtend?: WatchOptions, extraFileExtensions?: readonly FileExtensionInfo[]): ParsedCommandLine | undefined;
    /**
     * Read tsconfig.json file
     * @param fileName The path to the config file
     */
    export function readConfigFile(fileName: string, readFile: (path: string) => string | undefined): {
        config?: any;
        error?: Diagnostic;
    };
    /**
     * Parse the text of the tsconfig.json file
     * @param fileName The path to the config file
     * @param jsonText The text of the config file
     */
    export function parseConfigFileTextToJson(fileName: string, jsonText: string): {
        config?: any;
        error?: Diagnostic;
    };
    /**
     * Read tsconfig.json file
     * @param fileName The path to the config file
     */
    export function readJsonConfigFile(fileName: string, readFile: (path: string) => string | undefined): TsConfigSourceFile;
    export function tryReadFile(fileName: string, readFile: (path: string) => string | undefined): string | Diagnostic;
    interface JsonConversionNotifier {
        /**
         * Notifies parent option object is being set with the optionKey and a valid optionValue
         * Currently it notifies only if there is element with type object (parentOption) and
         * has element's option declarations map associated with it
         * @param parentOption parent option name in which the option and value are being set
         * @param option option declaration which is being set with the value
         * @param value value of the option
         */
        onSetValidOptionKeyValueInParent(parentOption: string, option: CommandLineOption, value: CompilerOptionsValue): void;
        /**
         * Notify when valid root key value option is being set
         * @param key option key
         * @param keyNode node corresponding to node in the source file
         * @param value computed value of the key
         * @param ValueNode node corresponding to value in the source file
         */
        onSetValidOptionKeyValueInRoot(key: string, keyNode: PropertyName, value: CompilerOptionsValue, valueNode: Expression): void;
        /**
         * Notify when unknown root key value option is being set
         * @param key option key
         * @param keyNode node corresponding to node in the source file
         * @param value computed value of the key
         * @param ValueNode node corresponding to value in the source file
         */
        onSetUnknownOptionKeyValueInRoot(key: string, keyNode: PropertyName, value: CompilerOptionsValue, valueNode: Expression): void;
    }
    /**
     * Convert the json syntax tree into the json value
     */
    export function convertToObject(sourceFile: JsonSourceFile, errors: Push<Diagnostic>): any;
    /**
     * Convert the json syntax tree into the json value and report errors
     * This returns the json value (apart from checking errors) only if returnValue provided is true.
     * Otherwise it just checks the errors and returns undefined
     */
    export function convertToObjectWorker(sourceFile: JsonSourceFile, errors: Push<Diagnostic>, returnValue: boolean, knownRootOptions: CommandLineOption | undefined, jsonConversionNotifier: JsonConversionNotifier | undefined): any;
    /** @internal */
    export interface TSConfig {
        compilerOptions: CompilerOptions;
        compileOnSave: boolean | undefined;
        exclude?: readonly string[];
        files: readonly string[] | undefined;
        include?: readonly string[];
        references: readonly ProjectReference[] | undefined;
    }
    /** @internal */
    export interface ConvertToTSConfigHost {
        getCurrentDirectory(): string;
        useCaseSensitiveFileNames: boolean;
    }
    /**
     * Generate an uncommented, complete tsconfig for use with "--showConfig"
     * @param configParseResult options to be generated into tsconfig.json
     * @param configFileName name of the parsed config file - output paths will be generated relative to this
     * @param host provides current directory and case sensitivity services
     */
    /** @internal */
    export function convertToTSConfig(configParseResult: ParsedCommandLine, configFileName: string, host: ConvertToTSConfigHost): TSConfig;
    /**
     * Generate tsconfig configuration when running command line "--init"
     * @param options commandlineOptions to be generated into tsconfig.json
     * @param fileNames array of filenames to be generated into tsconfig.json
     */
    export function generateTSConfig(options: CompilerOptions, fileNames: readonly string[], newLine: string): string;
    export function convertToOptionsWithAbsolutePaths(options: CompilerOptions, toAbsolutePath: (path: string) => string): CompilerOptions;
    /**
     * Parse the contents of a config file (tsconfig.json).
     * @param json The contents of the config file to parse
     * @param host Instance of ParseConfigHost used to enumerate files in folder.
     * @param basePath A root directory to resolve relative path entries in the config
     *    file to. e.g. outDir
     */
    export function parseJsonConfigFileContent(json: any, host: ParseConfigHost, basePath: string, existingOptions?: CompilerOptions, configFileName?: string, resolutionStack?: Path[], extraFileExtensions?: readonly FileExtensionInfo[], extendedConfigCache?: Map<ExtendedConfigCacheEntry>, existingWatchOptions?: WatchOptions): ParsedCommandLine;
    /**
     * Parse the contents of a config file (tsconfig.json).
     * @param jsonNode The contents of the config file to parse
     * @param host Instance of ParseConfigHost used to enumerate files in folder.
     * @param basePath A root directory to resolve relative path entries in the config
     *    file to. e.g. outDir
     */
    export function parseJsonSourceFileConfigFileContent(sourceFile: TsConfigSourceFile, host: ParseConfigHost, basePath: string, existingOptions?: CompilerOptions, configFileName?: string, resolutionStack?: Path[], extraFileExtensions?: readonly FileExtensionInfo[], extendedConfigCache?: Map<ExtendedConfigCacheEntry>, existingWatchOptions?: WatchOptions): ParsedCommandLine;
    export function setConfigFileInOptions(options: CompilerOptions, configFile: TsConfigSourceFile | undefined): void;
    export function canJsonReportNoInputFiles(raw: any): boolean;
    export function updateErrorForNoInputFiles(fileNames: string[], configFileName: string, configFileSpecs: ConfigFileSpecs, configParseDiagnostics: Diagnostic[], canJsonReportNoInutFiles: boolean): boolean;
    export interface ParsedTsconfig {
        raw: any;
        options?: CompilerOptions;
        watchOptions?: WatchOptions;
        typeAcquisition?: TypeAcquisition;
        /**
         * Note that the case of the config path has not yet been normalized, as no files have been imported into the project yet
         */
        extendedConfigPath?: string;
    }
    export interface ExtendedConfigCacheEntry {
        extendedResult: TsConfigSourceFile;
        extendedConfig: ParsedTsconfig | undefined;
    }
    export function convertCompilerOptionsFromJson(jsonOptions: any, basePath: string, configFileName?: string): {
        options: CompilerOptions;
        errors: Diagnostic[];
    };
    export function convertTypeAcquisitionFromJson(jsonOptions: any, basePath: string, configFileName?: string): {
        options: TypeAcquisition;
        errors: Diagnostic[];
    };
    export function convertJsonOption(opt: CommandLineOption, value: any, basePath: string, errors: Push<Diagnostic>): CompilerOptionsValue;
    /**
     * Gets the file names from the provided config file specs that contain, files, include, exclude and
     * other properties needed to resolve the file names
     * @param configFileSpecs The config file specs extracted with file names to include, wildcards to include/exclude and other details
     * @param basePath The base path for any relative file specifications.
     * @param options Compiler options.
     * @param host The host used to resolve files and directories.
     * @param extraFileExtensions optionaly file extra file extension information from host
     */
    export function getFileNamesFromConfigSpecs(configFileSpecs: ConfigFileSpecs, basePath: string, options: CompilerOptions, host: ParseConfigHost, extraFileExtensions?: readonly FileExtensionInfo[]): string[];
    export function isExcludedFile(pathToCheck: string, spec: ConfigFileSpecs, basePath: string, useCaseSensitiveFileNames: boolean, currentDirectory: string): boolean;
    export function matchesExclude(pathToCheck: string, excludeSpecs: readonly string[] | undefined, useCaseSensitiveFileNames: boolean, currentDirectory: string): boolean;
    /**
     * Produces a cleaned version of compiler options with personally identifying info (aka, paths) removed.
     * Also converts enum values back to strings.
     */
    export function convertCompilerOptionsForTelemetry(opts: CompilerOptions): CompilerOptions;
    export {};
}
declare namespace ts {
    function trace(host: ModuleResolutionHost, message: DiagnosticMessage, ...args: any[]): void;
    function isTraceEnabled(compilerOptions: CompilerOptions, host: ModuleResolutionHost): boolean;
    function getPackageJsonTypesVersionsPaths(typesVersions: MapLike<MapLike<string[]>>): {
        version: string;
        paths: MapLike<string[]>;
    } | undefined;
    function getEffectiveTypeRoots(options: CompilerOptions, host: GetEffectiveTypeRootsHost): string[] | undefined;
    /**
     * @param {string | undefined} containingFile - file that contains type reference directive, can be undefined if containing file is unknown.
     * This is possible in case if resolution is performed for directives specified via 'types' parameter. In this case initial path for secondary lookups
     * is assumed to be the same as root directory of the project.
     */
    function resolveTypeReferenceDirective(typeReferenceDirectiveName: string, containingFile: string | undefined, options: CompilerOptions, host: ModuleResolutionHost, redirectedReference?: ResolvedProjectReference): ResolvedTypeReferenceDirectiveWithFailedLookupLocations;
    /**
     * Given a set of options, returns the set of type directive names
     *   that should be included for this program automatically.
     * This list could either come from the config file,
     *   or from enumerating the types root + initial secondary types lookup location.
     * More type directives might appear in the program later as a result of loading actual source files;
     *   this list is only the set of defaults that are implicitly included.
     */
    function getAutomaticTypeDirectiveNames(options: CompilerOptions, host: ModuleResolutionHost): string[];
    /**
     * Cached module resolutions per containing directory.
     * This assumes that any module id will have the same resolution for sibling files located in the same folder.
     */
    interface ModuleResolutionCache extends NonRelativeModuleNameResolutionCache {
        getOrCreateCacheForDirectory(directoryName: string, redirectedReference?: ResolvedProjectReference): Map<ResolvedModuleWithFailedLookupLocations>;
        directoryToModuleNameMap: CacheWithRedirects<ESMap<string, ResolvedModuleWithFailedLookupLocations>>;
    }
    /**
     * Stored map from non-relative module name to a table: directory -> result of module lookup in this directory
     * We support only non-relative module names because resolution of relative module names is usually more deterministic and thus less expensive.
     */
    interface NonRelativeModuleNameResolutionCache {
        getOrCreateCacheForModuleName(nonRelativeModuleName: string, redirectedReference?: ResolvedProjectReference): PerModuleNameCache;
        moduleNameToDirectoryMap: CacheWithRedirects<PerModuleNameCache>;
    }
    interface PerModuleNameCache {
        get(directory: string): ResolvedModuleWithFailedLookupLocations | undefined;
        set(directory: string, result: ResolvedModuleWithFailedLookupLocations): void;
    }
    function createModuleResolutionCache(currentDirectory: string, getCanonicalFileName: (s: string) => string, options?: CompilerOptions): ModuleResolutionCache;
    interface CacheWithRedirects<T> {
        ownMap: ESMap<string, T>;
        redirectsMap: ESMap<Path, ESMap<string, T>>;
        getOrCreateMapOfCacheRedirects(redirectedReference: ResolvedProjectReference | undefined): ESMap<string, T>;
        clear(): void;
        setOwnOptions(newOptions: CompilerOptions): void;
        setOwnMap(newOwnMap: ESMap<string, T>): void;
    }
    function createCacheWithRedirects<T>(options?: CompilerOptions): CacheWithRedirects<T>;
    function createModuleResolutionCacheWithMaps(directoryToModuleNameMap: CacheWithRedirects<ESMap<string, ResolvedModuleWithFailedLookupLocations>>, moduleNameToDirectoryMap: CacheWithRedirects<PerModuleNameCache>, currentDirectory: string, getCanonicalFileName: GetCanonicalFileName): ModuleResolutionCache;
    function resolveModuleNameFromCache(moduleName: string, containingFile: string, cache: ModuleResolutionCache): ResolvedModuleWithFailedLookupLocations | undefined;
    function resolveModuleName(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache, redirectedReference?: ResolvedProjectReference): ResolvedModuleWithFailedLookupLocations;
    /**
     * Expose resolution logic to allow us to use Node module resolution logic from arbitrary locations.
     * No way to do this with `require()`: https://github.com/nodejs/node/issues/5963
     * Throws an error if the module can't be resolved.
     */
    function resolveJSModule(moduleName: string, initialDir: string, host: ModuleResolutionHost): string;
    function tryResolveJSModule(moduleName: string, initialDir: string, host: ModuleResolutionHost): string | undefined;
    function nodeModuleNameResolver(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache, redirectedReference?: ResolvedProjectReference): ResolvedModuleWithFailedLookupLocations;
    function nodeModuleNameResolver(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache, redirectedReference?: ResolvedProjectReference, lookupConfig?: boolean): ResolvedModuleWithFailedLookupLocations;
    const nodeModulesPathPart = "/node_modules/";
    function pathContainsNodeModules(path: string): boolean;
    function parsePackageName(moduleName: string): {
        packageName: string;
        rest: string;
    };
    function getTypesPackageName(packageName: string): string;
    function mangleScopedPackageName(packageName: string): string;
    function getPackageNameFromTypesPackageName(mangledName: string): string;
    function unmangleScopedPackageName(typesPackageName: string): string;
    function classicNameResolver(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: NonRelativeModuleNameResolutionCache, redirectedReference?: ResolvedProjectReference): ResolvedModuleWithFailedLookupLocations;
    /**
     * A host may load a module from a global cache of typings.
     * This is the minumum code needed to expose that functionality; the rest is in the host.
     */
    function loadModuleFromGlobalCache(moduleName: string, projectName: string | undefined, compilerOptions: CompilerOptions, host: ModuleResolutionHost, globalCache: string): ResolvedModuleWithFailedLookupLocations;
}
declare namespace ts {
    const enum ModuleInstanceState {
        NonInstantiated = 0,
        Instantiated = 1,
        ConstEnumOnly = 2
    }
    function getModuleInstanceState(node: ModuleDeclaration, visited?: ESMap<number, ModuleInstanceState | undefined>): ModuleInstanceState;
    function bindSourceFile(file: SourceFile, options: CompilerOptions): void;
    function isExportsOrModuleExportsOrAlias(sourceFile: SourceFile, node: Expression): boolean;
}
/** @internal */
declare namespace ts {
    function createGetSymbolWalker(getRestTypeOfSignature: (sig: Signature) => Type, getTypePredicateOfSignature: (sig: Signature) => TypePredicate | undefined, getReturnTypeOfSignature: (sig: Signature) => Type, getBaseTypes: (type: Type) => Type[], resolveStructuredTypeMembers: (type: ObjectType) => ResolvedType, getTypeOfSymbol: (sym: Symbol) => Type, getResolvedSymbol: (node: Node) => Symbol, getIndexTypeOfStructuredType: (type: Type, kind: IndexKind) => Type | undefined, getConstraintOfTypeParameter: (typeParameter: TypeParameter) => Type | undefined, getFirstIdentifier: (node: EntityNameOrEntityNameExpression) => Identifier, getTypeArguments: (type: TypeReference) => readonly Type[]): (accept?: (symbol: Symbol) => boolean) => SymbolWalker;
}
declare namespace ts {
    function getNodeId(node: Node): number;
    function getSymbolId(symbol: Symbol): SymbolId;
    function isInstantiatedModule(node: ModuleDeclaration, preserveConstEnums: boolean): boolean;
    function createTypeChecker(host: TypeCheckerHost, produceDiagnostics: boolean): TypeChecker;
    function signatureHasRestParameter(s: Signature): boolean;
    function signatureHasLiteralTypes(s: Signature): boolean;
}
declare namespace ts {
    /**
     * Visits a Node using the supplied visitor, possibly returning a new Node in its place.
     *
     * @param node The Node to visit.
     * @param visitor The callback used to visit the Node.
     * @param test A callback to execute to verify the Node is valid.
     * @param lift An optional callback to execute to lift a NodeArray into a valid Node.
     */
    function visitNode<T extends Node>(node: T, visitor: Visitor | undefined, test?: (node: Node) => boolean, lift?: (node: readonly Node[]) => T): T;
    /**
     * Visits a Node using the supplied visitor, possibly returning a new Node in its place.
     *
     * @param node The Node to visit.
     * @param visitor The callback used to visit the Node.
     * @param test A callback to execute to verify the Node is valid.
     * @param lift An optional callback to execute to lift a NodeArray into a valid Node.
     */
    function visitNode<T extends Node>(node: T | undefined, visitor: Visitor | undefined, test?: (node: Node) => boolean, lift?: (node: readonly Node[]) => T): T | undefined;
    /**
     * Visits a NodeArray using the supplied visitor, possibly returning a new NodeArray in its place.
     *
     * @param nodes The NodeArray to visit.
     * @param visitor The callback used to visit a Node.
     * @param test A node test to execute for each node.
     * @param start An optional value indicating the starting offset at which to start visiting.
     * @param count An optional value indicating the maximum number of nodes to visit.
     */
    function visitNodes<T extends Node>(nodes: NodeArray<T>, visitor: Visitor | undefined, test?: (node: Node) => boolean, start?: number, count?: number): NodeArray<T>;
    /**
     * Visits a NodeArray using the supplied visitor, possibly returning a new NodeArray in its place.
     *
     * @param nodes The NodeArray to visit.
     * @param visitor The callback used to visit a Node.
     * @param test A node test to execute for each node.
     * @param start An optional value indicating the starting offset at which to start visiting.
     * @param count An optional value indicating the maximum number of nodes to visit.
     */
    function visitNodes<T extends Node>(nodes: NodeArray<T> | undefined, visitor: Visitor | undefined, test?: (node: Node) => boolean, start?: number, count?: number): NodeArray<T> | undefined;
    /**
     * Starts a new lexical environment and visits a statement list, ending the lexical environment
     * and merging hoisted declarations upon completion.
     */
    function visitLexicalEnvironment(statements: NodeArray<Statement>, visitor: Visitor, context: TransformationContext, start?: number, ensureUseStrict?: boolean, nodesVisitor?: NodesVisitor): NodeArray<Statement>;
    /**
     * Starts a new lexical environment and visits a parameter list, suspending the lexical
     * environment upon completion.
     */
    function visitParameterList(nodes: NodeArray<ParameterDeclaration>, visitor: Visitor, context: TransformationContext, nodesVisitor?: NodesVisitor): NodeArray<ParameterDeclaration>;
    function visitParameterList(nodes: NodeArray<ParameterDeclaration> | undefined, visitor: Visitor, context: TransformationContext, nodesVisitor?: NodesVisitor): NodeArray<ParameterDeclaration> | undefined;
    /**
     * Resumes a suspended lexical environment and visits a function body, ending the lexical
     * environment and merging hoisted declarations upon completion.
     */
    function visitFunctionBody(node: FunctionBody, visitor: Visitor, context: TransformationContext): FunctionBody;
    /**
     * Resumes a suspended lexical environment and visits a function body, ending the lexical
     * environment and merging hoisted declarations upon completion.
     */
    function visitFunctionBody(node: FunctionBody | undefined, visitor: Visitor, context: TransformationContext): FunctionBody | undefined;
    /**
     * Resumes a suspended lexical environment and visits a concise body, ending the lexical
     * environment and merging hoisted declarations upon completion.
     */
    function visitFunctionBody(node: ConciseBody, visitor: Visitor, context: TransformationContext): ConciseBody;
    function visitFunctionBody(node: FunctionBody, visitor: Visitor, context: TransformationContext, nodeVisitor?: NodeVisitor): FunctionBody;
    function visitFunctionBody(node: FunctionBody | undefined, visitor: Visitor, context: TransformationContext, nodeVisitor?: NodeVisitor): FunctionBody | undefined;
    function visitFunctionBody(node: ConciseBody, visitor: Visitor, context: TransformationContext, nodeVisitor?: NodeVisitor): ConciseBody;
    /**
     * Visits each child of a Node using the supplied visitor, possibly returning a new Node of the same kind in its place.
     *
     * @param node The Node whose children will be visited.
     * @param visitor The callback used to visit each child.
     * @param context A lexical environment context for the visitor.
     */
    function visitEachChild<T extends Node>(node: T, visitor: Visitor, context: TransformationContext): T;
    function visitEachChild<T extends Node>(node: T, visitor: Visitor, context: TransformationContext, nodesVisitor?: NodesVisitor, tokenVisitor?: Visitor, nodeVisitor?: NodeVisitor): T;
    /**
     * Visits each child of a Node using the supplied visitor, possibly returning a new Node of the same kind in its place.
     *
     * @param node The Node whose children will be visited.
     * @param visitor The callback used to visit each child.
     * @param context A lexical environment context for the visitor.
     */
    function visitEachChild<T extends Node>(node: T | undefined, visitor: Visitor, context: TransformationContext, nodesVisitor?: typeof visitNodes, tokenVisitor?: Visitor): T | undefined;
    function visitEachChild<T extends Node>(node: T | undefined, visitor: Visitor, context: TransformationContext, nodesVisitor?: NodesVisitor, tokenVisitor?: Visitor, nodeVisitor?: NodeVisitor): T | undefined;
}
declare namespace ts {
    interface SourceMapGeneratorOptions {
        extendedDiagnostics?: boolean;
    }
    function createSourceMapGenerator(host: EmitHost, file: string, sourceRoot: string, sourcesDirectoryPath: string, generatorOptions: SourceMapGeneratorOptions): SourceMapGenerator;
    interface LineInfo {
        getLineCount(): number;
        getLineText(line: number): string;
    }
    function getLineInfo(text: string, lineStarts: readonly number[]): LineInfo;
    /**
     * Tries to find the sourceMappingURL comment at the end of a file.
     */
    function tryGetSourceMappingURL(lineInfo: LineInfo): string | undefined;
    function isRawSourceMap(x: any): x is RawSourceMap;
    function tryParseRawSourceMap(text: string): RawSourceMap | undefined;
    interface MappingsDecoder extends Iterator<Mapping> {
        readonly pos: number;
        readonly error: string | undefined;
        readonly state: Required<Mapping>;
    }
    interface Mapping {
        generatedLine: number;
        generatedCharacter: number;
        sourceIndex?: number;
        sourceLine?: number;
        sourceCharacter?: number;
        nameIndex?: number;
    }
    interface SourceMapping extends Mapping {
        sourceIndex: number;
        sourceLine: number;
        sourceCharacter: number;
    }
    function decodeMappings(mappings: string): MappingsDecoder;
    function sameMapping<T extends Mapping>(left: T, right: T): boolean;
    function isSourceMapping(mapping: Mapping): mapping is SourceMapping;
    function createDocumentPositionMapper(host: DocumentPositionMapperHost, map: RawSourceMap, mapPath: string): DocumentPositionMapper;
    const identitySourceMapConsumer: DocumentPositionMapper;
}
declare namespace ts {
    function getOriginalNodeId(node: Node): number;
    interface ExternalModuleInfo {
        externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[];
        externalHelpersImportDeclaration: ImportDeclaration | undefined;
        exportSpecifiers: ESMap<string, ExportSpecifier[]>;
        exportedBindings: Identifier[][];
        exportedNames: Identifier[] | undefined;
        exportEquals: ExportAssignment | undefined;
        hasExportStarsToExportValues: boolean;
    }
    function chainBundle(context: CoreTransformationContext, transformSourceFile: (x: SourceFile) => SourceFile): (x: SourceFile | Bundle) => SourceFile | Bundle;
    function getExportNeedsImportStarHelper(node: ExportDeclaration): boolean;
    function getImportNeedsImportStarHelper(node: ImportDeclaration): boolean;
    function getImportNeedsImportDefaultHelper(node: ImportDeclaration): boolean;
    function collectExternalModuleInfo(context: TransformationContext, sourceFile: SourceFile, resolver: EmitResolver, compilerOptions: CompilerOptions): ExternalModuleInfo;
    /**
     * Used in the module transformer to check if an expression is reasonably without sideeffect,
     *  and thus better to copy into multiple places rather than to cache in a temporary variable
     *  - this is mostly subjective beyond the requirement that the expression not be sideeffecting
     */
    function isSimpleCopiableExpression(expression: Expression): boolean;
    /**
     * A simple inlinable expression is an expression which can be copied into multiple locations
     * without risk of repeating any sideeffects and whose value could not possibly change between
     * any such locations
     */
    function isSimpleInlineableExpression(expression: Expression): boolean;
    function isCompoundAssignment(kind: BinaryOperator): kind is CompoundAssignmentOperator;
    function getNonAssignmentOperatorForCompoundAssignment(kind: CompoundAssignmentOperator): LogicalOperatorOrHigher | SyntaxKind.QuestionQuestionToken;
    /**
     * Adds super call and preceding prologue directives into the list of statements.
     *
     * @param ctor The constructor node.
     * @param result The list of statements.
     * @param visitor The visitor to apply to each node added to the result array.
     * @returns index of the statement that follows super call
     */
    function addPrologueDirectivesAndInitialSuperCall(factory: NodeFactory, ctor: ConstructorDeclaration, result: Statement[], visitor: Visitor): number;
    /**
     * Gets all the static or all the instance property declarations of a class
     *
     * @param node The class node.
     * @param isStatic A value indicating whether to get properties from the static or instance side of the class.
     */
    function getProperties(node: ClassExpression | ClassDeclaration, requireInitializer: true, isStatic: boolean): readonly InitializedPropertyDeclaration[];
    function getProperties(node: ClassExpression | ClassDeclaration, requireInitializer: boolean, isStatic: boolean): readonly PropertyDeclaration[];
    /**
     * Gets a value indicating whether a class element is either a static or an instance property declaration with an initializer.
     *
     * @param member The class element node.
     * @param isStatic A value indicating whether the member should be a static or instance member.
     */
    function isInitializedProperty(member: ClassElement): member is PropertyDeclaration & {
        initializer: Expression;
    };
}
declare namespace ts {
    const enum FlattenLevel {
        All = 0,
        ObjectRest = 1
    }
    /**
     * Flattens a DestructuringAssignment or a VariableDeclaration to an expression.
     *
     * @param node The node to flatten.
     * @param visitor An optional visitor used to visit initializers.
     * @param context The transformation context.
     * @param level Indicates the extent to which flattening should occur.
     * @param needsValue An optional value indicating whether the value from the right-hand-side of
     * the destructuring assignment is needed as part of a larger expression.
     * @param createAssignmentCallback An optional callback used to create the assignment expression.
     */
    function flattenDestructuringAssignment(node: VariableDeclaration | DestructuringAssignment, visitor: ((node: Node) => VisitResult<Node>) | undefined, context: TransformationContext, level: FlattenLevel, needsValue?: boolean, createAssignmentCallback?: (name: Identifier, value: Expression, location?: TextRange) => Expression): Expression;
    /**
     * Flattens a VariableDeclaration or ParameterDeclaration to one or more variable declarations.
     *
     * @param node The node to flatten.
     * @param visitor An optional visitor used to visit initializers.
     * @param context The transformation context.
     * @param boundValue The value bound to the declaration.
     * @param skipInitializer A value indicating whether to ignore the initializer of `node`.
     * @param hoistTempVariables Indicates whether temporary variables should not be recorded in-line.
     * @param level Indicates the extent to which flattening should occur.
     */
    function flattenDestructuringBinding(node: VariableDeclaration | ParameterDeclaration, visitor: (node: Node) => VisitResult<Node>, context: TransformationContext, level: FlattenLevel, rval?: Expression, hoistTempVariables?: boolean, skipInitializer?: boolean): VariableDeclaration[];
}
declare namespace ts {
    enum ProcessLevel {
        LiftRestriction = 0,
        All = 1
    }
    function processTaggedTemplateExpression(context: TransformationContext, node: TaggedTemplateExpression, visitor: Visitor, currentSourceFile: SourceFile, recordTaggedTemplateString: (temp: Identifier) => void, level: ProcessLevel): CallExpression | TaggedTemplateExpression;
}
declare namespace ts {
    function transformTypeScript(context: TransformationContext): (node: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    /**
     * Transforms ECMAScript Class Syntax.
     * TypeScript parameter property syntax is transformed in the TypeScript transformer.
     * For now, this transforms public field declarations using TypeScript class semantics,
     * where declarations are elided and initializers are transformed as assignments in the constructor.
     * When --useDefineForClassFields is on, this transforms to ECMAScript semantics, with Object.defineProperty.
     */
    function transformClassFields(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformES2017(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
    /** Creates a variable named `_super` with accessor properties for the given property names. */
    function createSuperAccessVariableStatement(factory: NodeFactory, resolver: EmitResolver, node: FunctionLikeDeclaration, names: Set<__String>): VariableStatement;
}
declare namespace ts {
    function transformES2018(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformES2019(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformES2020(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformESNext(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformJsx(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformES2016(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformES2015(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    /**
     * Transforms ES5 syntax into ES3 syntax.
     *
     * @param context Context and state information for the transformation.
     */
    function transformES5(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformGenerators(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformModule(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformSystemModule(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function transformECMAScriptModule(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    type GetSymbolAccessibilityDiagnostic = (symbolAccessibilityResult: SymbolAccessibilityResult) => (SymbolAccessibilityDiagnostic | undefined);
    interface SymbolAccessibilityDiagnostic {
        errorNode: Node;
        diagnosticMessage: DiagnosticMessage;
        typeName?: DeclarationName | QualifiedName;
    }
    type DeclarationDiagnosticProducing = VariableDeclaration | PropertyDeclaration | PropertySignature | BindingElement | SetAccessorDeclaration | GetAccessorDeclaration | ConstructSignatureDeclaration | CallSignatureDeclaration | MethodDeclaration | MethodSignature | FunctionDeclaration | ParameterDeclaration | TypeParameterDeclaration | ExpressionWithTypeArguments | ImportEqualsDeclaration | TypeAliasDeclaration | ConstructorDeclaration | IndexSignatureDeclaration | PropertyAccessExpression | JSDocTypedefTag | JSDocCallbackTag | JSDocEnumTag;
    function canProduceDiagnostics(node: Node): node is DeclarationDiagnosticProducing;
    function createGetSymbolAccessibilityDiagnosticForNodeName(node: DeclarationDiagnosticProducing): (symbolAccessibilityResult: SymbolAccessibilityResult) => SymbolAccessibilityDiagnostic | undefined;
    function createGetSymbolAccessibilityDiagnosticForNode(node: DeclarationDiagnosticProducing): GetSymbolAccessibilityDiagnostic;
}
declare namespace ts {
    function getDeclarationDiagnostics(host: EmitHost, resolver: EmitResolver, file: SourceFile | undefined): DiagnosticWithLocation[] | undefined;
    function isInternalDeclaration(node: Node, currentSourceFile: SourceFile): boolean | 0 | undefined;
    /**
     * Transforms a ts file into a .d.ts file
     * This process requires type information, which is retrieved through the emit resolver. Because of this,
     * in many places this transformer assumes it will be operating on parse tree nodes directly.
     * This means that _no transforms should be allowed to occur before this one_.
     */
    function transformDeclarations(context: TransformationContext): {
        (node: Bundle): Bundle;
        (node: SourceFile): SourceFile;
        (node: SourceFile | Bundle): SourceFile | Bundle;
    };
}
declare namespace ts {
    const noTransformers: EmitTransformers;
    function getTransformers(compilerOptions: CompilerOptions, customTransformers?: CustomTransformers, emitOnlyDtsFiles?: boolean): EmitTransformers;
    function noEmitSubstitution(_hint: EmitHint, node: Node): Node;
    function noEmitNotification(hint: EmitHint, node: Node, callback: (hint: EmitHint, node: Node) => void): void;
    /**
     * Transforms an array of SourceFiles by passing them through each transformer.
     *
     * @param resolver The emit resolver provided by the checker.
     * @param host The emit host object used to interact with the file system.
     * @param options Compiler options to surface in the `TransformationContext`.
     * @param nodes An array of nodes to transform.
     * @param transforms An array of `TransformerFactory` callbacks.
     * @param allowDtsFiles A value indicating whether to allow the transformation of .d.ts files.
     */
    function transformNodes<T extends Node>(resolver: EmitResolver | undefined, host: EmitHost | undefined, factory: NodeFactory, options: CompilerOptions, nodes: readonly T[], transformers: readonly TransformerFactory<T>[], allowDtsFiles: boolean): TransformationResult<T>;
    const nullTransformationContext: TransformationContext;
}
declare namespace ts {
    interface MethodDeclaration {
        isJumpTarget?: boolean;
    }
    interface ClassLikeDeclarationBase {
        typeNames?: string[];
    }
    interface Block {
        visitedBySorting?: boolean;
    }
    interface VariableDeclaration {
        callerList?: string[];
        delayInitializerList?: Expression[];
    }
    interface CompilerOptions {
        accessorOptimization?: boolean;
        defines?: MapLike<any>;
        emitReflection?: boolean;
        noEmitJs?: boolean;
        reorderFiles?: boolean;
    }
    interface EmitHost {
        getTypeChecker?(): TypeChecker;
    }
    function transformTypeScriptPlus(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle;
}
declare namespace ts {
    function reorderSourceFiles(program: Program): {
        sortedFileNames: string[];
        circularReferences: string[];
    };
}
declare namespace ts {
    function isBuildInfoFile(file: string): boolean;
    /**
     * Iterates over the source files that are expected to have an emit output.
     *
     * @param host An EmitHost.
     * @param action The action to execute.
     * @param sourceFilesOrTargetSourceFile
     *   If an array, the full list of source files to emit.
     *   Else, calls `getSourceFilesToEmit` with the (optional) target source file to determine the list of source files to emit.
     */
    function forEachEmittedFile<T>(host: EmitHost, action: (emitFileNames: EmitFileNames, sourceFileOrBundle: SourceFile | Bundle | undefined) => T, sourceFilesOrTargetSourceFile?: readonly SourceFile[] | SourceFile, forceDtsEmit?: boolean, onlyBuildInfo?: boolean, includeBuildInfo?: boolean): T | undefined;
    function getTsBuildInfoEmitOutputFilePath(options: CompilerOptions): string | undefined;
    function getOutputPathsForBundle(options: CompilerOptions, forceDtsPaths: boolean): EmitFileNames;
    function getOutputPathsFor(sourceFile: SourceFile | Bundle, host: EmitHost, forceDtsPaths: boolean): EmitFileNames;
    function getOutputExtension(sourceFile: SourceFile, options: CompilerOptions): Extension;
    function getOutputDeclarationFileName(inputFileName: string, configFile: ParsedCommandLine, ignoreCase: boolean, getCommonSourceDirectory?: () => string): string;
    function getCommonSourceDirectory(options: CompilerOptions, emittedFiles: () => readonly string[], currentDirectory: string, getCanonicalFileName: GetCanonicalFileName, checkSourceFilesBelongToPath?: (commonSourceDirectory: string) => void): string;
    function getCommonSourceDirectoryOfConfig({ options, fileNames }: ParsedCommandLine, ignoreCase: boolean): string;
    function getAllProjectOutputs(configFile: ParsedCommandLine, ignoreCase: boolean): readonly string[];
    function getOutputFileNames(commandLine: ParsedCommandLine, inputFileName: string, ignoreCase: boolean): readonly string[];
    function getFirstProjectOutput(configFile: ParsedCommandLine, ignoreCase: boolean): string;
    function emitFiles(resolver: EmitResolver, host: EmitHost, targetSourceFile: SourceFile | undefined, { scriptTransformers, declarationTransformers }: EmitTransformers, emitOnlyDtsFiles?: boolean, onlyBuildInfo?: boolean, forceDtsEmit?: boolean): EmitResult;
    function getBuildInfoText(buildInfo: BuildInfo): string;
    function getBuildInfo(buildInfoText: string): BuildInfo;
    const notImplementedResolver: EmitResolver;
    /** File that isnt present resulting in error or output files */
    type EmitUsingBuildInfoResult = string | readonly OutputFile[];
    interface EmitUsingBuildInfoHost extends ModuleResolutionHost {
        getCurrentDirectory(): string;
        getCanonicalFileName(fileName: string): string;
        useCaseSensitiveFileNames(): boolean;
        getNewLine(): string;
    }
    function emitUsingBuildInfo(config: ParsedCommandLine, host: EmitUsingBuildInfoHost, getCommandLine: (ref: ProjectReference) => ParsedCommandLine | undefined, customTransformers?: CustomTransformers): EmitUsingBuildInfoResult;
    function createPrinter(printerOptions?: PrinterOptions, handlers?: PrintHandlers): Printer;
}
declare namespace ts {
    /**
     * Partial interface of the System thats needed to support the caching of directory structure
     */
    export interface DirectoryStructureHost {
        fileExists(path: string): boolean;
        readFile(path: string, encoding?: string): string | undefined;
        directoryExists?(path: string): boolean;
        getDirectories?(path: string): string[];
        readDirectory?(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
        realpath?(path: string): string;
        createDirectory?(path: string): void;
        writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
    }
    interface FileAndDirectoryExistence {
        fileExists: boolean;
        directoryExists: boolean;
    }
    export interface CachedDirectoryStructureHost extends DirectoryStructureHost {
        useCaseSensitiveFileNames: boolean;
        getDirectories(path: string): string[];
        readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
        /** Returns the queried result for the file exists and directory exists if at all it was done */
        addOrDeleteFileOrDirectory(fileOrDirectory: string, fileOrDirectoryPath: Path): FileAndDirectoryExistence | undefined;
        addOrDeleteFile(fileName: string, filePath: Path, eventKind: FileWatcherEventKind): void;
        clearCache(): void;
    }
    export function createCachedDirectoryStructureHost(host: DirectoryStructureHost, currentDirectory: string, useCaseSensitiveFileNames: boolean): CachedDirectoryStructureHost | undefined;
    export enum ConfigFileProgramReloadLevel {
        None = 0,
        /** Update the file name list from the disk */
        Partial = 1,
        /** Reload completely by re-reading contents of config file from disk and updating program */
        Full = 2
    }
    export interface SharedExtendedConfigFileWatcher<T> extends FileWatcher {
        fileWatcher: FileWatcher;
        projects: Set<T>;
    }
    /**
     * Updates the map of shared extended config file watches with a new set of extended config files from a base config file of the project
     */
    export function updateSharedExtendedConfigFileWatcher<T>(projectPath: T, parsed: ParsedCommandLine | undefined, extendedConfigFilesMap: ESMap<Path, SharedExtendedConfigFileWatcher<T>>, createExtendedConfigFileWatch: (extendedConfigPath: string, extendedConfigFilePath: Path) => FileWatcher, toPath: (fileName: string) => Path): void;
    /**
     * Updates the existing missing file watches with the new set of missing files after new program is created
     */
    export function updateMissingFilePathsWatch(program: Program, missingFileWatches: ESMap<Path, FileWatcher>, createMissingFileWatch: (missingFilePath: Path) => FileWatcher): void;
    export interface WildcardDirectoryWatcher {
        watcher: FileWatcher;
        flags: WatchDirectoryFlags;
    }
    /**
     * Updates the existing wild card directory watches with the new set of wild card directories from the config file
     * after new program is created because the config file was reloaded or program was created first time from the config file
     * Note that there is no need to call this function when the program is updated with additional files without reloading config files,
     * as wildcard directories wont change unless reloading config file
     */
    export function updateWatchingWildcardDirectories(existingWatchedForWildcards: ESMap<string, WildcardDirectoryWatcher>, wildcardDirectories: ESMap<string, WatchDirectoryFlags>, watchDirectory: (directory: string, flags: WatchDirectoryFlags) => FileWatcher): void;
    export interface IsIgnoredFileFromWildCardWatchingInput {
        watchedDirPath: Path;
        fileOrDirectory: string;
        fileOrDirectoryPath: Path;
        configFileName: string;
        options: CompilerOptions;
        program: BuilderProgram | Program | undefined;
        extraFileExtensions?: readonly FileExtensionInfo[];
        currentDirectory: string;
        useCaseSensitiveFileNames: boolean;
        writeLog: (s: string) => void;
    }
    export function isIgnoredFileFromWildCardWatching({ watchedDirPath, fileOrDirectory, fileOrDirectoryPath, configFileName, options, program, extraFileExtensions, currentDirectory, useCaseSensitiveFileNames, writeLog, }: IsIgnoredFileFromWildCardWatchingInput): boolean;
    export function isEmittedFileOfProgram(program: Program | undefined, file: string): boolean;
    export enum WatchLogLevel {
        None = 0,
        TriggerOnly = 1,
        Verbose = 2
    }
    export interface WatchFactoryHost {
        watchFile(path: string, callback: FileWatcherCallback, pollingInterval?: number, options?: WatchOptions): FileWatcher;
        watchDirectory(path: string, callback: DirectoryWatcherCallback, recursive?: boolean, options?: WatchOptions): FileWatcher;
        getCurrentDirectory?(): string;
        useCaseSensitiveFileNames: boolean | (() => boolean);
    }
    export interface WatchFactory<X, Y = undefined> {
        watchFile: (file: string, callback: FileWatcherCallback, pollingInterval: PollingInterval, options: WatchOptions | undefined, detailInfo1: X, detailInfo2?: Y) => FileWatcher;
        watchDirectory: (directory: string, callback: DirectoryWatcherCallback, flags: WatchDirectoryFlags, options: WatchOptions | undefined, detailInfo1: X, detailInfo2?: Y) => FileWatcher;
    }
    export type GetDetailWatchInfo<X, Y> = (detailInfo1: X, detailInfo2: Y | undefined) => string;
    export function getWatchFactory<X, Y = undefined>(host: WatchFactoryHost, watchLogLevel: WatchLogLevel, log: (s: string) => void, getDetailWatchInfo?: GetDetailWatchInfo<X, Y>): WatchFactory<X, Y>;
    export function getFallbackOptions(options: WatchOptions | undefined): WatchOptions;
    export function closeFileWatcherOf<T extends {
        watcher: FileWatcher;
    }>(objWithWatcher: T): void;
    export {};
}
declare namespace ts {
    export function findConfigFile(searchPath: string, fileExists: (fileName: string) => boolean, configName?: string): string | undefined;
    export function resolveTripleslashReference(moduleName: string, containingFile: string): string;
    export function computeCommonSourceDirectoryOfFilenames(fileNames: readonly string[], currentDirectory: string, getCanonicalFileName: GetCanonicalFileName): string;
    export function createCompilerHost(options: CompilerOptions, setParentNodes?: boolean): CompilerHost;
    export function createCompilerHostWorker(options: CompilerOptions, setParentNodes?: boolean, system?: System): CompilerHost;
    interface CompilerHostLikeForCache {
        fileExists(fileName: string): boolean;
        readFile(fileName: string, encoding?: string): string | undefined;
        directoryExists?(directory: string): boolean;
        createDirectory?(directory: string): void;
        writeFile?: WriteFileCallback;
    }
    export function changeCompilerHostLikeToUseCache(host: CompilerHostLikeForCache, toPath: (fileName: string) => Path, getSourceFile?: CompilerHost["getSourceFile"]): {
        originalReadFile: (fileName: string, encoding?: string | undefined) => string | undefined;
        originalFileExists: (fileName: string) => boolean;
        originalDirectoryExists: ((directory: string) => boolean) | undefined;
        originalCreateDirectory: ((directory: string) => void) | undefined;
        originalWriteFile: WriteFileCallback | undefined;
        getSourceFileWithCache: ((fileName: string, languageVersion: ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined) => SourceFile | undefined) | undefined;
        readFileWithCache: (fileName: string) => string | undefined;
    };
    export function getPreEmitDiagnostics(program: Program, sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
    export function getPreEmitDiagnostics(program: BuilderProgram, sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
    export interface FormatDiagnosticsHost {
        getCurrentDirectory(): string;
        getCanonicalFileName(fileName: string): string;
        getNewLine(): string;
    }
    export function formatDiagnostics(diagnostics: readonly Diagnostic[], host: FormatDiagnosticsHost): string;
    export function formatDiagnostic(diagnostic: Diagnostic, host: FormatDiagnosticsHost): string;
    /** @internal */
    export enum ForegroundColorEscapeSequences {
        Grey = "\u001B[90m",
        Red = "\u001B[91m",
        Yellow = "\u001B[93m",
        Blue = "\u001B[94m",
        Cyan = "\u001B[96m"
    }
    /** @internal */
    export function formatColorAndReset(text: string, formatStyle: string): string;
    export function formatLocation(file: SourceFile, start: number, host: FormatDiagnosticsHost, color?: typeof formatColorAndReset): string;
    export function formatDiagnosticsWithColorAndContext(diagnostics: readonly Diagnostic[], host: FormatDiagnosticsHost): string;
    export function flattenDiagnosticMessageText(diag: string | DiagnosticMessageChain | undefined, newLine: string, indent?: number): string;
    export function loadWithLocalCache<T>(names: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, loader: (name: string, containingFile: string, redirectedReference: ResolvedProjectReference | undefined) => T): T[];
    export function forEachResolvedProjectReference<T>(resolvedProjectReferences: readonly (ResolvedProjectReference | undefined)[] | undefined, cb: (resolvedProjectReference: ResolvedProjectReference, parent: ResolvedProjectReference | undefined) => T | undefined): T | undefined;
    export const inferredTypesContainingFile = "__inferred type names__.ts";
    export function isReferencedFile(reason: FileIncludeReason | undefined): reason is ReferencedFile;
    export interface ReferenceFileLocation {
        file: SourceFile;
        pos: number;
        end: number;
        packageId: PackageId | undefined;
    }
    export interface SyntheticReferenceFileLocation {
        file: SourceFile;
        packageId: PackageId | undefined;
        text: string;
    }
    export function isReferenceFileLocation(location: ReferenceFileLocation | SyntheticReferenceFileLocation): location is ReferenceFileLocation;
    export function getReferencedFileLocation(getSourceFileByPath: (path: Path) => SourceFile | undefined, ref: ReferencedFile): ReferenceFileLocation | SyntheticReferenceFileLocation;
    /**
     * Determines if program structure is upto date or needs to be recreated
     */
    export function isProgramUptoDate(program: Program | undefined, rootFileNames: string[], newOptions: CompilerOptions, getSourceVersion: (path: Path, fileName: string) => string | undefined, fileExists: (fileName: string) => boolean, hasInvalidatedResolution: HasInvalidatedResolution, hasChangedAutomaticTypeDirectiveNames: HasChangedAutomaticTypeDirectiveNames | undefined, projectReferences: readonly ProjectReference[] | undefined): boolean;
    export function getConfigFileParsingDiagnostics(configFileParseResult: ParsedCommandLine): readonly Diagnostic[];
    /**
     * Create a new 'Program' instance. A Program is an immutable collection of 'SourceFile's and a 'CompilerOptions'
     * that represent a compilation unit.
     *
     * Creating a program proceeds from a set of root files, expanding the set of inputs by following imports and
     * triple-slash-reference-path directives transitively. '@types' and triple-slash-reference-types are also pulled in.
     *
     * @param createProgramOptions - The options for creating a program.
     * @returns A 'Program' object.
     */
    export function createProgram(createProgramOptions: CreateProgramOptions): Program;
    /**
     * Create a new 'Program' instance. A Program is an immutable collection of 'SourceFile's and a 'CompilerOptions'
     * that represent a compilation unit.
     *
     * Creating a program proceeds from a set of root files, expanding the set of inputs by following imports and
     * triple-slash-reference-path directives transitively. '@types' and triple-slash-reference-types are also pulled in.
     *
     * @param rootNames - A set of root files.
     * @param options - The compiler options which should be used.
     * @param host - The host interacts with the underlying file system.
     * @param oldProgram - Reuses an old program structure.
     * @param configFileParsingDiagnostics - error during config file parsing
     * @returns A 'Program' object.
     */
    export function createProgram(rootNames: readonly string[], options: CompilerOptions, host?: CompilerHost, oldProgram?: Program, configFileParsingDiagnostics?: readonly Diagnostic[]): Program;
    export const emitSkippedWithNoDiagnostics: EmitResult;
    export function handleNoEmitOptions<T extends BuilderProgram>(program: Program | T, sourceFile: SourceFile | undefined, writeFile: WriteFileCallback | undefined, cancellationToken: CancellationToken | undefined): EmitResult | undefined;
    export function filterSemanticDiagnotics(diagnostic: readonly Diagnostic[], option: CompilerOptions): readonly Diagnostic[];
    interface CompilerHostLike {
        useCaseSensitiveFileNames(): boolean;
        getCurrentDirectory(): string;
        fileExists(fileName: string): boolean;
        readFile(fileName: string): string | undefined;
        readDirectory?(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[], depth?: number): string[];
        trace?(s: string): void;
        onUnRecoverableConfigFileDiagnostic?: DiagnosticReporter;
    }
    export function parseConfigHostFromCompilerHostLike(host: CompilerHostLike, directoryStructureHost?: DirectoryStructureHost): ParseConfigFileHost;
    /** @deprecated */ export interface ResolveProjectReferencePathHost {
        fileExists(fileName: string): boolean;
    }
    export function createPrependNodes(projectReferences: readonly ProjectReference[] | undefined, getCommandLine: (ref: ProjectReference, index: number) => ParsedCommandLine | undefined, readFile: (path: string) => string | undefined): InputFiles[];
    /**
     * Returns the target config filename of a project reference.
     * Note: The file might not exist.
     */
    export function resolveProjectReferencePath(ref: ProjectReference): ResolvedConfigFileName;
    /** @deprecated */ export function resolveProjectReferencePath(host: ResolveProjectReferencePathHost, ref: ProjectReference): ResolvedConfigFileName;
    /**
     * Returns a DiagnosticMessage if we won't include a resolved module due to its extension.
     * The DiagnosticMessage's parameters are the imported module name, and the filename it resolved to.
     * This returns a diagnostic even if the module will be an untyped module.
     */
    export function getResolutionDiagnostic(options: CompilerOptions, { extension }: ResolvedModuleFull): DiagnosticMessage | undefined;
    export function getModuleNameStringLiteralAt({ imports, moduleAugmentations }: SourceFile, index: number): StringLiteralLike;
    export {};
}
declare namespace ts {
    interface EmitOutput {
        outputFiles: OutputFile[];
        emitSkipped: boolean;
        diagnostics: readonly Diagnostic[];
        exportedModulesFromDeclarationEmit?: ExportedModulesFromDeclarationEmit;
    }
    interface OutputFile {
        name: string;
        writeByteOrderMark: boolean;
        text: string;
    }
}
declare namespace ts {
    function getFileEmitOutput(program: Program, sourceFile: SourceFile, emitOnlyDtsFiles: boolean, cancellationToken?: CancellationToken, customTransformers?: CustomTransformers, forceDtsEmit?: boolean): EmitOutput;
    interface ReusableBuilderState {
        /**
         * Information of the file eg. its version, signature etc
         */
        fileInfos: ReadonlyESMap<Path, BuilderState.FileInfo>;
        /**
         * Contains the map of ReferencedSet=Referenced files of the file if module emit is enabled
         * Otherwise undefined
         * Thus non undefined value indicates, module emit
         */
        readonly referencedMap?: ReadonlyESMap<Path, BuilderState.ReferencedSet> | undefined;
        /**
         * Contains the map of exported modules ReferencedSet=exported module files from the file if module emit is enabled
         * Otherwise undefined
         */
        readonly exportedModulesMap?: ReadonlyESMap<Path, BuilderState.ReferencedSet> | undefined;
    }
    interface BuilderState {
        /**
         * Information of the file eg. its version, signature etc
         */
        fileInfos: ESMap<Path, BuilderState.FileInfo>;
        /**
         * Contains the map of ReferencedSet=Referenced files of the file if module emit is enabled
         * Otherwise undefined
         * Thus non undefined value indicates, module emit
         */
        readonly referencedMap: ReadonlyESMap<Path, BuilderState.ReferencedSet> | undefined;
        /**
         * Contains the map of exported modules ReferencedSet=exported module files from the file if module emit is enabled
         * Otherwise undefined
         */
        readonly exportedModulesMap: ESMap<Path, BuilderState.ReferencedSet> | undefined;
        /**
         * Map of files that have already called update signature.
         * That means hence forth these files are assumed to have
         * no change in their signature for this version of the program
         */
        hasCalledUpdateShapeSignature: Set<Path>;
        /**
         * Cache of all files excluding default library file for the current program
         */
        allFilesExcludingDefaultLibraryFile?: readonly SourceFile[];
        /**
         * Cache of all the file names
         */
        allFileNames?: readonly string[];
    }
    namespace BuilderState {
        /**
         * Information about the source file: Its version and optional signature from last emit
         */
        interface FileInfo {
            readonly version: string;
            signature: string | undefined;
            affectsGlobalScope: boolean;
        }
        /**
         * Referenced files with values for the keys as referenced file's path to be true
         */
        type ReferencedSet = ReadonlySet<Path>;
        /**
         * Compute the hash to store the shape of the file
         */
        type ComputeHash = ((data: string) => string) | undefined;
        /**
         * Exported modules to from declaration emit being computed.
         * This can contain false in the affected file path to specify that there are no exported module(types from other modules) for this file
         */
        type ComputingExportedModulesMap = ESMap<Path, ReferencedSet | false>;
        /**
         * Returns true if oldState is reusable, that is the emitKind = module/non module has not changed
         */
        function canReuseOldState(newReferencedMap: ReadonlyESMap<Path, ReferencedSet> | undefined, oldState: Readonly<ReusableBuilderState> | undefined): boolean | undefined;
        /**
         * Creates the state of file references and signature for the new program from oldState if it is safe
         */
        function create(newProgram: Program, getCanonicalFileName: GetCanonicalFileName, oldState?: Readonly<ReusableBuilderState>): BuilderState;
        /**
         * Releases needed properties
         */
        function releaseCache(state: BuilderState): void;
        /**
         * Creates a clone of the state
         */
        function clone(state: Readonly<BuilderState>): BuilderState;
        /**
         * Gets the files affected by the path from the program
         */
        function getFilesAffectedBy(state: BuilderState, programOfThisState: Program, path: Path, cancellationToken: CancellationToken | undefined, computeHash: ComputeHash, cacheToUpdateSignature?: ESMap<Path, string>, exportedModulesMapCache?: ComputingExportedModulesMap): readonly SourceFile[];
        /**
         * Updates the signatures from the cache into state's fileinfo signatures
         * This should be called whenever it is safe to commit the state of the builder
         */
        function updateSignaturesFromCache(state: BuilderState, signatureCache: ESMap<Path, string>): void;
        function updateSignatureOfFile(state: BuilderState, signature: string | undefined, path: Path): void;
        /**
         * Returns if the shape of the signature has changed since last emit
         */
        function updateShapeSignature(state: Readonly<BuilderState>, programOfThisState: Program, sourceFile: SourceFile, cacheToUpdateSignature: ESMap<Path, string>, cancellationToken: CancellationToken | undefined, computeHash: ComputeHash, exportedModulesMapCache?: ComputingExportedModulesMap): boolean;
        /**
         * Updates the exported modules from cache into state's exported modules map
         * This should be called whenever it is safe to commit the state of the builder
         */
        function updateExportedFilesMapFromCache(state: BuilderState, exportedModulesMapCache: ComputingExportedModulesMap | undefined): void;
        /**
         * Get all the dependencies of the sourceFile
         */
        function getAllDependencies(state: BuilderState, programOfThisState: Program, sourceFile: SourceFile): readonly string[];
        /**
         * Gets the files referenced by the the file path
         */
        function getReferencedByPaths(state: Readonly<BuilderState>, referencedFilePath: Path): Path[];
        /**
         * Gets all files of the program excluding the default library file
         */
        function getAllFilesExcludingDefaultLibraryFile(state: BuilderState, programOfThisState: Program, firstSourceFile: SourceFile | undefined): readonly SourceFile[];
    }
}
declare namespace ts {
    interface ReusableDiagnostic extends ReusableDiagnosticRelatedInformation {
        /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
        reportsUnnecessary?: {};
        reportDeprecated?: {};
        source?: string;
        relatedInformation?: ReusableDiagnosticRelatedInformation[];
        skippedOn?: keyof CompilerOptions;
    }
    interface ReusableDiagnosticRelatedInformation {
        category: DiagnosticCategory;
        code: number;
        file: string | undefined;
        start: number | undefined;
        length: number | undefined;
        messageText: string | ReusableDiagnosticMessageChain;
    }
    type ReusableDiagnosticMessageChain = DiagnosticMessageChain;
    interface ReusableBuilderProgramState extends ReusableBuilderState {
        /**
         * Cache of bind and check diagnostics for files with their Path being the key
         */
        semanticDiagnosticsPerFile?: ReadonlyESMap<Path, readonly ReusableDiagnostic[] | readonly Diagnostic[]> | undefined;
        /**
         * The map has key by source file's path that has been changed
         */
        changedFilesSet?: ReadonlySet<Path>;
        /**
         * Set of affected files being iterated
         */
        affectedFiles?: readonly SourceFile[] | undefined;
        /**
         * Current changed file for iterating over affected files
         */
        currentChangedFilePath?: Path | undefined;
        /**
         * Map of file signatures, with key being file path, calculated while getting current changed file's affected files
         * These will be committed whenever the iteration through affected files of current changed file is complete
         */
        currentAffectedFilesSignatures?: ReadonlyESMap<Path, string> | undefined;
        /**
         * Newly computed visible to outside referencedSet
         */
        currentAffectedFilesExportedModulesMap?: Readonly<BuilderState.ComputingExportedModulesMap> | undefined;
        /**
         * True if the semantic diagnostics were copied from the old state
         */
        semanticDiagnosticsFromOldState?: Set<Path>;
        /**
         * program corresponding to this state
         */
        program?: Program | undefined;
        /**
         * compilerOptions for the program
         */
        compilerOptions: CompilerOptions;
        /**
         * Files pending to be emitted
         */
        affectedFilesPendingEmit?: readonly Path[] | undefined;
        /**
         * Files pending to be emitted kind.
         */
        affectedFilesPendingEmitKind?: ReadonlyESMap<Path, BuilderFileEmit> | undefined;
        /**
         * Current index to retrieve pending affected file
         */
        affectedFilesPendingEmitIndex?: number | undefined;
        hasReusableDiagnostic?: true;
    }
    const enum BuilderFileEmit {
        DtsOnly = 0,
        Full = 1
    }
    /**
     * State to store the changed files, affected files and cache semantic diagnostics
     */
    interface BuilderProgramState extends BuilderState {
        /**
         * Cache of bind and check diagnostics for files with their Path being the key
         */
        semanticDiagnosticsPerFile: ESMap<Path, readonly Diagnostic[]> | undefined;
        /**
         * The map has key by source file's path that has been changed
         */
        changedFilesSet: Set<Path>;
        /**
         * Set of affected files being iterated
         */
        affectedFiles: readonly SourceFile[] | undefined;
        /**
         * Current index to retrieve affected file from
         */
        affectedFilesIndex: number | undefined;
        /**
         * Current changed file for iterating over affected files
         */
        currentChangedFilePath: Path | undefined;
        /**
         * Map of file signatures, with key being file path, calculated while getting current changed file's affected files
         * These will be committed whenever the iteration through affected files of current changed file is complete
         */
        currentAffectedFilesSignatures: ESMap<Path, string> | undefined;
        /**
         * Newly computed visible to outside referencedSet
         */
        currentAffectedFilesExportedModulesMap: BuilderState.ComputingExportedModulesMap | undefined;
        /**
         * Already seen affected files
         */
        seenAffectedFiles: Set<Path> | undefined;
        /**
         * whether this program has cleaned semantic diagnostics cache for lib files
         */
        cleanedDiagnosticsOfLibFiles?: boolean;
        /**
         * True if the semantic diagnostics were copied from the old state
         */
        semanticDiagnosticsFromOldState?: Set<Path>;
        /**
         * program corresponding to this state
         */
        program: Program | undefined;
        /**
         * compilerOptions for the program
         */
        compilerOptions: CompilerOptions;
        /**
         * Files pending to be emitted
         */
        affectedFilesPendingEmit: Path[] | undefined;
        /**
         * Files pending to be emitted kind.
         */
        affectedFilesPendingEmitKind: ESMap<Path, BuilderFileEmit> | undefined;
        /**
         * Current index to retrieve pending affected file
         */
        affectedFilesPendingEmitIndex: number | undefined;
        /**
         * true if build info is emitted
         */
        buildInfoEmitPending: boolean;
        /**
         * Already seen emitted files
         */
        seenEmittedFiles: ESMap<Path, BuilderFileEmit> | undefined;
        /**
         * true if program has been emitted
         */
        programEmitComplete?: true;
    }
    type ProgramBuildInfoDiagnostic = string | [string, readonly ReusableDiagnostic[]];
    type ProgramBuilderInfoFilePendingEmit = [string, BuilderFileEmit];
    interface ProgramBuildInfo {
        fileInfos: MapLike<BuilderState.FileInfo>;
        options: CompilerOptions;
        referencedMap?: MapLike<string[]>;
        exportedModulesMap?: MapLike<string[]>;
        semanticDiagnosticsPerFile?: ProgramBuildInfoDiagnostic[];
        affectedFilesPendingEmit?: ProgramBuilderInfoFilePendingEmit[];
    }
    enum BuilderProgramKind {
        SemanticDiagnosticsBuilderProgram = 0,
        EmitAndSemanticDiagnosticsBuilderProgram = 1
    }
    interface BuilderCreationParameters {
        newProgram: Program;
        host: BuilderProgramHost;
        oldProgram: BuilderProgram | undefined;
        configFileParsingDiagnostics: readonly Diagnostic[];
    }
    function getBuilderCreationParameters(newProgramOrRootNames: Program | readonly string[] | undefined, hostOrOptions: BuilderProgramHost | CompilerOptions | undefined, oldProgramOrHost?: BuilderProgram | CompilerHost, configFileParsingDiagnosticsOrOldProgram?: readonly Diagnostic[] | BuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[]): BuilderCreationParameters;
    function createBuilderProgram(kind: BuilderProgramKind.SemanticDiagnosticsBuilderProgram, builderCreationParameters: BuilderCreationParameters): SemanticDiagnosticsBuilderProgram;
    function createBuilderProgram(kind: BuilderProgramKind.EmitAndSemanticDiagnosticsBuilderProgram, builderCreationParameters: BuilderCreationParameters): EmitAndSemanticDiagnosticsBuilderProgram;
    function createBuildProgramUsingProgramBuildInfo(program: ProgramBuildInfo, buildInfoPath: string, host: ReadBuildProgramHost): EmitAndSemanticDiagnosticsBuilderProgram;
    function createRedirectedBuilderProgram(state: {
        program: Program | undefined;
        compilerOptions: CompilerOptions;
    }, configFileParsingDiagnostics: readonly Diagnostic[]): BuilderProgram;
}
declare namespace ts {
    type AffectedFileResult<T> = {
        result: T;
        affected: SourceFile | Program;
    } | undefined;
    interface BuilderProgramHost {
        /**
         * return true if file names are treated with case sensitivity
         */
        useCaseSensitiveFileNames(): boolean;
        /**
         * If provided this would be used this hash instead of actual file shape text for detecting changes
         */
        createHash?: (data: string) => string;
        /**
         * When emit or emitNextAffectedFile are called without writeFile,
         * this callback if present would be used to write files
         */
        writeFile?: WriteFileCallback;
    }
    /**
     * Builder to manage the program state changes
     */
    interface BuilderProgram {
        getState(): ReusableBuilderProgramState;
        backupState(): void;
        restoreState(): void;
        /**
         * Returns current program
         */
        getProgram(): Program;
        /**
         * Returns current program that could be undefined if the program was released
         */
        getProgramOrUndefined(): Program | undefined;
        /**
         * Releases reference to the program, making all the other operations that need program to fail.
         */
        releaseProgram(): void;
        /**
         * Get compiler options of the program
         */
        getCompilerOptions(): CompilerOptions;
        /**
         * Get the source file in the program with file name
         */
        getSourceFile(fileName: string): SourceFile | undefined;
        /**
         * Get a list of files in the program
         */
        getSourceFiles(): readonly SourceFile[];
        /**
         * Get the diagnostics for compiler options
         */
        getOptionsDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        /**
         * Get the diagnostics that dont belong to any file
         */
        getGlobalDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        /**
         * Get the diagnostics from config file parsing
         */
        getConfigFileParsingDiagnostics(): readonly Diagnostic[];
        /**
         * Get the syntax diagnostics, for all source files if source file is not supplied
         */
        getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        /**
         * Get the declaration diagnostics, for all source files if source file is not supplied
         */
        getDeclarationDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly DiagnosticWithLocation[];
        /**
         * Get all the dependencies of the file
         */
        getAllDependencies(sourceFile: SourceFile): readonly string[];
        /**
         * Gets the semantic diagnostics from the program corresponding to this state of file (if provided) or whole program
         * The semantic diagnostics are cached and managed here
         * Note that it is assumed that when asked about semantic diagnostics through this API,
         * the file has been taken out of affected files so it is safe to use cache or get from program and cache the diagnostics
         * In case of SemanticDiagnosticsBuilderProgram if the source file is not provided,
         * it will iterate through all the affected files, to ensure that cache stays valid and yet provide a way to get all semantic diagnostics
         */
        getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        /**
         * Emits the JavaScript and declaration files.
         * When targetSource file is specified, emits the files corresponding to that source file,
         * otherwise for the whole program.
         * In case of EmitAndSemanticDiagnosticsBuilderProgram, when targetSourceFile is specified,
         * it is assumed that that file is handled from affected file list. If targetSourceFile is not specified,
         * it will only emit all the affected files instead of whole program
         *
         * The first of writeFile if provided, writeFile of BuilderProgramHost if provided, writeFile of compiler host
         * in that order would be used to write the files
         */
        emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
        emitBuildInfo(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken): EmitResult;
        /**
         * Get the current directory of the program
         */
        getCurrentDirectory(): string;
        close(): void;
    }
    /**
     * The builder that caches the semantic diagnostics for the program and handles the changed files and affected files
     */
    interface SemanticDiagnosticsBuilderProgram extends BuilderProgram {
        /**
         * Gets the semantic diagnostics from the program for the next affected file and caches it
         * Returns undefined if the iteration is complete
         */
        getSemanticDiagnosticsOfNextAffectedFile(cancellationToken?: CancellationToken, ignoreSourceFile?: (sourceFile: SourceFile) => boolean): AffectedFileResult<readonly Diagnostic[]>;
    }
    /**
     * The builder that can handle the changes in program and iterate through changed file to emit the files
     * The semantic diagnostics are cached per file and managed by clearing for the changed/affected files
     */
    interface EmitAndSemanticDiagnosticsBuilderProgram extends SemanticDiagnosticsBuilderProgram {
        /**
         * Emits the next affected file's emit result (EmitResult and sourceFiles emitted) or returns undefined if iteration is complete
         * The first of writeFile if provided, writeFile of BuilderProgramHost if provided, writeFile of compiler host
         * in that order would be used to write the files
         */
        emitNextAffectedFile(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): AffectedFileResult<EmitResult>;
    }
    /**
     * Create the builder to manage semantic diagnostics and cache them
     */
    function createSemanticDiagnosticsBuilderProgram(newProgram: Program, host: BuilderProgramHost, oldProgram?: SemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[]): SemanticDiagnosticsBuilderProgram;
    function createSemanticDiagnosticsBuilderProgram(rootNames: readonly string[] | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: SemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[]): SemanticDiagnosticsBuilderProgram;
    /**
     * Create the builder that can handle the changes in program and iterate through changed files
     * to emit the those files and manage semantic diagnostics cache as well
     */
    function createEmitAndSemanticDiagnosticsBuilderProgram(newProgram: Program, host: BuilderProgramHost, oldProgram?: EmitAndSemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[]): EmitAndSemanticDiagnosticsBuilderProgram;
    function createEmitAndSemanticDiagnosticsBuilderProgram(rootNames: readonly string[] | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: EmitAndSemanticDiagnosticsBuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[]): EmitAndSemanticDiagnosticsBuilderProgram;
    /**
     * Creates a builder thats just abstraction over program and can be used with watch
     */
    function createAbstractBuilder(newProgram: Program, host: BuilderProgramHost, oldProgram?: BuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[]): BuilderProgram;
    function createAbstractBuilder(rootNames: readonly string[] | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: BuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[]): BuilderProgram;
}
declare namespace ts {
    /** This is the cache of module/typedirectives resolution that can be retained across program */
    export interface ResolutionCache {
        startRecordingFilesWithChangedResolutions(): void;
        finishRecordingFilesWithChangedResolutions(): Path[] | undefined;
        resolveModuleNames(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference?: ResolvedProjectReference): (ResolvedModuleFull | undefined)[];
        getResolvedModuleWithFailedLookupLocationsFromCache(moduleName: string, containingFile: string): CachedResolvedModuleWithFailedLookupLocations | undefined;
        resolveTypeReferenceDirectives(typeDirectiveNames: string[], containingFile: string, redirectedReference?: ResolvedProjectReference): (ResolvedTypeReferenceDirective | undefined)[];
        invalidateResolutionsOfFailedLookupLocations(): boolean;
        invalidateResolutionOfFile(filePath: Path): void;
        removeResolutionsOfFile(filePath: Path): void;
        removeResolutionsFromProjectReferenceRedirects(filePath: Path): void;
        setFilesWithInvalidatedNonRelativeUnresolvedImports(filesWithUnresolvedImports: ESMap<Path, readonly string[]>): void;
        createHasInvalidatedResolution(forceAllFilesAsInvalidated?: boolean): HasInvalidatedResolution;
        hasChangedAutomaticTypeDirectiveNames(): boolean;
        isFileWithInvalidatedNonRelativeUnresolvedImports(path: Path): boolean;
        startCachingPerDirectoryResolution(): void;
        finishCachingPerDirectoryResolution(): void;
        updateTypeRootsWatch(): void;
        closeTypeRootsWatch(): void;
        clear(): void;
    }
    interface ResolutionWithFailedLookupLocations {
        readonly failedLookupLocations: string[];
        isInvalidated?: boolean;
        refCount?: number;
        files?: Path[];
    }
    interface CachedResolvedModuleWithFailedLookupLocations extends ResolvedModuleWithFailedLookupLocations, ResolutionWithFailedLookupLocations {
    }
    export interface ResolutionCacheHost extends ModuleResolutionHost {
        toPath(fileName: string): Path;
        getCanonicalFileName: GetCanonicalFileName;
        getCompilationSettings(): CompilerOptions;
        watchDirectoryOfFailedLookupLocation(directory: string, cb: DirectoryWatcherCallback, flags: WatchDirectoryFlags): FileWatcher;
        onInvalidatedResolution(): void;
        watchTypeRootsDirectory(directory: string, cb: DirectoryWatcherCallback, flags: WatchDirectoryFlags): FileWatcher;
        onChangedAutomaticTypeDirectiveNames(): void;
        scheduleInvalidateResolutionsOfFailedLookupLocations(): void;
        getCachedDirectoryStructureHost(): CachedDirectoryStructureHost | undefined;
        projectName?: string;
        getGlobalCache?(): string | undefined;
        globalCacheResolutionModuleName?(externalModuleName: string): string;
        writeLog(s: string): void;
        getCurrentProgram(): Program | undefined;
        fileIsOpen(filePath: Path): boolean;
        getCompilerHost?(): CompilerHost | undefined;
    }
    export function removeIgnoredPath(path: Path): Path | undefined;
    /**
     * Filter out paths like
     * "/", "/user", "/user/username", "/user/username/folderAtRoot",
     * "c:/", "c:/users", "c:/users/username", "c:/users/username/folderAtRoot", "c:/folderAtRoot"
     * @param dirPath
     */
    export function canWatchDirectory(dirPath: Path): boolean;
    export function createResolutionCache(resolutionHost: ResolutionCacheHost, rootDirForResolution: string | undefined, logChangesWhenResolvingModule: boolean): ResolutionCache;
    export {};
}
declare namespace ts.moduleSpecifiers {
    function updateModuleSpecifier(compilerOptions: CompilerOptions, importingSourceFileName: Path, toFileName: string, host: ModuleSpecifierResolutionHost, oldImportSpecifier: string): string | undefined;
    function getModuleSpecifier(compilerOptions: CompilerOptions, importingSourceFile: SourceFile, importingSourceFileName: Path, toFileName: string, host: ModuleSpecifierResolutionHost, preferences?: UserPreferences): string;
    function getNodeModulesPackageName(compilerOptions: CompilerOptions, importingSourceFileName: Path, nodeModulesFileName: string, host: ModuleSpecifierResolutionHost): string | undefined;
    /** Returns an import for each symlink and for the realpath. */
    function getModuleSpecifiers(moduleSymbol: Symbol, checker: TypeChecker, compilerOptions: CompilerOptions, importingSourceFile: SourceFile, host: ModuleSpecifierResolutionHost, userPreferences: UserPreferences): readonly string[];
    function countPathComponents(path: string): number;
    function forEachFileNameOfModule<T>(importingFileName: string, importedFileName: string, host: ModuleSpecifierResolutionHost, preferSymlinks: boolean, cb: (fileName: string, isRedirect: boolean) => T | undefined): T | undefined;
}
declare namespace ts {
    /**
     * Create a function that reports error by writing to the system and handles the formating of the diagnostic
     */
    export function createDiagnosticReporter(system: System, pretty?: boolean): DiagnosticReporter;
    export const screenStartingMessageCodes: number[];
    /**
     * Get locale specific time based on whether we are in test mode
     */
    export function getLocaleTimeString(system: System): string;
    /**
     * Create a function that reports watch status by writing to the system and handles the formating of the diagnostic
     */
    export function createWatchStatusReporter(system: System, pretty?: boolean): WatchStatusReporter;
    /** Parses config file using System interface */
    export function parseConfigFileWithSystem(configFileName: string, optionsToExtend: CompilerOptions, watchOptionsToExtend: WatchOptions | undefined, system: System, reportDiagnostic: DiagnosticReporter): ParsedCommandLine | undefined;
    export function getErrorCountForSummary(diagnostics: readonly Diagnostic[]): number;
    export function getWatchErrorSummaryDiagnosticMessage(errorCount: number): DiagnosticMessage;
    export function getErrorSummaryText(errorCount: number, newLine: string): string;
    export function isBuilderProgram<T extends BuilderProgram>(program: Program | T): program is T;
    export function listFiles<T extends BuilderProgram>(program: Program | T, write: (s: string) => void): void;
    export function explainFiles(program: Program, write: (s: string) => void): void;
    export function explainIfFileIsRedirect(file: SourceFile, fileNameConvertor?: (fileName: string) => string): DiagnosticMessageChain[] | undefined;
    export function getMatchedFileSpec(program: Program, fileName: string): string | undefined;
    export function getMatchedIncludeSpec(program: Program, fileName: string): string | undefined;
    export function fileIncludeReasonToDiagnostics(program: Program, reason: FileIncludeReason, fileNameConvertor?: (fileName: string) => string): DiagnosticMessageChain;
    /**
     * Helper that emit files, report diagnostics and lists emitted and/or source files depending on compiler options
     */
    export function emitFilesAndReportErrors<T extends BuilderProgram>(program: Program | T, reportDiagnostic: DiagnosticReporter, write?: (s: string) => void, reportSummary?: ReportEmitErrorSummary, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): {
        emitResult: EmitResult;
        diagnostics: SortedReadonlyArray<Diagnostic>;
    };
    export function emitFilesAndReportErrorsAndGetExitStatus<T extends BuilderProgram>(program: Program | T, reportDiagnostic: DiagnosticReporter, write?: (s: string) => void, reportSummary?: ReportEmitErrorSummary, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): ExitStatus.Success | ExitStatus.DiagnosticsPresent_OutputsSkipped | ExitStatus.DiagnosticsPresent_OutputsGenerated;
    export const noopFileWatcher: FileWatcher;
    export const returnNoopFileWatcher: () => FileWatcher;
    export function createWatchHost(system?: System, reportWatchStatus?: WatchStatusReporter): WatchHost;
    export type WatchType = WatchTypeRegistry[keyof WatchTypeRegistry];
    export const WatchType: WatchTypeRegistry;
    export interface WatchTypeRegistry {
        ConfigFile: "Config file";
        ExtendedConfigFile: "Extended config file";
        SourceFile: "Source file";
        MissingFile: "Missing file";
        WildcardDirectory: "Wild card directory";
        FailedLookupLocations: "Failed Lookup Locations";
        TypeRoots: "Type roots";
    }
    interface WatchFactory<X, Y = undefined> extends ts.WatchFactory<X, Y> {
        writeLog: (s: string) => void;
    }
    export function createWatchFactory<Y = undefined>(host: WatchFactoryHost & {
        trace?(s: string): void;
    }, options: {
        extendedDiagnostics?: boolean;
        diagnostics?: boolean;
    }): WatchFactory<WatchType, Y>;
    export function createCompilerHostFromProgramHost(host: ProgramHost<any>, getCompilerOptions: () => CompilerOptions, directoryStructureHost?: DirectoryStructureHost): CompilerHost;
    export function setGetSourceFileAsHashVersioned(compilerHost: CompilerHost, host: {
        createHash?(data: string): string;
    }): void;
    /**
     * Creates the watch compiler host that can be extended with config file or root file names and options host
     */
    export function createProgramHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system: System, createProgram: CreateProgram<T> | undefined): ProgramHost<T>;
    export interface CreateWatchCompilerHostInput<T extends BuilderProgram> {
        system: System;
        createProgram?: CreateProgram<T>;
        reportDiagnostic?: DiagnosticReporter;
        reportWatchStatus?: WatchStatusReporter;
    }
    export interface CreateWatchCompilerHostOfConfigFileInput<T extends BuilderProgram> extends CreateWatchCompilerHostInput<T> {
        configFileName: string;
        optionsToExtend?: CompilerOptions;
        watchOptionsToExtend?: WatchOptions;
        extraFileExtensions?: readonly FileExtensionInfo[];
    }
    /**
     * Creates the watch compiler host from system for config file in watch mode
     */
    export function createWatchCompilerHostOfConfigFile<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>({ configFileName, optionsToExtend, watchOptionsToExtend, extraFileExtensions, system, createProgram, reportDiagnostic, reportWatchStatus }: CreateWatchCompilerHostOfConfigFileInput<T>): WatchCompilerHostOfConfigFile<T>;
    export interface CreateWatchCompilerHostOfFilesAndCompilerOptionsInput<T extends BuilderProgram> extends CreateWatchCompilerHostInput<T> {
        rootFiles: string[];
        options: CompilerOptions;
        watchOptions: WatchOptions | undefined;
        projectReferences?: readonly ProjectReference[];
    }
    /**
     * Creates the watch compiler host from system for compiling root files and options in watch mode
     */
    export function createWatchCompilerHostOfFilesAndCompilerOptions<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>({ rootFiles, options, watchOptions, projectReferences, system, createProgram, reportDiagnostic, reportWatchStatus }: CreateWatchCompilerHostOfFilesAndCompilerOptionsInput<T>): WatchCompilerHostOfFilesAndCompilerOptions<T>;
    export interface IncrementalCompilationOptions {
        rootNames: readonly string[];
        options: CompilerOptions;
        configFileParsingDiagnostics?: readonly Diagnostic[];
        projectReferences?: readonly ProjectReference[];
        host?: CompilerHost;
        reportDiagnostic?: DiagnosticReporter;
        reportErrorSummary?: ReportEmitErrorSummary;
        afterProgramEmitAndDiagnostics?(program: EmitAndSemanticDiagnosticsBuilderProgram): void;
        system?: System;
    }
    export function performIncrementalCompilation(input: IncrementalCompilationOptions): ExitStatus.Success | ExitStatus.DiagnosticsPresent_OutputsSkipped | ExitStatus.DiagnosticsPresent_OutputsGenerated;
    export {};
}
declare namespace ts {
    interface ReadBuildProgramHost {
        useCaseSensitiveFileNames(): boolean;
        getCurrentDirectory(): string;
        readFile(fileName: string): string | undefined;
    }
    function readBuilderProgram(compilerOptions: CompilerOptions, host: ReadBuildProgramHost): EmitAndSemanticDiagnosticsBuilderProgram | undefined;
    function createIncrementalCompilerHost(options: CompilerOptions, system?: System): CompilerHost;
    interface IncrementalProgramOptions<T extends BuilderProgram> {
        rootNames: readonly string[];
        options: CompilerOptions;
        configFileParsingDiagnostics?: readonly Diagnostic[];
        projectReferences?: readonly ProjectReference[];
        host?: CompilerHost;
        createProgram?: CreateProgram<T>;
    }
    function createIncrementalProgram<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>({ rootNames, options, configFileParsingDiagnostics, projectReferences, host, createProgram }: IncrementalProgramOptions<T>): T;
    type WatchStatusReporter = (diagnostic: Diagnostic, newLine: string, options: CompilerOptions, errorCount?: number) => void;
    /** Create the program with rootNames and options, if they are undefined, oldProgram and new configFile diagnostics create new program */
    type CreateProgram<T extends BuilderProgram> = (rootNames: readonly string[] | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: T, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[] | undefined) => T;
    /** Host that has watch functionality used in --watch mode */
    interface WatchHost {
        /** If provided, called with Diagnostic message that informs about change in watch status */
        onWatchStatusChange?(diagnostic: Diagnostic, newLine: string, options: CompilerOptions, errorCount?: number): void;
        /** Used to watch changes in source files, missing files needed to update the program or config file */
        watchFile(path: string, callback: FileWatcherCallback, pollingInterval?: number, options?: CompilerOptions): FileWatcher;
        /** Used to watch resolved module's failed lookup locations, config file specs, type roots where auto type reference directives are added */
        watchDirectory(path: string, callback: DirectoryWatcherCallback, recursive?: boolean, options?: CompilerOptions): FileWatcher;
        /** If provided, will be used to set delayed compilation, so that multiple changes in short span are compiled together */
        setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
        /** If provided, will be used to reset existing delayed compilation */
        clearTimeout?(timeoutId: any): void;
    }
    interface ProgramHost<T extends BuilderProgram> {
        /**
         * Used to create the program when need for program creation or recreation detected
         */
        createProgram: CreateProgram<T>;
        useCaseSensitiveFileNames(): boolean;
        getNewLine(): string;
        getCurrentDirectory(): string;
        getDefaultLibFileName(options: CompilerOptions): string;
        getDefaultLibLocation?(): string;
        createHash?(data: string): string;
        /**
         * Use to check file presence for source files and
         * if resolveModuleNames is not provided (complier is in charge of module resolution) then module files as well
         */
        fileExists(path: string): boolean;
        /**
         * Use to read file text for source files and
         * if resolveModuleNames is not provided (complier is in charge of module resolution) then module files as well
         */
        readFile(path: string, encoding?: string): string | undefined;
        /** If provided, used for module resolution as well as to handle directory structure */
        directoryExists?(path: string): boolean;
        /** If provided, used in resolutions as well as handling directory structure */
        getDirectories?(path: string): string[];
        /** If provided, used to cache and handle directory structure modifications */
        readDirectory?(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
        /** Symbol links resolution */
        realpath?(path: string): string;
        /** If provided would be used to write log about compilation */
        trace?(s: string): void;
        /** If provided is used to get the environment variable */
        getEnvironmentVariable?(name: string): string | undefined;
        /** If provided, used to resolve the module names, otherwise typescript's default module resolution */
        resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
        /** If provided, used to resolve type reference directives, otherwise typescript's default resolution */
        resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
    }
    /** Internal interface used to wire emit through same host */
    interface ProgramHost<T extends BuilderProgram> {
        createDirectory?(path: string): void;
        writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
    }
    interface WatchCompilerHost<T extends BuilderProgram> extends ProgramHost<T>, WatchHost {
        /** Instead of using output d.ts file from project reference, use its source file */
        useSourceOfProjectReferenceRedirect?(): boolean;
        /** If provided, callback to invoke after every new program creation */
        afterProgramCreate?(program: T): void;
    }
    /**
     * Host to create watch with root files and options
     */
    interface WatchCompilerHostOfFilesAndCompilerOptions<T extends BuilderProgram> extends WatchCompilerHost<T> {
        /** root files to use to generate program */
        rootFiles: string[];
        /** Compiler options */
        options: CompilerOptions;
        watchOptions?: WatchOptions;
        /** Project References */
        projectReferences?: readonly ProjectReference[];
    }
    /**
     * Host to create watch with config file
     */
    interface WatchCompilerHostOfConfigFile<T extends BuilderProgram> extends WatchCompilerHost<T>, ConfigFileDiagnosticsReporter {
        /** Name of the config file to compile */
        configFileName: string;
        /** Options to extend */
        optionsToExtend?: CompilerOptions;
        watchOptionsToExtend?: WatchOptions;
        extraFileExtensions?: readonly FileExtensionInfo[];
        /**
         * Used to generate source file names from the config file and its include, exclude, files rules
         * and also to cache the directory stucture
         */
        readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
    }
    /**
     * Host to create watch with config file that is already parsed (from tsc)
     */
    interface WatchCompilerHostOfConfigFile<T extends BuilderProgram> extends WatchCompilerHost<T> {
        configFileParsingResult?: ParsedCommandLine;
    }
    interface Watch<T> {
        /** Synchronize with host and get updated program */
        getProgram(): T;
        /** Gets the existing program without synchronizing with changes on host */
        getCurrentProgram(): T;
        /** Closes the watch */
        close(): void;
    }
    /**
     * Creates the watch what generates program using the config file
     */
    interface WatchOfConfigFile<T> extends Watch<T> {
    }
    /**
     * Creates the watch that generates program using the root files and compiler options
     */
    interface WatchOfFilesAndCompilerOptions<T> extends Watch<T> {
        /** Updates the root files in the program, only if this is not config file compilation */
        updateRootFileNames(fileNames: string[]): void;
    }
    /**
     * Create the watch compiler host for either configFile or fileNames and its options
     */
    function createWatchCompilerHost<T extends BuilderProgram>(configFileName: string, optionsToExtend: CompilerOptions | undefined, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, watchOptionsToExtend?: WatchOptions, extraFileExtensions?: readonly FileExtensionInfo[]): WatchCompilerHostOfConfigFile<T>;
    function createWatchCompilerHost<T extends BuilderProgram>(rootFiles: string[], options: CompilerOptions, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, projectReferences?: readonly ProjectReference[], watchOptions?: WatchOptions): WatchCompilerHostOfFilesAndCompilerOptions<T>;
    /**
     * Creates the watch from the host for root files and compiler options
     */
    function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfFilesAndCompilerOptions<T>): WatchOfFilesAndCompilerOptions<T>;
    /**
     * Creates the watch from the host for config file
     */
    function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfConfigFile<T>): WatchOfConfigFile<T>;
}
declare namespace ts {
    enum UpToDateStatusType {
        Unbuildable = 0,
        UpToDate = 1,
        /**
         * The project appears out of date because its upstream inputs are newer than its outputs,
         * but all of its outputs are actually newer than the previous identical outputs of its (.d.ts) inputs.
         * This means we can Pseudo-build (just touch timestamps), as if we had actually built this project.
         */
        UpToDateWithUpstreamTypes = 2,
        /**
         * The project appears out of date because its upstream inputs are newer than its outputs,
         * but all of its outputs are actually newer than the previous identical outputs of its (.d.ts) inputs.
         * This means we can Pseudo-build (just manipulate outputs), as if we had actually built this project.
         */
        OutOfDateWithPrepend = 3,
        OutputMissing = 4,
        OutOfDateWithSelf = 5,
        OutOfDateWithUpstream = 6,
        UpstreamOutOfDate = 7,
        UpstreamBlocked = 8,
        ComputingUpstream = 9,
        TsVersionOutputOfDate = 10,
        /**
         * Projects with no outputs (i.e. "solution" files)
         */
        ContainerOnly = 11
    }
    type UpToDateStatus = Status.Unbuildable | Status.UpToDate | Status.OutOfDateWithPrepend | Status.OutputMissing | Status.OutOfDateWithSelf | Status.OutOfDateWithUpstream | Status.UpstreamOutOfDate | Status.UpstreamBlocked | Status.ComputingUpstream | Status.TsVersionOutOfDate | Status.ContainerOnly;
    namespace Status {
        /**
         * The project can't be built at all in its current state. For example,
         * its config file cannot be parsed, or it has a syntax error or missing file
         */
        interface Unbuildable {
            type: UpToDateStatusType.Unbuildable;
            reason: string;
        }
        /**
         * This project doesn't have any outputs, so "is it up to date" is a meaningless question.
         */
        interface ContainerOnly {
            type: UpToDateStatusType.ContainerOnly;
        }
        /**
         * The project is up to date with respect to its inputs.
         * We track what the newest input file is.
         */
        interface UpToDate {
            type: UpToDateStatusType.UpToDate | UpToDateStatusType.UpToDateWithUpstreamTypes;
            newestInputFileTime?: Date;
            newestInputFileName?: string;
            newestDeclarationFileContentChangedTime?: Date;
            newestOutputFileTime?: Date;
            newestOutputFileName?: string;
            oldestOutputFileName: string;
        }
        /**
         * The project is up to date with respect to its inputs except for prepend output changed (no declaration file change in prepend).
         */
        interface OutOfDateWithPrepend {
            type: UpToDateStatusType.OutOfDateWithPrepend;
            outOfDateOutputFileName: string;
            newerProjectName: string;
        }
        /**
         * One or more of the outputs of the project does not exist.
         */
        interface OutputMissing {
            type: UpToDateStatusType.OutputMissing;
            /**
             * The name of the first output file that didn't exist
             */
            missingOutputFileName: string;
        }
        /**
         * One or more of the project's outputs is older than its newest input.
         */
        interface OutOfDateWithSelf {
            type: UpToDateStatusType.OutOfDateWithSelf;
            outOfDateOutputFileName: string;
            newerInputFileName: string;
        }
        /**
         * This project depends on an out-of-date project, so shouldn't be built yet
         */
        interface UpstreamOutOfDate {
            type: UpToDateStatusType.UpstreamOutOfDate;
            upstreamProjectName: string;
        }
        /**
         * This project depends an upstream project with build errors
         */
        interface UpstreamBlocked {
            type: UpToDateStatusType.UpstreamBlocked;
            upstreamProjectName: string;
            upstreamProjectBlocked: boolean;
        }
        /**
         *  Computing status of upstream projects referenced
         */
        interface ComputingUpstream {
            type: UpToDateStatusType.ComputingUpstream;
        }
        interface TsVersionOutOfDate {
            type: UpToDateStatusType.TsVersionOutputOfDate;
            version: string;
        }
        /**
         * One or more of the project's outputs is older than the newest output of
         * an upstream project.
         */
        interface OutOfDateWithUpstream {
            type: UpToDateStatusType.OutOfDateWithUpstream;
            outOfDateOutputFileName: string;
            newerProjectName: string;
        }
    }
    function resolveConfigFileProjectName(project: string): ResolvedConfigFileName;
}
declare namespace ts {
    interface BuildOptions {
        dry?: boolean;
        force?: boolean;
        verbose?: boolean;
        clean?: boolean;
        watch?: boolean;
        help?: boolean;
        preserveWatchOutput?: boolean;
        listEmittedFiles?: boolean;
        listFiles?: boolean;
        explainFiles?: boolean;
        pretty?: boolean;
        incremental?: boolean;
        assumeChangesOnlyAffectDirectDependencies?: boolean;
        traceResolution?: boolean;
        diagnostics?: boolean;
        extendedDiagnostics?: boolean;
        locale?: string;
        generateCpuProfile?: string;
        generateTrace?: string;
        [option: string]: CompilerOptionsValue | undefined;
    }
    type ResolvedConfigFilePath = ResolvedConfigFileName & Path;
    type ReportEmitErrorSummary = (errorCount: number) => void;
    interface SolutionBuilderHostBase<T extends BuilderProgram> extends ProgramHost<T> {
        createDirectory?(path: string): void;
        /**
         * Should provide create directory and writeFile if done of invalidatedProjects is not invoked with
         * writeFileCallback
         */
        writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
        getModifiedTime(fileName: string): Date | undefined;
        setModifiedTime(fileName: string, date: Date): void;
        deleteFile(fileName: string): void;
        getParsedCommandLine?(fileName: string): ParsedCommandLine | undefined;
        reportDiagnostic: DiagnosticReporter;
        reportSolutionBuilderStatus: DiagnosticReporter;
        afterProgramEmitAndDiagnostics?(program: T): void;
        afterEmitBundle?(config: ParsedCommandLine): void;
        now?(): Date;
    }
    interface SolutionBuilderHost<T extends BuilderProgram> extends SolutionBuilderHostBase<T> {
        reportErrorSummary?: ReportEmitErrorSummary;
    }
    interface SolutionBuilderWithWatchHost<T extends BuilderProgram> extends SolutionBuilderHostBase<T>, WatchHost {
    }
    type BuildOrder = readonly ResolvedConfigFileName[];
    interface CircularBuildOrder {
        buildOrder: BuildOrder;
        circularDiagnostics: readonly Diagnostic[];
    }
    type AnyBuildOrder = BuildOrder | CircularBuildOrder;
    function isCircularBuildOrder(buildOrder: AnyBuildOrder): buildOrder is CircularBuildOrder;
    function getBuildOrderFromAnyBuildOrder(anyBuildOrder: AnyBuildOrder): BuildOrder;
    interface SolutionBuilder<T extends BuilderProgram> {
        build(project?: string, cancellationToken?: CancellationToken): ExitStatus;
        clean(project?: string): ExitStatus;
        buildReferences(project: string, cancellationToken?: CancellationToken): ExitStatus;
        cleanReferences(project?: string): ExitStatus;
        getNextInvalidatedProject(cancellationToken?: CancellationToken): InvalidatedProject<T> | undefined;
        getBuildOrder(): AnyBuildOrder;
        getUpToDateStatusOfProject(project: string): UpToDateStatus;
        invalidateProject(configFilePath: ResolvedConfigFilePath, reloadLevel?: ConfigFileProgramReloadLevel): void;
        buildNextInvalidatedProject(): void;
        getAllParsedConfigs(): readonly ParsedCommandLine[];
        close(): void;
    }
    /**
     * Create a function that reports watch status by writing to the system and handles the formating of the diagnostic
     */
    function createBuilderStatusReporter(system: System, pretty?: boolean): DiagnosticReporter;
    function createSolutionBuilderHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system?: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportSolutionBuilderStatus?: DiagnosticReporter, reportErrorSummary?: ReportEmitErrorSummary): SolutionBuilderHost<T>;
    function createSolutionBuilderWithWatchHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system?: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportSolutionBuilderStatus?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): SolutionBuilderWithWatchHost<T>;
    function createSolutionBuilder<T extends BuilderProgram>(host: SolutionBuilderHost<T>, rootNames: readonly string[], defaultOptions: BuildOptions): SolutionBuilder<T>;
    function createSolutionBuilderWithWatch<T extends BuilderProgram>(host: SolutionBuilderWithWatchHost<T>, rootNames: readonly string[], defaultOptions: BuildOptions, baseWatchOptions?: WatchOptions): SolutionBuilder<T>;
    enum InvalidatedProjectKind {
        Build = 0,
        UpdateBundle = 1,
        UpdateOutputFileStamps = 2
    }
    interface InvalidatedProjectBase {
        readonly kind: InvalidatedProjectKind;
        readonly project: ResolvedConfigFileName;
        readonly projectPath: ResolvedConfigFilePath;
        readonly buildOrder: readonly ResolvedConfigFileName[];
        /**
         *  To dispose this project and ensure that all the necessary actions are taken and state is updated accordingly
         */
        done(cancellationToken?: CancellationToken, writeFile?: WriteFileCallback, customTransformers?: CustomTransformers): ExitStatus;
        getCompilerOptions(): CompilerOptions;
        getCurrentDirectory(): string;
    }
    interface UpdateOutputFileStampsProject extends InvalidatedProjectBase {
        readonly kind: InvalidatedProjectKind.UpdateOutputFileStamps;
        updateOutputFileStatmps(): void;
    }
    interface BuildInvalidedProject<T extends BuilderProgram> extends InvalidatedProjectBase {
        readonly kind: InvalidatedProjectKind.Build;
        getBuilderProgram(): T | undefined;
        getProgram(): Program | undefined;
        getSourceFile(fileName: string): SourceFile | undefined;
        getSourceFiles(): readonly SourceFile[];
        getOptionsDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        getGlobalDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        getConfigFileParsingDiagnostics(): readonly Diagnostic[];
        getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        getAllDependencies(sourceFile: SourceFile): readonly string[];
        getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        getSemanticDiagnosticsOfNextAffectedFile(cancellationToken?: CancellationToken, ignoreSourceFile?: (sourceFile: SourceFile) => boolean): AffectedFileResult<readonly Diagnostic[]>;
        emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult | undefined;
    }
    interface UpdateBundleProject<T extends BuilderProgram> extends InvalidatedProjectBase {
        readonly kind: InvalidatedProjectKind.UpdateBundle;
        emit(writeFile?: WriteFileCallback, customTransformers?: CustomTransformers): EmitResult | BuildInvalidedProject<T> | undefined;
    }
    type InvalidatedProject<T extends BuilderProgram> = UpdateOutputFileStampsProject | BuildInvalidedProject<T> | UpdateBundleProject<T>;
}
//# sourceMappingURL=compiler.d.ts.map