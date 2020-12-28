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
export function isBoolean(obj) {
    return t(obj, "boolean", Boolean);
}
export function isNumber(obj) {
    return t(obj, "number", Number);
}
export function isObject(obj) {
    return t(obj, "object", Object);
}
export function isArray(obj) {
    return obj instanceof Array;
}
/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 */
export function isGoodNumber(obj) {
    return isNumber(obj)
        && !Number.isNaN(obj);
}
export function isEventListener(obj) {
    return isFunction(obj);
}
export function isEventListenerObject(obj) {
    return !isEventListener(obj);
}
export function isNullOrUndefined(obj) {
    return obj === null
        || obj === undefined;
}
//# sourceMappingURL=typeChecks.js.map