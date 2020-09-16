/**
 * Force a value onto a range
 *
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}
