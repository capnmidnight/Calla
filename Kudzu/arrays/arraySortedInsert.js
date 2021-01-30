import { isBoolean, isNullOrUndefined, isFunction } from "../typeChecks";
import { arrayBinarySearch } from "./arrayBinarySearch";
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
        arr.splice(idx, 0, item);
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
    const newArr = new Array(arr.length);
    for (const obj of arr) {
        arraySortedInsert(newArr, obj, keySelector);
    }
    return newArr;
}
//# sourceMappingURL=arraySortedInsert.js.map