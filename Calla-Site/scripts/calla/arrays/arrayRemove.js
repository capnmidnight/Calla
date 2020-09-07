import { arrayRemoveAt } from "./arrayRemoveAt";

/**
 * Removes a given item from an array.
 * @param {any[]} arr
 * @param {any} value
 * @returns {boolean} - true, if the item was removed
 */
export function arrayRemove(arr, value) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    const idx = arr.indexOf(value);
    if (idx > -1) {
        arrayRemoveAt(arr, idx);
        return true;
    }

    return false;
}
