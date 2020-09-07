/**
 * Translate a value out of a range.
 *
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */

export function unproject(v, min, max) {
    return v * (max - min) + min;
}
