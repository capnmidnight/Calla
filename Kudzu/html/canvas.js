import { openWindow } from "../testing/windowing";
import { isDefined, isNullOrUndefined } from "../typeChecks";
import { height, width } from "./attrs";
import { Canvas } from "./tags";
export const hasHTMLCanvas = "HTMLCanvasElement" in globalThis;
export const hasOffscreenCanvas = "OffscreenCanvas" in globalThis;
export const hasImageBitmap = "createImageBitmap" in globalThis;
export function isWebXRWebGLRenderingContext(ctx) {
    return "makeXRCompatible" in ctx
        && ctx.makeXRCompatible instanceof Function;
}
export const hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && (function () {
    try {
        const canv = new OffscreenCanvas(1, 1);
        const g = canv.getContext("2d");
        return g != null;
    }
    catch (exp) {
        return false;
    }
})();
export const hasImageBitmapRenderingContext = hasImageBitmap && (function () {
    try {
        const canv = hasOffscreenCanvas
            ? new OffscreenCanvas(1, 1)
            : Canvas();
        const g = canv.getContext("bitmaprenderer");
        return g != null;
    }
    catch (exp) {
        return false;
    }
})();
export function drawImageBitmapToCanvas2D(canv, img) {
    const g = canv.getContext("2d");
    if (isNullOrUndefined(g)) {
        throw new Error("Could not create 2d context for canvas");
    }
    g.drawImage(img, 0, 0);
}
export function copyImageBitmapToCanvas(canv, img) {
    const g = canv.getContext("bitmaprenderer");
    if (isNullOrUndefined(g)) {
        throw new Error("Could not create bitmaprenderer context for canvas");
    }
    g.transferFromImageBitmap(img);
}
export const drawImageBitmapToCanvas = hasImageBitmapRenderingContext
    ? copyImageBitmapToCanvas
    : drawImageBitmapToCanvas2D;
export function createOffscreenCanvas(width, height) {
    return new OffscreenCanvas(width, height);
}
export function createCanvas(w, h) {
    return Canvas(width(w), height(h));
}
export const createUtilityCanvas = hasOffscreenCanvasRenderingContext2D
    ? createOffscreenCanvas
    : createCanvas;
export function createOffscreenCanvasFromImageBitmap(img) {
    const canv = createOffscreenCanvas(img.width, img.height);
    drawImageBitmapToCanvas(canv, img);
    return canv;
}
export function createCanvasFromImageBitmap(img) {
    const canv = createCanvas(img.width, img.height);
    drawImageBitmapToCanvas(canv, img);
    return canv;
}
export const createUtilityCanvasFromImageBitmap = hasOffscreenCanvasRenderingContext2D
    ? createOffscreenCanvasFromImageBitmap
    : createCanvasFromImageBitmap;
export function drawImageToCanvas(canv, img) {
    const g = canv.getContext("2d");
    if (isNullOrUndefined(g)) {
        throw new Error("Could not create 2d context for canvas");
    }
    g.drawImage(img, 0, 0);
}
export function createOffscreenCanvasFromImage(img) {
    const canv = createOffscreenCanvas(img.width, img.height);
    drawImageToCanvas(canv, img);
    return canv;
}
export function createCanvasFromImage(img) {
    const canv = createCanvas(img.width, img.height);
    drawImageToCanvas(canv, img);
    return canv;
}
export const createUtilityCanvasFromImage = hasOffscreenCanvasRenderingContext2D
    ? createOffscreenCanvasFromImage
    : createCanvasFromImage;
export function isHTMLCanvas(obj) {
    return hasHTMLCanvas && obj instanceof HTMLCanvasElement;
}
export function isOffscreenCanvas(obj) {
    return hasOffscreenCanvas && obj instanceof OffscreenCanvas;
}
/**
 * Returns true if the given object is either an HTMLCanvasElement or an OffscreenCanvas.
 */
export function isCanvas(obj) {
    return isHTMLCanvas(obj)
        || isOffscreenCanvas(obj);
}
/**
 * Resizes a canvas element
 * @param canv
 * @param w - the new width of the canvas
 * @param h - the new height of the canvas
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function setCanvasSize(canv, w, h, superscale = 1) {
    w = Math.floor(w * superscale);
    h = Math.floor(h * superscale);
    if (canv.width != w
        || canv.height != h) {
        canv.width = w;
        canv.height = h;
        return true;
    }
    return false;
}
export function is2DRenderingContext(ctx) {
    return isDefined(ctx.textBaseline);
}
export function setCanvas2DContextSize(ctx, w, h, superscale = 1) {
    const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(ctx.canvas, w, h, superscale);
    if (resized) {
        ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
        ctx.textBaseline = oldTextBaseline;
        ctx.textAlign = oldTextAlign;
        ctx.font = oldFont;
    }
    return resized;
}
/**
 * Resizes the canvas element of a given rendering context.
 *
 * Note: the imageSmoothingEnabled, textBaseline, textAlign, and font
 * properties of the context will be restored after the context is resized,
 * as these values are usually reset to their default values when a canvas
 * is resized.
 * @param ctx
 * @param w - the new width of the canvas
 * @param h - the new height of the canvas
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function setContextSize(ctx, w, h, superscale = 1) {
    if (is2DRenderingContext(ctx)) {
        return setCanvas2DContextSize(ctx, w, h, superscale);
    }
    else {
        return setCanvasSize(ctx.canvas, w, h, superscale);
    }
}
/**
 * Resizes a canvas element to match the proportions of the size of the element in the DOM.
 * @param canv
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function resizeCanvas(canv, superscale = 1) {
    return setCanvasSize(canv, canv.clientWidth, canv.clientHeight, superscale);
}
/**
 * Resizes a canvas element of a given rendering context to match the proportions of the size of the element in the DOM.
 * @param ctx
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function resizeContext(ctx, superscale = 1) {
    return setContextSize(ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, superscale);
}
export async function canvasView(canvas) {
    let url;
    if (isOffscreenCanvas(canvas)) {
        const blob = await canvas.convertToBlob();
        url = URL.createObjectURL(blob);
    }
    else {
        url = canvas.toDataURL();
    }
    openWindow(url, 0, 0, canvas.width + 10, canvas.height + 100);
}
export async function canvasToBlob(canvas, type, quality) {
    if (isOffscreenCanvas(canvas)) {
        return await canvas.convertToBlob({ type, quality });
    }
    else {
        return await new Promise((resolve) => {
            canvas.toBlob(resolve, type, quality);
        });
    }
}
if (hasHTMLCanvas) {
    HTMLCanvasElement.prototype.view = async function () {
        return await canvasView(this);
    };
    HTMLCanvasElement.prototype.convertToBlob = async function (opts) {
        return await canvasToBlob(this, opts && opts.type || undefined, opts && opts.quality || undefined);
    };
}
if (hasOffscreenCanvas) {
    OffscreenCanvas.prototype.view = async function () {
        return await canvasView(this);
    };
    OffscreenCanvas.prototype.toBlob = function (callback, type, quality) {
        canvasToBlob(this, type, quality)
            .then(callback);
    };
}
//# sourceMappingURL=canvas.js.map