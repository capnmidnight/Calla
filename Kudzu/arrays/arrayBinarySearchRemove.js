import { arrayBinarySearch, arrayBinarySearchByKey } from "./arrayBinarySearch";
import { arrayRemoveAt } from "./arrayRemoveAt";
function removeAtIndex(arr, idx) {
    if (idx > -1) {
        arrayRemoveAt(arr, idx);
        return true;
    }
    return false;
}
export function arrayBinarySearchRemoveByKey(arr, itemKey, keySelector) {
    const idx = arrayBinarySearchByKey(arr, itemKey, keySelector);
    return removeAtIndex(arr, idx);
}
export function arrayBinarySearchRemove(arr, item, keySelector) {
    const idx = arrayBinarySearch(arr, item, keySelector);
    return removeAtIndex(arr, idx);
}
//# sourceMappingURL=arrayBinarySearchRemove.js.map