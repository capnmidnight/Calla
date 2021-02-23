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
/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 */
export function isGoodNumber(obj) {
    return isNumber(obj)
        && !Number.isNaN(obj);
}
export function isObject(obj) {
    return t(obj, "object", Object);
}
export function isDate(obj) {
    return obj instanceof Date;
}
export function isArray(obj) {
    return obj instanceof Array;
}
export function isHTMLElement(obj) {
    return obj instanceof HTMLElement;
}
export function assertNever(x, msg) {
    throw new Error((msg || "Unexpected object: ") + x);
}
export function isNullOrUndefined(obj) {
    return obj === null
        || obj === undefined;
}
export function isDefined(obj) {
    return !isNullOrUndefined(obj);
}
export function isEventListener(obj) {
    return isFunction(obj);
}
export function isEventListenerObject(obj) {
    return !isEventListener(obj);
}
export function isArrayBufferView(obj) {
    return obj instanceof Uint8Array
        || obj instanceof Uint8ClampedArray
        || obj instanceof Int8Array
        || obj instanceof Uint16Array
        || obj instanceof Int16Array
        || obj instanceof Uint32Array
        || obj instanceof Int32Array
        || obj instanceof BigUint64Array
        || obj instanceof BigInt64Array
        || obj instanceof Float32Array
        || obj instanceof Float64Array;
}
export function isXHRBodyInit(obj) {
    return isString(obj)
        || obj instanceof Blob
        || obj instanceof FormData
        || obj instanceof ArrayBuffer
        || obj instanceof Document
        || isArrayBufferView(obj)
        || obj instanceof ReadableStream;
}
//# sourceMappingURL=typeChecks.js.map