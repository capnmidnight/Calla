import { CanvasTypes, Context2D } from "kudzu/html/canvas";
import { BackgroundLayer } from "../Layers/BackgroundLayer";
import { ForegroundLayer } from "../Layers/ForegroundLayer";
import { TrimLayer } from "../Layers/TrimLayer";
export interface IPrimroseRenderer {
    context: Context2D;
    fg: ForegroundLayer;
    bg: BackgroundLayer;
    trim: TrimLayer;
    setSize(width: number, height: number, scaleFactor: number): Promise<void>;
    render(): Promise<void>;
}
export declare class PrimroseRenderer implements IPrimroseRenderer {
    private canvas;
    context: Context2D;
    fg: ForegroundLayer;
    bg: BackgroundLayer;
    trim: TrimLayer;
    constructor(canvas: CanvasTypes);
    setSize(width: number, height: number, scaleFactor: number): Promise<void>;
    private get width();
    private get height();
    private scaleFactor;
    render(): Promise<void>;
}
