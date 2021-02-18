import type { CanvasTypes } from "../html/canvas";
import { nextPowerOf2 } from "../math/powerOf2";
import { sliceImage } from "./sliceImage";

export enum CubeMapFaceIndex {
    None = -1,
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
    Back = 4,
    Front = 5
}

const cubemapPattern = {
    rows: 3,
    columns: 4,
    indices: [
        [CubeMapFaceIndex.None, CubeMapFaceIndex.Up, CubeMapFaceIndex.None, CubeMapFaceIndex.None],
        [CubeMapFaceIndex.Left, CubeMapFaceIndex.Front, CubeMapFaceIndex.Right, CubeMapFaceIndex.Back],
        [CubeMapFaceIndex.None, CubeMapFaceIndex.Down, CubeMapFaceIndex.None, CubeMapFaceIndex.None]
    ],
    rotations: [
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0]
    ]
};

export function sliceCubeMap(img: CanvasImageSource): CanvasTypes[] {
    const w1 = img.width as number / cubemapPattern.columns;
    const h1 = img.height as number / cubemapPattern.rows;
    const w2 = nextPowerOf2(w1);
    const h2 = nextPowerOf2(h1);
    const images = new Array<CanvasTypes>(6);
    for (let r = 0; r < cubemapPattern.rows; ++r) {
        const indices = cubemapPattern.indices[r];
        const rotations = cubemapPattern.rotations[r];
        for (let c = 0; c < cubemapPattern.columns; ++c) {
            const index = indices[c];
            if (index > -1) {
                images[index] = sliceImage(
                    img,
                    c * w1, r * h1,
                    w1, h1,
                    w2, h2,
                    rotations[c]);
            }
        }
    }

    return images;
}

export function sliceCubeMapToImageBitmaps(img: CanvasImageSource): Promise<ImageBitmap[]> {
    const canvs = sliceCubeMap(img);
    return Promise.all(canvs.map(c => createImageBitmap(c)));
}