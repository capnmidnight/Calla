import { arrayClear } from "./arrays/arrayClear";
import { arrayRemove } from "./arrays/arrayRemove";

export class LRUCache {
    constructor(size) {
        this.size = size;
        this.map = new Map();
        this.usage = [];
    }

    set(key, value) {
        this.usage.push(key);
        const removed = [];
        while (this.usage.length > this.size) {
            const toDelete = this.usage.shift();
            removed.push(toDelete);
            this.map.delete(toDelete);
        }
        arrayRemove(removed, key);
        if (removed.length > 0) {
            console.log("removing", removed.join(", "));
        }
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
