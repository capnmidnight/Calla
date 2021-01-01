import type { CanvasTypes } from "../html/canvas";
import { createUtilityCanvas } from "../html/canvas";

export function sliceImage(img: CanvasImageSource, x: number, y: number, w1: number, h1: number, w2: number, h2: number, rotation: number): CanvasTypes {
    const canv = createUtilityCanvas(w2, h2);
    const g = canv.getContext("2d");
    if (!g) {
        throw new Error("Couldn't create a 2D canvas context");
    }

    const halfW = w2 / 2;
    const halfH = h2 / 2;
    if (rotation > 0) {
        if ((rotation % 2) === 0) {
            g.translate(halfW, halfH);
        }
        else {
            g.translate(halfH, halfW);
        }
        g.rotate(rotation * Math.PI / 2);
        g.translate(-halfW, -halfH);
    }
    g.drawImage(img, x, y, w1, h1, 0, 0, w2, h2);

    return canv;
}