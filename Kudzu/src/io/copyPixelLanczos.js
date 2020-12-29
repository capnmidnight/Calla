import { kernelResample } from "./kernelResample";
export function copyPixelLanczos(read, write) {
    const filterSize = 5;
    const kernel = (x) => {
        if (x === 0) {
            return 1;
        }
        else {
            const xp = Math.PI * x;
            return filterSize * Math.sin(xp) * Math.sin(xp / filterSize) / (xp * xp);
        }
    };
    return kernelResample(read, write, filterSize, kernel);
}
//# sourceMappingURL=copyPixelLanczos.js.map