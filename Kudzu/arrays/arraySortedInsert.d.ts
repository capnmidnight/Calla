/**
 * Performs an insert operation that maintains the sort
 * order of the array, returning the index at which the
 * item was inserted.
 */
export declare function arraySortedInsert<T>(arr: T[], item: T): number;
export declare function arraySortedInsert<T, V>(arr: T[], item: T, keySelector?: (obj: T) => V): number;
export declare function arraySortedInsert<T>(arr: T[], item: T, allowDuplicates?: boolean): number;
export declare function arraySortedInsert<T, V>(arr: T[], item: T, keySelector?: (obj: T) => V, allowDuplicates?: boolean): number;
/**
 * Creates a new array that is sorted by the key extracted
 * by the keySelector callback, not modifying the input array,
 * (unlike JavaScript's own Array.prototype.sort).
 * @param arr
 * @param keySelector
 */
export declare function arraySortByKey<T, V>(arr: ReadonlyArray<T>, keySelector: (obj: T) => V): T[];
