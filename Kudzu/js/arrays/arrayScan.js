/**
 * Scans through a series of filters to find an item that matches
 * any of the filters. The first item of the first filter that matches
 * will be returned.
 */
export function arrayScan(arr, ...tests) {
    for (const test of tests) {
        for (const item of arr) {
            if (test(item)) {
                return item;
            }
        }
    }
    return null;
}
//# sourceMappingURL=arrayScan.js.map