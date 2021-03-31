export declare type CanvasTypes = HTMLCanvasElement | OffscreenCanvas;
export declare type CanvasImageTypes = HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap;
export declare type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export declare type GraphicsContext = RenderingContext | OffscreenCanvasRenderingContext2D;
export declare const hasHTMLCanvas: boolean;
export declare const hasOffscreenCanvas: boolean;
export declare const hasImageBitmap: boolean;
export interface WebXRWebGLRenderingContext extends WebGLRenderingContext {
    makeXRCompatible(): Promise<void>;
}
export declare function isWebXRWebGLRenderingContext(ctx: any): ctx is WebXRWebGLRenderingContext;
export declare function drawImageBitmapToCanvas2D(canv: CanvasTypes, img: ImageBitmap): void;
export declare function copyImageBitmapToCanvas(canv: CanvasTypes, img: ImageBitmap): void;
export declare const hasOffscreenCanvasRenderingContext2D: boolean;
export declare const createUtilityCanvas: typeof createOffscreenCanvas | typeof createCanvas;
export declare const hasOffscreenCanvasRenderingContext3D: boolean;
export declare const hasImageBitmapRenderingContext: boolean;
export declare const drawImageBitmapToCanvas: typeof copyImageBitmapToCanvas;
export declare function createOffscreenCanvas(width: number, height: number): OffscreenCanvas;
export declare function createCanvas(w: number, h: number): HTMLCanvasElement;
export declare function createOffscreenCanvasFromImageBitmap(img: ImageBitmap): OffscreenCanvas;
export declare function createCanvasFromImageBitmap(img: ImageBitmap): HTMLCanvasElement;
export declare const createUtilityCanvasFromImageBitmap: typeof createOffscreenCanvasFromImageBitmap | typeof createCanvasFromImageBitmap;
export declare function drawImageToCanvas(canv: CanvasTypes, img: HTMLImageElement): void;
export declare function createOffscreenCanvasFromImage(img: HTMLImageElement): OffscreenCanvas;
export declare function createCanvasFromImage(img: HTMLImageElement): HTMLCanvasElement;
export declare const createUtilityCanvasFromImage: typeof createOffscreenCanvasFromImage | typeof createCanvasFromImage;
export declare function isHTMLCanvas(obj: any): obj is HTMLCanvasElement;
export declare function isOffscreenCanvas(obj: any): obj is OffscreenCanvas;
/**
 * Returns true if the given object is either an HTMLCanvasElement or an OffscreenCanvas.
 */
export declare function isCanvas(obj: any): obj is CanvasTypes;
/**
 * Resizes a canvas element
 * @param canv
 * @param w - the new width of the canvas
 * @param h - the new height of the canvas
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export declare function setCanvasSize(canv: CanvasTypes, w: number, h: number, superscale?: number): boolean;
export declare function is2DRenderingContext(ctx: GraphicsContext): ctx is Context2D;
export declare function setCanvas2DContextSize(ctx: Context2D, w: number, h: number, superscale?: number): boolean;
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
export declare function setContextSize(ctx: GraphicsContext, w: number, h: number, superscale?: number): boolean;
/**
 * Resizes a canvas element to match the proportions of the size of the element in the DOM.
 * @param canv
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export declare function resizeCanvas(canv: HTMLCanvasElement, superscale?: number): boolean;
/**
 * Resizes a canvas element of a given rendering context to match the proportions of the size of the element in the DOM.
 * @param ctx
 * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
export declare function resizeContext(ctx: CanvasRenderingContext2D, superscale?: number): boolean;
export declare function canvasView(canvas: CanvasTypes): Promise<void>;
export declare function canvasToBlob(canvas: CanvasTypes, type?: string, quality?: number): Promise<Blob | null>;
