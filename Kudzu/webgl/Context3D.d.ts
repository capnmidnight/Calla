import { TypedEventBase } from "../events/EventBase";
import type { CanvasTypes } from "../html/canvas";
interface Size {
    width: number;
    height: number;
}
export declare class ResizeEvent extends Event {
    width: number;
    height: number;
    constructor(width: number, height: number);
}
interface Context3DEvents {
    resize: ResizeEvent;
}
export declare class Context3D extends TypedEventBase<Context3DEvents> {
    gl: WebGL2RenderingContext;
    /**
     * Creates a wrapper around a WebGLRenderingContext to combine some
     * application lifecycle events that we always want to perform.
     * @param spec - some sort of description of our rendering environment.
     * @param [opts] - rendering context options.
     */
    constructor(spec: string | Size | CanvasTypes | WebGL2RenderingContext, opts: WebGLContextAttributes);
    resize(width: number, height: number): void;
    get width(): number;
    get height(): number;
}
export {};
