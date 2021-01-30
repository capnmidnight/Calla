import { arrayBinarySearch, arrayBinarySearchByKey } from "./arrayBinarySearch";
import { arrayRemoveAt } from "./arrayRemoveAt";

function removeAtIndex<T>(arr: T[], idx: number): boolean {
    if (idx > -1) {
        arrayRemoveAt(arr, idx);
        return true;
    }

    return false;
}

export function arrayBinarySearchRemoveByKey<T, V>(arr: T[], itemKey: V, keySelector?: (obj: T) => V): boolean {
    const idx = arrayBinarySearchByKey(arr, itemKey, keySelector);
    return removeAtIndex(arr, idx);
}

export function arrayBinarySearchRemove<T, V>(arr: T[], item: T, keySelector?: (obj: T) => V): boolean {
    const idx = arrayBinarySearch(arr, item, keySelector);
    return removeAtIndex(arr, idx);
}
