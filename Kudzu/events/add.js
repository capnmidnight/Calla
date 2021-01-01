export function add(a, b) {
    return async (v) => {
        await a(v);
        await b(v);
    };
}
//# sourceMappingURL=add.js.map