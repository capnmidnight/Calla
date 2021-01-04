export declare function kernelResample(read: ImageData, write: ImageData, filterSize: number, kernel: (i: number) => number): (xFrom: number, yFrom: number, to: number) => void;
