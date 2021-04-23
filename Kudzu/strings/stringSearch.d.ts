/**
 * Performs the Boyer-Moore fast string search algorithm
 * over Unicode graphemes, instead of individual bytes
 * like JavaScript's regular string::indexOf method.
 * @param search
 * @param pattern
 */
export declare function stringSearch(search: string, pattern: string): number;
