import { arrayClear } from "../arrays/arrayClear";
import { arrayRemove } from "../arrays/arrayRemove";
import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { isDefined } from "../typeChecks";

export class LRUCacheItemEvicted<KeyT, ValueT> extends TypedEvent<"itemevicted">
{
    constructor(public readonly key: KeyT, public readonly value: ValueT) {
        super("itemevicted");
    }
}

export class LRUCache<KeyT, ValueT> extends TypedEventBase<{
    itemevicted: LRUCacheItemEvicted<KeyT, ValueT>;
}>{
    map = new Map<KeyT, ValueT>();
    usage = new Array<KeyT>();

    private removed = new Map<KeyT, ValueT>();

    constructor(public size: number) {
        super();
    }

    set(key: KeyT, value: ValueT) {
        this.usage.push(key);
        while (this.usage.length > this.size) {
            const toDelete = this.usage.shift();
            if (isDefined(toDelete)) {
                this.removed.set(toDelete, this.map.get(toDelete));
                this.map.delete(toDelete);
            }
        }
        this.removed.delete(key);
        for (const [key, value] of this.removed) {
            this.dispatchEvent(new LRUCacheItemEvicted(key, value));
        }
        this.removed.clear();

        return this.map.set(key, value);
    }

    has(key: KeyT) {
        return this.map.has(key);
    }

    get(key: KeyT) {
        return this.map.get(key);
    }

    delete(key: KeyT) {
        if (!this.map.has(key)) {
            return false;
        }

        arrayRemove(this.usage, key);
        return this.map.delete(key);
    }

    clear() {
        arrayClear(this.usage);
        this.map.clear();
    }

    keys() {
        return this.map.keys();
    }

    values() {
        return this.map.values();
    }

    entries() {
        return this.map.entries();
    }
}
