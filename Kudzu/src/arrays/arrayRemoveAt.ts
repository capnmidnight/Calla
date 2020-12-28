/**
 * Removes an item at the given index from an array.
 */
export function arrayRemoveAt<T>(arr: T[], idx: number) {
    return arr.splice(idx, 1)[0];
}
