/**
 * Pick a value that is proportionally between two values.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {number}
 */

export function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}
