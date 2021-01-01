export function isPowerOf2(v) {
    return ((v != 0) && !(v & (v - 1)));
}
export function nextPowerOf2(v) {
    return Math.pow(2, Math.ceil(Math.log2(v)));
}
export function prevPowerOf2(v) {
    return Math.pow(2, Math.floor(Math.log2(v)));
}
export function closestPowerOf2(v) {
    return Math.pow(2, Math.round(Math.log2(v)));
}
//# sourceMappingURL=powerOf2.js.map