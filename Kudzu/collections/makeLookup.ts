export function makeLookup<T, U>(items: T[], makeID: (item: T) => U): Map<U, T> {
    const lookup = new Map<U, T>();
    for (const item of items) {
        const id = makeID(item);
        lookup.set(id, item);
    }
    return lookup;
}