export function add<T>(
    a: (v: T) => void,
    b: (v: T) => void)
    : (v: T) => void {
    return async (v: T) => {
        await a(v);
        await b(v);
    };
}
