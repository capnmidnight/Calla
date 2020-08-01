/**
 * A test for filtering an array
 * @callback scanArrayCallback
 * @param {any} obj - an array item to check.
 * @param {number} idx - the index of the item that is being checked.
 * @param {any[]} arr - the full array that is being filtered.
 * @returns {boolean} whether or not the item matches the test.
 */

/**
 * Scans through a series of filters to find an item that matches
 * any of the filters. The first item of the first filter that matches
 * will be returned.
 * @param {any[]} arr - the array to scan
 * @param {...scanArrayCallback} tests - the filtering tests.
 * @returns {any}
 */
export function arrayScan(arr, ...tests) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    for (let test of tests) {
        const filtered = arr.filter(test);
        if (filtered.length > 0) {
            return filtered[0];
        }
    }

    return null;
}