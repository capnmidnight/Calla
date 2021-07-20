import { isBoolean, isNullOrUndefined, isFunction, isDefined } from "../typeChecks";
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
    return arraySortedInsertInternal(arr, item, ks, allowDuplicates);
}
function arraySortedInsertInternal(arr, item, ks, allowDuplicates) {
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
    const newArr = Array.from(arr);
    newArr.sort((a, b) => {
        const keyA = keySelector(a);
        const keyB = keySelector(b);
        if (keyA < keyB) {
            return -1;
        }
        else if (keyA > keyB) {
            return 1;
        }
        else {
            return 0;
        }
    });
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
export function arraySortNumericByKey(arr, keySelector) {
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
        if (keyA < keyB) {
            return -1;
        }
        else if (keyA > keyB) {
            return 1;
        }
        else {
            return 0;
        }
    });
    return newArr;
}
//# sourceMappingURL=arraySortedInsert.js.map