import "./protos.js";

export function copy(dest, evt) {
    for (let key in dest) {
        dest[key] = null;
        if (evt[key] !== undefined) {
            dest[key] = evt[key];
        }
    }

    return dest;
};

export function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}