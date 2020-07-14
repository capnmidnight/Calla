/**
 * Returns a random item from an array of items.
 * 
 * Provides an option to consider an additional item as part of the collection
 * for random selection.
 * @param {any[]} arr
 * @param {any} defaultValue
 */
export function arrayRandom(arr, defaultValue) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    const offset = !!defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return arr[idx];
    }
}

/**
 * Returns a random item from an array of items.
 *
 * Provides an option to consider an additional item as part of the collection
 * for random selection.
 * @memberof Array
 * @param {any} defaultValue
 */
Array.prototype.random = function (defaultValue) {
    return arrayRandom(this, defaultValue);
};

/**
 * Empties out an array
 * @param {any[]} arr - the array to empty.
 * @returns {any[]} - the items that were in the array.
 */
export function arrayClear(arr) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    return arr.splice(0);
}

/**
 * Empties out an array
 * @returns {any[]} - the items that were in the array.
 */
Array.prototype.clear = function () {
    return arrayClear(this);
};

/**
 * Removes an item at the given index from an array.
 * @param {any[]} arr
 * @param {number} idx
 * @returns {any} - the item that was removed.
 */
export function arrayRemoveAt(arr, idx) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    return arr.splice(idx, 1);
}

/**
 * Removes an item at the given index from an array.
 * @param {number} idx
 * @returns {any} - the item that was removed.
 */
Array.prototype.removeAt = function (idx) {
    return arrayRemoveAt(this, idx);
};

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

/**
 * Scans through a series of filters to find an item that matches
 * any of the filters. The first item of the first filter that matches
 * will be returned.
 * @param {...scanArrayCallback} tests - the filtering tests.
 * @returns {any}
 */
Array.prototype.scan = function (...tests) {
    return arrayScan(this, ...tests);
};