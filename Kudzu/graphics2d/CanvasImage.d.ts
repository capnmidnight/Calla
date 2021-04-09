import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { CanvasTypes, Context2D } from "../html/canvas";
interface CanvasImageEvents {
    redrawn: TypedEvent<"redrawn">;
}
export interface ICanvasImage extends TypedEventBase<CanvasImageEvents> {
    canvas: CanvasTypes;
}
export declare function isCanvasImage(obj: any): obj is ICanvasImage;
export declare abstract class CanvasImage<T> extends TypedEventBase<CanvasImageEvents & T> {
    private _canvas;
    get canvas(): CanvasTypes;
    private _g;
    protected get g(): Context2D;
    private redrawnEvt;
    constructor(width: number, height: number);
    protected fillRect(color: string, x: number, y: number, width: number, height: number, margin: number): void;
    protected drawText(text: string, x: number, y: number, align: CanvasTextAlign): void;
    protected redraw(): void;
    protected abstract onRedraw(): boolean;
}
export {};
