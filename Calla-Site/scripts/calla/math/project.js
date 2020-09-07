/**
 * Translate a value into a range.
 *
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */

export function project(v, min, max) {
    const delta = max - min;
    if (delta === 0) {
        return 0;
    }
    else {
        return (v - min) / delta;
    }
}
