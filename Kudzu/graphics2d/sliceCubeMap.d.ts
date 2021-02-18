import type { CanvasTypes } from "../html/canvas";
export declare enum CubeMapFaceIndex {
    None = -1,
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
    Back = 4,
    Front = 5
}
export declare function sliceCubeMap(img: CanvasImageSource): CanvasTypes[];
export declare function sliceCubeMapToImageBitmaps(img: CanvasImageSource): Promise<ImageBitmap[]>;
