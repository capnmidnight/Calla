import "./protos.js";

function t(o, s, c) {
    return typeof o === s || o instanceof c;
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
export function isBoolean(obj) {
    return t(obj, "boolean", Boolean);
}