import { clamp } from "../math/clamp";

// performs a discrete convolution with a provided kernel
export function kernelResample(read: ImageData, write: ImageData, filterSize: number, kernel: (i: number) => number) {
    const { width, height, data } = read;
    const readIndex = (x: number, y: number) => 4 * (y * width + x);

    const twoFilterSize = 2 * filterSize;
    const xMax = width - 1;
    const yMax = height - 1;
    const xKernel = new Array<number>(4);
    const yKernel = new Array<number>(4);

    return (xFrom: number, yFrom: number, to: number) => {
        const xl = Math.floor(xFrom);
        const yl = Math.floor(yFrom);
        const xStart = xl - filterSize + 1;
        const yStart = yl - filterSize + 1;

        for (let i = 0; i < twoFilterSize; i++) {
            xKernel[i] = kernel(xFrom - (xStart + i));
            yKernel[i] = kernel(yFrom - (yStart + i));
        }

        for (let channel = 0; channel < 3; channel++) {
            let q = 0;

            for (let i = 0; i < twoFilterSize; i++) {
                const y = yStart + i;
                const yClamped = clamp(y, 0, yMax);
                let p = 0;
                for (let j = 0; j < twoFilterSize; j++) {
                    const x = xStart + j;
                    const index = readIndex(clamp(x, 0, xMax), yClamped);
                    p += data[index + channel] * xKernel[j];

                }
                q += p * yKernel[i];
            }

            write.data[to + channel] = Math.round(q);
        }
    };
}
