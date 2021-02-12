import { isFunction, isObject } from "./typeChecks";
export function isDisposable(obj) {
    return isObject(obj)
        && "dispose" in obj
        && isFunction(obj.dispose);
}
export function isClosable(obj) {
    return isObject(obj)
        && "close" in obj
        && isFunction(obj.close);
}
export function isCloneable(obj) {
    return isObject(obj)
        && "clone" in obj
        && isFunction(obj.clone);
}
export function dispose(val) {
    if (isDisposable(val)) {
        val.dispose();
    }
    else if (isClosable(val)) {
        val.close();
    }
}
export function using(val, thunk) {
    try {
        return thunk(val);
    }
    finally {
        dispose(val);
    }
}
export function usingArray(vals, thunk) {
    try {
        return thunk(vals);
    }
    finally {
        for (const val of vals) {
            dispose(val);
        }
    }
}
export async function usingAsync(val, thunk) {
    try {
        return await thunk(val);
    }
    finally {
        dispose(val);
    }
}
export async function usingArrayAsync(vals, thunk) {
    try {
        return await thunk(vals);
    }
    finally {
        for (const val of vals) {
            dispose(val);
        }
    }
}
//# sourceMappingURL=using.js.map