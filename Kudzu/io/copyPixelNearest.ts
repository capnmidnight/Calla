import { clamp } from "../math/clamp";

export function copyPixelNearest(read: ImageData, write: ImageData) {
    const { width, height, data } = read;
    const readIndex = (x: number, y: number) => 4 * (y * width + x);

    return (xFrom: number, yFrom: number, to: number) => {

        const nearest = readIndex(
            clamp(Math.round(xFrom), 0, width - 1),
            clamp(Math.round(yFrom), 0, height - 1)
        );

        for (let channel = 0; channel < 3; channel++) {
            write.data[to + channel] = data[nearest + channel];
        }
    };
}
