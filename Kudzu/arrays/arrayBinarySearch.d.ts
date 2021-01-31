export declare function arrayBinarySearchFind<T, V>(arr: T[], key: V, keySelector: (obj: T) => V): T | undefined;
/**
 * Performs a binary search on a list to find where the item should be inserted.
 *
 * If the item is found, the returned index will be an exact integer.
 *
 * If the item is not found, the returned insertion index will be 0.5 greater than
 * the index at which it should be inserted.
 */
export declare function arrayBinarySearchByKey<T, V>(arr: T[], itemKey: V, keySelector: (obj: T) => V): number;
/**
 * Performs a binary search on a list to find where the item should be inserted.
 *
 * If the item is found, the returned index will be an exact integer.
 *
 * If the item is not found, the returned insertion index will be 0.5 greater than
 * the index at which it should be inserted.
 */
export declare function arrayBinarySearch<T, V>(arr: T[], item: T, keySelector?: (obj: T) => V): number;
