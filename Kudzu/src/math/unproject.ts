/**
 * Translate a value out of a range.
 */

export function unproject(v: number, min: number, max: number) {
    return v * (max - min) + min;
}
