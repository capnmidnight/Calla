import { TypedEvent, TypedEventBase } from "../events/EventBase";
export declare class LRUCacheItemEvicted<KeyT, ValueT> extends TypedEvent<"itemevicted"> {
    readonly key: KeyT;
    readonly value: ValueT;
    constructor(key: KeyT, value: ValueT);
}
export declare class LRUCache<KeyT, ValueT> extends TypedEventBase<{
    itemevicted: LRUCacheItemEvicted<KeyT, ValueT>;
}> {
    size: number;
    map: Map<KeyT, ValueT>;
    usage: KeyT[];
    private removed;
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
