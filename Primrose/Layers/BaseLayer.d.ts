import { IPoint } from "kudzu/graphics2d/Point";
import { IRectangle } from "kudzu/graphics2d/Rectangle";
import { ISize } from "kudzu/graphics2d/Size";
import { CanvasTypes, Context2D } from "kudzu/html/canvas";
import { Cursor, ICursor } from "../Cursor";
import { IRow } from "../Row";
import { Theme } from "../themes";
export declare enum LayerType {
    "background" = 0,
    "foreground" = 1,
    "trim" = 2
}
export declare abstract class BaseLayer {
    canvas: CanvasTypes;
    protected scaleFactor: number;
    protected tokenFront: Cursor;
    protected tokenBack: Cursor;
    protected g: Context2D;
    constructor(width: number, height: number);
    protected fillRect(character: ISize, fill: string, x: number, y: number, w: number, h: number): void;
    protected strokeRect(character: ISize, stroke: string, x: number, y: number, w: number, h: number): void;
    setSize(w: number, h: number, scaleFactor: number): Promise<void>;
    abstract render(theme: Theme, minCursor: ICursor, maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[], fontFamily: string, fontSize: number, showLineNumbers: boolean, lineCountWidth: number, showScrollBars: boolean, vScrollWidth: number, wordWrap: boolean): Promise<void>;
}
