import { kernelResample } from "./kernelResample";

export function copyPixelBicubic(read: ImageData, write: ImageData) {
    const b = -0.5;
    const kernel = (x: number) => {
        x = Math.abs(x);
        const x2 = x * x;
        const x3 = x * x * x;
        return x <= 1 ?
            (b + 2) * x3 - (b + 3) * x2 + 1 :
            b * x3 - 5 * b * x2 + 8 * b * x - 4 * b;
    };

    return kernelResample(read, write, 2, kernel);
}
