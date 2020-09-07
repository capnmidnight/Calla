import { arrayClear, arrayRemove } from "../calla";
export class LRUCache {
    constructor(size) {
        this.size = size;
        this.map = new Map();
        this.usage = [];
    }

    set(key, value) {
        this.usage.push(key);
        while (this.usage.length > this.size) {
            this.map.delete(this.usage.shift());
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
