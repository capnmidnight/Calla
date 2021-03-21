export interface IDisposable {
    dispose(): void;
}
export interface IClosable {
    close(): void;
}
export interface ICloneable {
    clone(): unknown;
}
export declare function isDisposable(obj: any): obj is IDisposable;
export declare function isClosable(obj: any): obj is IClosable;
export declare function isCloneable(obj: any): obj is ICloneable;
export declare function dispose(val: any): void;
export declare function using<T extends IDisposable | IClosable, U>(val: T, thunk: (val: T) => U): U;
export declare function usingArray<T extends IDisposable | IClosable, U>(vals: T[], thunk: (val: T[]) => U): U;
export declare function usingAsync<T extends IDisposable | IClosable, U>(val: T, thunk: (val: T) => Promise<U>): Promise<U>;
export declare function usingArrayAsync<T extends IDisposable | IClosable, U>(vals: T[], thunk: (val: T[]) => Promise<U>): Promise<U>;
