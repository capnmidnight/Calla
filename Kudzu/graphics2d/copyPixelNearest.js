import { clamp } from "../math/clamp";
export function copyPixelNearest(read, write) {
    const { width, height, data } = read;
    const readIndex = (x, y) => 4 * (y * width + x);
    return (xFrom, yFrom, to) => {
        const nearest = readIndex(clamp(Math.round(xFrom), 0, width - 1), clamp(Math.round(yFrom), 0, height - 1));
        for (let channel = 0; channel < 3; channel++) {
            write.data[to + channel] = data[nearest + channel];
        }
    };
}
//# sourceMappingURL=copyPixelNearest.js.map