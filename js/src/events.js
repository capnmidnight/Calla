import "./protos.js";

export function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}