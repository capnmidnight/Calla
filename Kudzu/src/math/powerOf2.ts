export function isPowerOf2(v: number) {
    return ((v != 0) && !(v & (v - 1)));
}

export function nextPowerOf2(v: number) {
    return Math.pow(2, Math.ceil(Math.log2(v)));
}

export function prevPowerOf2(v: number) {
    return Math.pow(2, Math.floor(Math.log2(v)));
}

export function closestPowerOf2(v: number) {
    return Math.pow(2, Math.round(Math.log2(v)));
}