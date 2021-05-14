import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { createUtilityCanvas, isCanvas } from "../html/canvas";
export function isCanvasImage(obj) {
    return "canvas" in obj
        && isCanvas(obj.canvas);
}
export class CanvasImage extends TypedEventBase {
    constructor(width, height) {
        super();
        this._scale = 500;
        this.redrawnEvt = new TypedEvent("redrawn");
        this._canvas = createUtilityCanvas(width, height);
        this._g = this.canvas.getContext("2d");
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