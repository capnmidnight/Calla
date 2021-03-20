import { arrayClear } from "../arrays/arrayClear";
import { arrayRemove } from "../arrays/arrayRemove";
import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { isDefined } from "../typeChecks";
export class LRUCacheItemEvicted extends TypedEvent {
    constructor(key, value) {
        super("itemevicted");
        this.key = key;
        this.value = value;
    }
}
export class LRUCache extends TypedEventBase {
    constructor(size) {
        super();
        this.size = size;
        this.map = new Map();
        this.usage = new Array();
        this.removed = new Map();
    }
    set(key, value) {
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
    has(key) {
        return this.map.has(key);
    }
    get(key) {
        return this.map.get(key);
    }
    delete(key) {
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
//# sourceMappingURL=LRUCache.js.map