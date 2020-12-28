/**
 * Translate a value into a range.
 */
export function project(v, min, max) {
    const delta = max - min;
    if (delta === 0) {
        return 0;
    }
    else {
        return (v - min) / delta;
    }
}
//# sourceMappingURL=project.js.map