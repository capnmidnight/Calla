/**
 * Scans through a series of filters to find an item that matches
 * any of the filters. The first item of the first filter that matches
 * will be returned.
 */
export declare function arrayScan<T>(arr: T[], ...tests: ((val: T) => boolean)[]): T | null;
