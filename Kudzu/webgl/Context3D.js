import { TypedEventBase } from "../events/EventBase";
import { height, width } from "../html/attrs";
import { hasHTMLCanvas, hasOffscreenCanvas, isHTMLCanvas, isOffscreenCanvas, setContextSize } from "../html/canvas";
import { Canvas } from "../html/tags";
import { isNumber, isString } from "../typeChecks";
function isSize(obj) {
    const maybeSize = obj;
    return isNumber(maybeSize.width) && isNumber(maybeSize.height);
}
export class ResizeEvent extends Event {
    constructor(width, height) {
        super("resize");
        this.width = width;
        this.height = height;
        Object.seal(this);
    }
}
// Let's start with the context.
export class Context3D extends TypedEventBase {
    /**
     * Creates a wrapper around a WebGLRenderingContext to combine some
     * application lifecycle events that we always want to perform.
     * @param spec - some sort of description of our rendering environment.
     * @param [opts] - rendering context options.
     */
    constructor(spec, opts) {
        super();
        // Strings will get interpreted as querySelctors
        if (isString(spec)) {
            // but only in Windows, not Workers
            if (hasHTMLCanvas) {
                spec = document.querySelector(spec);
            }
            else {
                throw new Error("Parameter `spec` cannot be a string in Worker contexts.");
            }
        }
        // Optionally, we could set a width and height value
        else if (isSize(spec)) {
            if (hasOffscreenCanvas) {
                spec = new OffscreenCanvas(spec.width, spec.height);
            }
            else if (hasHTMLCanvas) {
                spec = Canvas(width(spec.width), height(spec.height));
            }
            else {
                throw new Error("No canvas element creation supported in the current Worker context.");
            }
        }
        else if (spec == null) {
            if (hasHTMLCanvas) {
                spec = Canvas();
            }
            else if (hasOffscreenCanvas) {
                spec = new OffscreenCanvas(640, 480);
            }
            else {
                throw new Error("Parameter `spec` must be provided in Worker contexts.");
            }
        }
        // If we have a canvas, get the graphics context
        if (isHTMLCanvas(spec) || isOffscreenCanvas(spec)) {
            spec = spec.getContext("webgl2", opts);
        }
        // Finally, validate the graphics context
        if (spec instanceof WebGL2RenderingContext) {
            this.gl = spec;
        }
        else {
            throw new Error("Could not create context: could not discover WebGLRenderingContext from spec");
        }
        const canvas = this.gl.canvas;
        // If we're dealing with HTML canvases, then setup the auto-resizer.
        if (canvas instanceof HTMLCanvasElement) {
            const resize = () => {
                this.resize(canvas.clientWidth * devicePixelRatio, canvas.clientHeight * devicePixelRatio);
            };
            window.addEventListener("resize", resize);
            setTimeout(resize, 0);
        }
    }
    resize(width, height) {
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
//# sourceMappingURL=Context3D.js.map