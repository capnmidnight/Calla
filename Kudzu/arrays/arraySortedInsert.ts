import { arrayBinarySearch } from "./arrayBinarySearch";

/**
 * Performs an insert operation that maintains the sort
 * order of the array, returning the index at which the
 * item was inserted.
 */
export function arraySortedInsert<T>(arr: T[], item: T, allowDuplicates = true) {
    let idx = arrayBinarySearch(arr, item);
    const found = (idx % 1) === 0;
    idx = idx | 0;
    if (!found || allowDuplicates) {
        arr.splice(idx, 0, item);
    }
    return idx;
}