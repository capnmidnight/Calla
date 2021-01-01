import { nextPowerOf2 } from "../math/powerOf2";
import { sliceImage } from "./sliceImage";
export function forcePower2(img) {
    const w1 = img.width;
    const h1 = img.height;
    const w2 = nextPowerOf2(w1);
    const h2 = nextPowerOf2(h1);
    if (w1 !== w2 || h1 !== h2) {
        img = sliceImage(img, 0, 0, w1, h1, w2, h2, 0);
    }
    return img;
}
//# sourceMappingURL=forcePowerOf2.js.map