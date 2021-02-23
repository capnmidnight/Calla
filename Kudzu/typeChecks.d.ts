export declare function isFunction(obj: any): obj is Function;
export declare function isString(obj: any): obj is string;
export declare function isBoolean(obj: any): obj is boolean;
export declare function isNumber(obj: any): obj is number;
/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 */
export declare function isGoodNumber(obj: any): obj is number;
export declare function isObject(obj: any): obj is object;
export declare function isDate(obj: any): obj is Date;
export declare function isArray(obj: any): obj is Array<any>;
export declare function isHTMLElement(obj: any): obj is HTMLElement;
export declare function assertNever(x: never, msg?: string): never;
export declare function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined;
export declare function isDefined<T>(obj: T | null | undefined): obj is T;
export declare function isEventListener(obj: EventListenerOrEventListenerObject): obj is EventListener;
export declare function isEventListenerObject(obj: EventListenerOrEventListenerObject): obj is EventListenerObject;
export declare function isArrayBufferView(obj: any): obj is ArrayBufferView;
export declare function isXHRBodyInit(obj: any): obj is BodyInit;
