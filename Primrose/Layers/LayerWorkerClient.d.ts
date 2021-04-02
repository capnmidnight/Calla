import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import { CanvasTypes } from "kudzu/html/canvas";
import { WorkerClient } from "kudzu/workers/WorkerClient";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import type { LayerType } from "./BaseLayer";
import type { ILayer } from "./Layer";
export declare class LayerWorkerClient extends WorkerClient implements ILayer {
    private _canvas;
    get canvas(): CanvasTypes;
    createLayer(canvas: CanvasTypes, type: LayerType): Promise<void>;
    setSize(w: number, h: number, scaleFactor: number): Promise<void>;
    render(theme: Theme, minCursor: ICursor, maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[], fontFamily: string, fontSize: number, showLineNumbers: boolean, lineCountWidth: number, showScrollBars: boolean, vScrollWidth: number, wordWrap: boolean): Promise<void>;
}
