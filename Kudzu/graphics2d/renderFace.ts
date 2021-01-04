import type { CanvasTypes } from "../html/canvas";
import { createUtilityCanvas } from "../html/canvas";
import { angleClamp } from "../math/angleClamp";
import { arrayProgress } from "../tasks/arrayProgress";
import type { progressCallback } from "../tasks/progressCallback";
import { isFunction } from "../typeChecks";
import { copyPixelBicubic } from "./copyPixelBicubic";
import { copyPixelBilinear } from "./copyPixelBilinear";
import { copyPixelLanczos } from "./copyPixelLanczos";
import { copyPixelNearest } from "./copyPixelNearest";
import { CubeMapFace, CubeMapFaceNames } from "./CubeMapFace";
import { InterpolationType } from "./InterpolationType";

const rotations = new Map();
rotations.set(CubeMapFace.PositiveY, 3);
rotations.set(CubeMapFace.NegativeY, 1);

const faceOrienters = new Map([
    [CubeMapFace.PositiveZ, (x: number, y: number) => {
        return {
            x: -1,
            y: -x,
            z: -y
        };
    }],
    [CubeMapFace.NegativeZ, (x: number, y: number) => {
        return {
            x: 1,
            y: x,
            z: -y
        };
    }],
    [CubeMapFace.PositiveX, (x: number, y: number) => {
        return {
            x: x,
            y: -1,
            z: -y
        };
    }],
    [CubeMapFace.NegativeX, (x: number, y: number) => {
        return {
            x: -x,
            y: 1,
            z: -y
        };
    }],
    [CubeMapFace.PositiveY, (x: number, y: number) => {
        return {
            x: -y,
            y: -x,
            z: 1
        };
    }],
    [CubeMapFace.NegativeY, (x: number, y: number) => {
        return {
            x: y,
            y: -x,
            z: -1
        };
    }]
]);

const pixelCopiers = new Map([
    [InterpolationType.Bilinear, copyPixelBilinear],
    [InterpolationType.Bicubic, copyPixelBicubic],
    [InterpolationType.Lanczos, copyPixelLanczos],
    [InterpolationType.Nearest, copyPixelNearest]
]);

export async function renderCanvasFace(readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth?: number, onProgress?: progressCallback): Promise<CanvasTypes> {

    const faceOrienter = faceOrienters.get(faceName);
    if (!faceOrienter) {
        throw new Error("Invalid face name: " + faceName);
    }

    const pixelCopier = pixelCopiers.get(interpolation);
    if (!pixelCopier) {
        throw new Error("Invalid interpolation type: " + interpolation);
    }

    const faceWidth = Math.min(maxWidth || Number.MAX_VALUE, readData.width / 2);
    const faceHeight = faceWidth;
    const writeData = new ImageData(faceWidth, faceHeight);
    if (!pixelCopiers.has(interpolation)) {
        interpolation = InterpolationType.Nearest;
    }

    const copyPixels = pixelCopier(readData, writeData);

    for (let y = 0; y < faceHeight; y++) {

        if (isFunction(onProgress)) {
            onProgress(y, faceHeight, faceName);
        }

        for (let x = 0; x < faceWidth; x++) {
            const to = 4 * (y * faceWidth + x);

            // fill alpha channel
            writeData.data[to + 3] = 255;

            // get position on cube face
            // cube is centered at the origin with a side length of 2
            const cube = faceOrienter((2 * (x + 0.5) / faceWidth - 1), (2 * (y + 0.5) / faceHeight - 1));

            // project cube face onto unit sphere by converting cartesian to spherical coordinates
            const r = Math.sqrt(cube.x * cube.x + cube.y * cube.y + cube.z * cube.z);
            const lon = angleClamp(Math.atan2(cube.y, cube.x));
            const lat = Math.acos(cube.z / r);

            copyPixels(readData.width * lon / Math.PI / 2 - 0.5, readData.height * lat / Math.PI - 0.5, to);
        }
    }

    const canv = createUtilityCanvas(faceWidth, faceHeight);
    const g = canv.getContext("2d");
    if (!g) {
        throw new Error("Couldn't create a 2D canvas context");
    }

    g.putImageData(writeData, 0, 0);

    if (rotations.has(faceName)) {
        const rotation = rotations.get(faceName);
        const halfW = faceWidth / 2;
        const halfH = faceHeight / 2;
        g.translate(halfW, halfH);
        g.rotate(rotation * Math.PI / 2);
        g.translate(-halfW, -halfH);
        g.drawImage(canv, 0, 0);
    }

    if (isFunction(onProgress)) {
        onProgress(faceHeight, faceHeight, faceName);
    }

    return canv;
}

export async function renderImageBitmapFace(readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<ImageBitmap> {
    const canv = await renderCanvasFace(readData, faceName, interpolation, maxWidth, onProgress);
    return await createImageBitmap(canv);
}

export type renderCanvasFacesCallback = (readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback) => Promise<CanvasTypes>;

export async function renderCanvasFaces(renderFace: renderCanvasFacesCallback, imgData: ImageData, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<CanvasTypes[]> {
    return await arrayProgress(
        onProgress,
        CubeMapFaceNames,
        (faceName, onProg) =>
            renderFace(imgData, faceName, interpolation, maxWidth, onProg));
}

export type renderImageBitmapFacesCallback = (readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback) => Promise<ImageBitmap>;

export async function renderImageBitmapFaces(renderFace: renderImageBitmapFacesCallback, imgData: ImageData, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<ImageBitmap[]> {
    return await arrayProgress(
        onProgress,
        CubeMapFaceNames,
        (faceName, onProg) =>
            renderFace(imgData, faceName, interpolation, maxWidth, onProg));
}