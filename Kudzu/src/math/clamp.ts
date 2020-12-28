/**
 * Force a value onto a range
 */
export function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
}
