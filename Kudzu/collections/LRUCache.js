import { arrayClear } from "../arrays/arrayClear";
import { arrayRemove } from "../arrays/arrayRemove";
import { isDefined } from "../typeChecks";
export class LRUCache {
    constructor(size) {
        this.size = size;
        this.map = new Map();
        this.usage = new Array();
    }
    set(key, value) {
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
        return this.map.set(key, value);
    }
    has(key) {
        return this.map.has(key);
    }
    get(key) {
        return this.map.get(key);
    }
    delete(key) {
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