import { isNumber } from "./events.js";

/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 * 
 * @param {any} v
 */
export function isGoodNumber(v) {
    return isNumber(v)
        && !Number.isNaN(v);
}

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

/**
 * Translate a value into a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
export function project(v, min, max) {
    return (v - min) / (max - min);
}

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