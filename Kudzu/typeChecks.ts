function t(o: any, s: string, c: Function) {
    return typeof o === s
        || o instanceof c;
}

export function isFunction(obj: any): obj is Function {
    return t(obj, "function", Function);
}

export function isString(obj: any): obj is string {
    return t(obj, "string", String);
}

export function isBoolean(obj: any): obj is boolean {
    return t(obj, "boolean", Boolean);
}

export function isNumber(obj: any): obj is number {
    return t(obj, "number", Number);
}

export function isObject(obj: any): obj is object {
    return t(obj, "object", Object);
}

export function isArray(obj: any): obj is Array<any> {
    return obj instanceof Array;
}

export function isHTMLElement(obj: any): obj is HTMLElement {
    return obj instanceof HTMLElement;
}

/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 */
export function isGoodNumber(obj: any): obj is number {
    return isNumber(obj)
        && !Number.isNaN(obj);
}

export function isEventListener(obj: EventListenerOrEventListenerObject): obj is EventListener {
    return isFunction(obj);
}

export function isEventListenerObject(obj: EventListenerOrEventListenerObject): obj is EventListenerObject {
    return !isEventListener(obj);
}

export function isNullOrUndefined(obj: any): obj is null | undefined {
    return obj === null
        || obj === undefined;
}