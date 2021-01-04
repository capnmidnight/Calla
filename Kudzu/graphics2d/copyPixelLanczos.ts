import { kernelResample } from "./kernelResample";

export function copyPixelLanczos(read: ImageData, write: ImageData) {
    const filterSize = 5;
    const kernel = (x: number) => {
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
