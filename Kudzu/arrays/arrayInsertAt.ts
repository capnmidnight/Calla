/**
 * Inserts an item at the given index into an array.
 * @param arr
 * @param item
 * @param idx
 */

export function arrayInsertAt<T>(arr: T[], item: T, idx: number) {
    arr.splice(idx, 0, item);
}
