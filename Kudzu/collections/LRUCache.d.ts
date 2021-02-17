export declare class LRUCache<KeyT, ValueT> {
    size: number;
    map: Map<KeyT, ValueT>;
    usage: KeyT[];
    constructor(size: number);
    set(key: KeyT, value: ValueT): Map<KeyT, ValueT>;
    has(key: KeyT): boolean;
    get(key: KeyT): ValueT;
    delete(key: KeyT): boolean;
    clear(): void;
    keys(): IterableIterator<KeyT>;
    values(): IterableIterator<ValueT>;
    entries(): IterableIterator<[KeyT, ValueT]>;
}
