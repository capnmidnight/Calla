import { isBoolean, isNullOrUndefined, isFunction } from "../typeChecks";
import { arrayBinarySearch } from "./arrayBinarySearch";
import { arrayInsertAt } from "./arrayInsertAt";
export function arraySortedInsert(arr, item, keySelector, allowDuplicates) {
    let ks;
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
export function arraySortByKey(arr, keySelector) {
    const newArr = new Array();
    for (const obj of arr) {
        arraySortedInsert(newArr, obj, keySelector);
    }
    return newArr;
}
//# sourceMappingURL=arraySortedInsert.js.map