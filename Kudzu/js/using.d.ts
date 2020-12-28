export interface IDisposable {
    dispose(): void;
}
export interface IClosable {
    close(): void;
}
export declare function using<T extends IDisposable | IClosable, U>(val: T, thunk: (val: T) => U): U;
export declare function usingArray<T extends IDisposable | IClosable, U>(vals: T[], thunk: (val: T[]) => U): U;
export declare function usingAsync<T extends IDisposable | IClosable, U>(val: T, thunk: (val: T) => Promise<U>): Promise<U>;
export declare function usingArrayAsync<T extends IDisposable | IClosable, U>(vals: T[], thunk: (val: T[]) => Promise<U>): Promise<U>;
