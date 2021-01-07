export function makeLookup(items, makeID) {
    const lookup = new Map();
    for (const item of items) {
        const id = makeID(item);
        lookup.set(id, item);
    }
    return lookup;
}
//# sourceMappingURL=makeLookup.js.map