import { isNullOrUndefined } from "../typeChecks";

/**
 * Performs a binary search on a list to find where the item should be inserted.
 *
 * If the item is found, the returned index will be an exact integer.
 *
 * If the item is not found, the returned insertion index will be 0.5 greater than
 * the index at which it should be inserted.
 */
export function arrayBinarySearch<T>(arr: T[], item: T): number {
    let left = 0;
    let right = arr.length;
    let idx = Math.floor((left + right) / 2);
    let found = false;
    while (left < right && idx < arr.length) {
        const compareTo = arr[idx];
        if (!isNullOrUndefined(compareTo)
            && item < compareTo) {
            right = idx;
        }
        else {
            if (item === compareTo) {
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