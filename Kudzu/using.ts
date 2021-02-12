import { isFunction, isObject } from "./typeChecks";

export interface IDisposable {
    dispose(): void;
}

export interface IClosable {
    close(): void;
}

export interface ICloneable {
    clone(): unknown;
}

export function isDisposable(obj: any): obj is IDisposable {
    return isObject(obj)
        && "dispose" in obj
        && isFunction((obj as IDisposable).dispose);
}

export function isClosable(obj: any): obj is IClosable {
    return isObject(obj)
        && "close" in obj
        && isFunction((obj as IClosable).close);
}

export function isCloneable(obj: any): obj is ICloneable {
    return isObject(obj)
        && "clone" in obj
        && isFunction((obj as ICloneable).clone);
}

export function dispose<T extends IDisposable | IClosable>(val: T): void {
    if (isDisposable(val)) {
        val.dispose();
    }
    else if (isClosable(val)) {
        val.close();
    }
}

export function using<T extends IDisposable | IClosable, U>(val: T, thunk: (val: T) => U): U {
    try {
        return thunk(val);
    } finally {
        dispose(val);
    }
}

export function usingArray<T extends IDisposable | IClosable, U>(vals: T[], thunk: (val: T[]) => U): U {
    try {
        return thunk(vals);
    } finally {
        for (const val of vals) {
            dispose(val);
        }
    }
}

export async function usingAsync<T extends IDisposable | IClosable, U>(val: T, thunk: (val: T) => Promise<U>): Promise<U> {
    try {
        return await thunk(val);
    } finally {
        dispose(val);
    }
}


export async function usingArrayAsync<T extends IDisposable | IClosable, U>(vals: T[], thunk: (val: T[]) => Promise<U>): Promise<U> {
    try {
        return await thunk(vals);
    } finally {
        for (const val of vals) {
            dispose(val);
        }
    }
}