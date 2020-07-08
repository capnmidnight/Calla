export function isGoodNumber(v) {
    return v !== null
        && v !== undefined
        && (typeof (v) === "number"
            || v instanceof Number)
        && !Number.isNaN(v);
}

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/**
 * 
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {number}
 */
export function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

export function project(v, min, max) {
    return (v - min) / (max - min);
}

export function unproject(v, min, max) {
    return v * (max - min) + min;
}