/**
 * Returns true if the given object is either an HTMLCanvasElement or an OffscreenCanvas.
 * @param {any} obj
 * @returns {boolean}
 */
export function isCanvas(obj) {
    return obj instanceof HTMLCanvasElement
        || (window.OffscreenCanvas
            && obj instanceof OffscreenCanvas);
}

/**
 * Resizes a canvas element
 * @param {HTMLCanvasElement|OffscreenCanvas} canv
 * @param {number} w - the new width of the canvas
 * @param {number} h - the new height of the canvas
 * @param {number=1} superscale - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
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

/**
 * Resizes the canvas element of a given rendering context.
 * 
 * Note: the imageSmoothingEnabled, textBaseline, textAlign, and font 
 * properties of the context will be restored after the context is resized,
 * as these values are usually reset to their default values when a canvas
 * is resized.
 * @param {RenderingContext} ctx
 * @param {number} w - the new width of the canvas
 * @param {number} h - the new height of the canvas
 * @param {number=1} superscale - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function setContextSize(ctx, w, h, superscale = 1) {
    const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled,
        oldTextBaseline = ctx.textBaseline,
        oldTextAlign = ctx.textAlign,
        oldFont = ctx.font,
        resized = setCanvasSize(
            ctx.canvas,
            w,
            h,
            superscale);

    if (resized) {
        ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
        ctx.textBaseline = oldTextBaseline;
        ctx.textAlign = oldTextAlign;
        ctx.font = oldFont;
    }

    return resized;
}

/**
 * Resizes a canvas element to match the proportions of the size of the element in the DOM.
 * @param {HTMLCanvasElement} canv
 * @param {number=1} superscale - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function resizeCanvas(canv, superscale = 1) {
    return setCanvasSize(
        canv,
        canv.clientWidth,
        canv.clientHeight,
        superscale);
}

/**
 * Resizes a canvas element of a given rendering context to match the proportions of the size of the element in the DOM.
 * @param {HTMLCanvasElement} canv
 * @param {number=1} superscale - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export function resizeContext(ctx, superscale = 1) {
    return setContextSize(
        ctx,
        ctx.canvas.clientWidth,
        ctx.canvas.clientHeight,
        superscale);
}