import { isBoolean, isNullOrUndefined, isFunction } from "../typeChecks";
import { arrayBinarySearch } from "./arrayBinarySearch";
import { arrayInsertAt } from "./arrayInsertAt";

/**
 * Performs an insert operation that maintains the sort
 * order of the array, returning the index at which the
 * item was inserted.
 */
export function arraySortedInsert<T>(arr: T[], item: T): number;
export function arraySortedInsert<T, V>(arr: T[], item: T, keySelector?: (obj: T) => V): number;
export function arraySortedInsert<T>(arr: T[], item: T, allowDuplicates?: boolean): number;
export function arraySortedInsert<T, V>(arr: T[], item: T, keySelector?: (obj: T) => V, allowDuplicates?: boolean): number;
export function arraySortedInsert<T, V>(arr: T[], item: T, keySelector?: ((obj: T) => V) | boolean, allowDuplicates?: boolean): number {
    let ks: ((obj: T) => V) | undefined;

    if (isFunction(keySelector)) {
        ks = keySelector;
    }
    else if (isBoolean(keySelector)) {
        allowDuplicates = keySelector;
    }

    if (isNullOrUndefined(allowDuplicates)) {
        allowDuplicates = true;
    }

    let idx = arrayBinarySearch(arr, item, ks);
    const found = (idx % 1) === 0;
    idx = idx | 0;
    if (!found || allowDuplicates) {
        arrayInsertAt(arr, item, idx);
    }

    return idx;
}

/**
 * Creates a new array that is sorted by the key extracted
 * by the keySelector callback, not modifying the input array,
 * (unlike JavaScript's own Array.prototype.sort).
 * @param arr
 * @param keySelector
 */
export function arraySortByKey<T, V>(arr: ReadonlyArray<T>, keySelector: (obj: T) => V): T[] {
    const newArr = new Array<T>();
    for (const obj of arr) {
        arraySortedInsert(newArr, obj, keySelector);
    }

    return newArr;
}