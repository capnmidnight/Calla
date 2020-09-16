/**
 * Returns a random item from an array of items.
 *
 * Provides an option to consider an additional item as part of the collection
 * for random selection.
 * @param {any[]} arr
 * @param {any} defaultValue
 */
export function arrayRandom(arr, defaultValue) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }
    const offset = defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return arr[idx];
    }
}
