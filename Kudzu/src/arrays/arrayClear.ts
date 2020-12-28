/**
 * Empties out an array, returning the items that were in the array.
 */
export function arrayClear<T>(arr: T[]) {
    return arr.splice(0);
}