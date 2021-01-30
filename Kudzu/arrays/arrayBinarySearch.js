import { isNullOrUndefined } from "../typeChecks";
function defaultKeySelector(obj) {
    return obj;
}
/**
 * Performs a binary search on a list to find where the item should be inserted.
 *
 * If the item is found, the returned index will be an exact integer.
 *
 * If the item is not found, the returned insertion index will be 0.5 greater than
 * the index at which it should be inserted.
 */
export function arrayBinarySearchByKey(arr, itemKey, keySelector) {
    let left = 0;
    let right = arr.length;
    let idx = Math.floor((left + right) / 2);
    let found = false;
    while (left < right && idx < arr.length) {
        const compareTo = arr[idx];
        const compareToKey = isNullOrUndefined(compareTo)
            ? null
            : keySelector(compareTo);
        if (!isNullOrUndefined(compareToKey)
            && itemKey < compareToKey) {
            right = idx;
        }
        else {
            if (itemKey === compareToKey) {
                found = true;
            }
            left = idx + 1;
        }
        idx = Math.floor((left + right) / 2);
    }
    if (!found) {
        idx += 0.5;
    }
    return idx;
}
/**
 * Performs a binary search on a list to find where the item should be inserted.
 *
 * If the item is found, the returned index will be an exact integer.
 *
 * If the item is not found, the returned insertion index will be 0.5 greater than
 * the index at which it should be inserted.
 */
export function arrayBinarySearch(arr, item, keySelector) {
    keySelector = keySelector || defaultKeySelector;
    const itemKey = keySelector(item);
    return arrayBinarySearchByKey(arr, itemKey, keySelector);
}
//# sourceMappingURL=arrayBinarySearch.js.map