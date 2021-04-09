import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { CanvasTypes, Context2D, createUtilityCanvas, isCanvas } from "../html/canvas";

interface CanvasImageEvents {
    redrawn: TypedEvent<"redrawn">;
}

export interface ICanvasImage extends TypedEventBase<CanvasImageEvents> {
    canvas: CanvasTypes;
}

export function isCanvasImage(obj: any): obj is ICanvasImage {
    return "canvas" in obj
        && isCanvas(obj.canvas);
}

export abstract class CanvasImage<T> extends TypedEventBase<CanvasImageEvents & T> {
    private _canvas: CanvasTypes;
    get canvas() {
        return this._canvas;
    }

    private _g: Context2D;
    protected get g() {
        return this._g;
    }

    private redrawnEvt = new TypedEvent("redrawn");

    constructor(width: number, height: number) {
        super();

        this._canvas = createUtilityCanvas(width, height);
        this._g = this.canvas.getContext("2d");
    }

    protected fillRect(color: string, x: number, y: number, width: number, height: number, margin: number) {
        this.g.fillStyle = color;
        this.g.fillRect(x + margin, y + margin, width - 2 * margin, height - 2 * margin);
    }

    protected drawText(text: string, x: number, y: number, align: CanvasTextAlign) {
        this.g.textAlign = align;
        this.g.strokeText(text, x, y);
        this.g.fillText(text, x, y);
    }

    protected redraw(): void {
        if (this.onRedraw()) {
            this.dispatchEvent(this.redrawnEvt);
        }
    }

    protected abstract onRedraw(): boolean;
}
