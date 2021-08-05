import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { createUICanvas, isCanvas, isHTMLCanvas } from "../html/canvas";
import { isDefined } from "../typeChecks";
export function isCanvasImage(obj) {
    return "canvas" in obj
        && isCanvas(obj.canvas);
}
export class CanvasImage extends TypedEventBase {
    _canvas;
    _scale = 250;
    _g;
    redrawnEvt = new TypedEvent("redrawn");
    element = null;
    constructor(width, height, options) {
        super();
        if (isDefined(options)) {
            if (isDefined(options.scale)) {
                this._scale = options.scale;
            }
        }
        this._canvas = createUICanvas(width, height);
        this._g = this.canvas.getContext("2d");
        if (isHTMLCanvas(this._canvas)) {
            this.element = this._canvas;
        }
    }
    fillRect(color, x, y, width, height, margin) {
        this.g.fillStyle = color;
        this.g.fillRect(x + margin, y + margin, width - 2 * margin, height - 2 * margin);
    }
    drawText(text, x, y, align) {
        this.g.textAlign = align;
        this.g.strokeText(text, x, y);
        this.g.fillText(text, x, y);
    }
    redraw() {
        if (this.onRedraw()) {
            this.dispatchEvent(this.redrawnEvt);
        }
    }
    get canvas() {
        return this._canvas;
    }
    get g() {
        return this._g;
    }
    get imageWidth() {
        return this.canvas.width;
    }
    get imageHeight() {
        return this.canvas.height;
    }
    get aspectRatio() {
        return this.imageWidth / this.imageHeight;
    }
    get width() {
        return this.imageWidth / this.scale;
    }
    get height() {
        return this.imageHeight / this.scale;
    }
    get scale() {
        return this._scale;
    }
    set scale(v) {
        if (this.scale !== v) {
            this._scale = v;
            this.redraw();
        }
    }
}
//# sourceMappingURL=CanvasImage.js.map