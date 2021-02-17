import { TypedEventBase } from "../events/EventBase";
import { height, width } from "../html/attrs";
import type { CanvasTypes } from "../html/canvas";
import {
    hasHTMLCanvas,
    hasOffscreenCanvas,
    isHTMLCanvas,
    isOffscreenCanvas,
    setContextSize
} from "../html/canvas";
import { Canvas } from "../html/tags";
import {
    isNumber,
    isString
} from "../typeChecks";



interface Size {
    width: number;
    height: number;
}

function isSize(obj: string | Size | CanvasTypes | WebGL2RenderingContext): obj is Size {
    const maybeSize = obj as Size;
    return isNumber(maybeSize.width) && isNumber(maybeSize.height);
}

export class ResizeEvent extends Event {
    constructor(
        public width: number,
        public height: number) {
        super("resize");
        Object.seal(this);
    }
}

interface Context3DEvents {
    resize: ResizeEvent;
}

// Let's start with the context.
export class Context3D extends TypedEventBase<Context3DEvents> {
    gl: WebGL2RenderingContext;

    /**
     * Creates a wrapper around a WebGLRenderingContext to combine some
     * application lifecycle events that we always want to perform.
     * @param spec - some sort of description of our rendering environment.
     * @param [opts] - rendering context options.
     */
    constructor(spec: string | Size | CanvasTypes | WebGL2RenderingContext, opts: WebGLContextAttributes) {
        super();

        // Strings will get interpreted as querySelctors
        if (isString(spec)) {
            // but only in Windows, not Workers
            if (hasHTMLCanvas) {
                spec = document.querySelector(spec) as HTMLCanvasElement;
            } else {
                throw new Error(
                    "Parameter `spec` cannot be a string in Worker contexts."
                );
            }
        }

        // Optionally, we could set a width and height value
        else if (isSize(spec)) {
            if (hasOffscreenCanvas) {
                spec = new OffscreenCanvas(spec.width, spec.height);
            } else if (hasHTMLCanvas) {
                spec = Canvas(width(spec.width), height(spec.height));
            } else {
                throw new Error(
                    "No canvas element creation supported in the current Worker context."
                );
            }
        } else if (spec == null) {
            if (hasHTMLCanvas) {
                spec = Canvas();
            } else if (hasOffscreenCanvas) {
                spec = new OffscreenCanvas(640, 480);
            } else {
                throw new Error(
                    "Parameter `spec` must be provided in Worker contexts."
                );
            }
        }

        // If we have a canvas, get the graphics context
        if (isOffscreenCanvas(spec) || isHTMLCanvas(spec)) {
            spec = spec.getContext("webgl2", opts) as WebGL2RenderingContext;
        }

        // Finally, validate the graphics context
        if (spec instanceof WebGL2RenderingContext) {
            this.gl = spec;
        } else {
            throw new Error(
                "Could not create context: could not discover WebGLRenderingContext from spec"
            );
        }

        const canvas = this.gl.canvas;

        // If we're dealing with HTML canvases, then setup the auto-resizer.
        if (!isOffscreenCanvas(canvas)) {
            const resize = () => {
                this.resize(
                    canvas.clientWidth * devicePixelRatio,
                    canvas.clientHeight * devicePixelRatio
                );
            };

            window.addEventListener("resize", resize);
            setTimeout(resize, 0);
        }
    }

    resize(width: number, height: number) {
        setContextSize(this.gl, width, height);
        this.gl.viewport(0, 0, width, height);
        this.dispatchEvent(new ResizeEvent(width, height));
    }

    get width() {
        return this.gl.canvas.width;
    }

    get height() {
        return this.gl.canvas.height;
    }
}
