/**
 * Translate a value into a range.
 */
export function project(v: number, min: number, max: number) {
    const delta = max - min;
    if (delta === 0) {
        return 0;
    }
    else {
        return (v - min) / delta;
    }
}
