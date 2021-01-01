import { arrayRemoveAt } from "./arrayRemoveAt";

/**
 * Removes a given item from an array, returning true if the item was removed.
 */
export function arrayRemove<T>(arr: T[], value: T) {
    const idx = arr.indexOf(value);
    if (idx > -1) {
        arrayRemoveAt(arr, idx);
        return true;
    }

    return false;
}
