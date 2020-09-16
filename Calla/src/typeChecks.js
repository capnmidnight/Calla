function t(o, s, c) {
    return typeof o === s
        || o instanceof c;
}

export function isFunction(obj) {
    return t(obj, "function", Function);
}

export function isString(obj) {
    return t(obj, "string", String);
}

export function isNumber(obj) {
    return t(obj, "number", Number);
}

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

export function isBoolean(obj) {
    return t(obj, "boolean", Boolean);
}