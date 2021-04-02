import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import { CanvasTypes } from "kudzu/html/canvas";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { LayerType } from "./BaseLayer";
export interface ILayer {
    canvas: CanvasTypes;
    createLayer(canvas: CanvasTypes, type: LayerType): Promise<void>;
    setSize(w: number, h: number, scaleFactor: number): Promise<void>;
    render(theme: Theme, minCursor: ICursor, maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[], fontFamily: string, fontSize: number, showLineNumbers: boolean, lineCountWidth: number, showScrollBars: boolean, vScrollWidth: number, wordWrap: boolean): Promise<void>;
}
export declare class Layer implements ILayer {
    private layer;
    private _canvas;
    get canvas(): CanvasTypes;
    createLayer(canvas: CanvasTypes, type: LayerType): Promise<void>;
    setSize(w: number, h: number, scaleFactor: number): Promise<void>;
    render(theme: Theme, minCursor: ICursor, maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[], fontFamily: string, fontSize: number, showLineNumbers: boolean, lineCountWidth: number, showScrollBars: boolean, vScrollWidth: number, wordWrap: boolean): Promise<void>;
}
