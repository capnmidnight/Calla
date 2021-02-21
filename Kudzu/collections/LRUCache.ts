import { arrayClear } from "../arrays/arrayClear";
import { arrayRemove } from "../arrays/arrayRemove";
import { isDefined } from "../typeChecks";

export class LRUCache<KeyT, ValueT> {
    map = new Map<KeyT, ValueT>();
    usage = new Array<KeyT>();

    constructor(public size: number) {
    }

    set(key: KeyT, value: ValueT) {
        this.usage.push(key);
        const removed = [];
        while (this.usage.length > this.size) {
            const toDelete = this.usage.shift();
            if (isDefined(toDelete)) {
                removed.push(toDelete);
                this.map.delete(toDelete);
            }
        }
        arrayRemove(removed, key);
        if (removed.length > 0) {
            console.log("removing", removed.join(", "));
        }
        return this.map.set(key, value);
    }

    has(key: KeyT) {
        return this.map.has(key);
    }

    get(key: KeyT) {
        return this.map.get(key);
    }

    delete(key: KeyT) {
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
