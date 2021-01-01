/**
 * Returns a random item from an array of items.
 *
 * Provides an option to consider an additional item as part of the collection
 * for random selection.
 */
export function arrayRandom(arr, defaultValue) {
    const offset = defaultValue != null ? 1 : 0, idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return arr[idx];
    }
}
//# sourceMappingURL=arrayRandom.js.map