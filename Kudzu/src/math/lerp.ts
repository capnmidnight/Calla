/**
 * Pick a value that is proportionally between two values.
 */
export function lerp(a: number, b: number, p: number) {
    return (1 - p) * a + p * b;
}
