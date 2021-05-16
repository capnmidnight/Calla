import { isDefined } from "../typeChecks";
import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { CanvasTypes, Context2D, createUtilityCanvas, isCanvas } from "../html/canvas";

interface CanvasImageEvents {
    redrawn: TypedEvent<"redrawn">;
}

export interface ICanvasImage extends TypedEventBase<CanvasImageEvents> {
    canvas: CanvasTypes;
    scale: number;
    width: number;
    height: number;
    aspectRatio: number;
}

export interface CanvasImageOptions {
    scale: number;
}

export function isCanvasImage(obj: any): obj is ICanvasImage {
    return "canvas" in obj
        && isCanvas(obj.canvas);
}

export abstract class CanvasImage<T>
    extends TypedEventBase<CanvasImageEvents & T>
    implements ICanvasImage {

    private _canvas: CanvasTypes;
    private _scale = 250;
    private _g: Context2D;

    private redrawnEvt = new TypedEvent("redrawn");

    constructor(width: number, height: number, options?: Partial<CanvasImageOptions>) {
        super();

        if (isDefined(options)) {

            if (isDefined(options.scale)) {
                this._scale = options.scale;
            }

        }

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

    get canvas() {
        return this._canvas;
    }

    protected get g() {
        return this._g;
    }

    get imageWidth(): number {
        return this.canvas.width;
    }

    get imageHeight(): number {
        return this.canvas.height;
    }

    get aspectRatio(): number {
        return this.imageWidth / this.imageHeight;
    }

    get width(): number {
        return this.imageWidth / this.scale;
    }

    get height(): number {
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

    protected abstract onRedraw(): boolean;
}
