import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { createUtilityCanvas, isCanvas } from "../html/canvas";
export function isCanvasImage(obj) {
    return "canvas" in obj
        && isCanvas(obj.canvas);
}
export class CanvasImage extends TypedEventBase {
    constructor(width, height) {
        super();
        this.redrawnEvt = new TypedEvent("redrawn");
        this._canvas = createUtilityCanvas(width, height);
        this._g = this.canvas.getContext("2d");
    }
    get canvas() {
        return this._canvas;
    }
    get g() {
        return this._g;
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
}
//# sourceMappingURL=CanvasImage.js.map