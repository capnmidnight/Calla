import { clamp } from "../math/clamp";
export function copyPixelBilinear(read, write) {
    const { width, height, data } = read;
    const readIndex = (x, y) => 4 * (y * width + x);
    return (xFrom, yFrom, to) => {
        const xl = clamp(Math.floor(xFrom), 0, width - 1);
        const xr = clamp(Math.ceil(xFrom), 0, width - 1);
        const xf = xFrom - xl;
        const yl = clamp(Math.floor(yFrom), 0, height - 1);
        const yr = clamp(Math.ceil(yFrom), 0, height - 1);
        const yf = yFrom - yl;
        const p00 = readIndex(xl, yl);
        const p10 = readIndex(xr, yl);
        const p01 = readIndex(xl, yr);
        const p11 = readIndex(xr, yr);
        for (let channel = 0; channel < 3; channel++) {
            const p0 = data[p00 + channel] * (1 - xf) + data[p10 + channel] * xf;
            const p1 = data[p01 + channel] * (1 - xf) + data[p11 + channel] * xf;
            write.data[to + channel] = Math.ceil(p0 * (1 - yf) + p1 * yf);
        }
    };
}
//# sourceMappingURL=copyPixelBilinear.js.map