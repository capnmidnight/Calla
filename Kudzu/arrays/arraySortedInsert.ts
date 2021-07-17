import { isBoolean, isNullOrUndefined, isFunction, isDefined } from "../typeChecks";
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

    return arraySortedInsertInternal<T, V>(arr, item, ks, allowDuplicates);
}

function arraySortedInsertInternal<T, V>(arr: T[], item: T, ks: (obj: T) => V, allowDuplicates: boolean) {
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
        arraySortedInsertInternal(newArr, obj, keySelector, true);
    }

    return newArr;
}


const numericPattern = /^(\d+)/;
/**
 * Creates a new array that is sorted by the key extracted
 * by the keySelector callback, not modifying the input array,
 * (unlike JavaScript's own Array.prototype.sort).
 *
 * If the values have a number at the beginning, they'll be sorted
 * by that number.
 * @param arr
 * @param keySelector
 */
export function arraySortNumericByKey<T>(arr: ReadonlyArray<T>, keySelector: (obj: T) => string): T[] {
    const newArr = Array.from(arr);
    newArr.sort((a, b) => {
        const keyA = keySelector(a);
        const keyB = keySelector(b);
        const matchA = keyA.match(numericPattern);
        const matchB = keyB.match(numericPattern);
        if (isDefined(matchA)
            && isDefined(matchB)) {
            const numberA = parseFloat(matchA[1]);
            const numberB = parseFloat(matchB[1]);

            if (numberA < numberB) {
                return -1;
            }
            else if (numberA > numberB) {
                return 1;
            }
        }

        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    });

    return newArr;
}