import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import { CanvasTypes, isOffscreenCanvas } from "kudzu/html/canvas";
import { WorkerClient } from "kudzu/workers/WorkerClient";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import type { LayerType } from "./BaseLayer";
import type { ILayer } from "./Layer";

export class LayerWorkerClient
    extends WorkerClient
    implements ILayer {

    private _canvas: OffscreenCanvas;
    get canvas(): CanvasTypes {
        return this._canvas;
    }

    createLayer(canvas: CanvasTypes, type: LayerType): Promise<void> {
        this._canvas = isOffscreenCanvas(canvas)
            ? canvas
            : canvas.transferControlToOffscreen();
        return this.execute("createLayer", [this._canvas, type], [this._canvas]);
    }

    setSize(w: number, h: number, scaleFactor: number): Promise<void> {
        return this.execute("setSize", [w, h, scaleFactor]);
    }

    render(theme: Theme,
        minCursor: ICursor,
        maxCursor: ICursor,
        gridBounds: IRectangle,
        scroll: IPoint,
        character: ISize,
        padding: number,
        focused: boolean,
        rows: IRow[],
        fontFamily: string,
        fontSize: number,
        showLineNumbers: boolean,
        lineCountWidth: number,
        showScrollBars: boolean,
        vScrollWidth: number,
        wordWrap: boolean): Promise<void> {
        return this.execute("render", [
            theme,
            minCursor,
            maxCursor,
            gridBounds,
            scroll,
            character,
            padding,
            focused,
            rows,
            fontFamily,
            fontSize,
            showLineNumbers,
            lineCountWidth,
            showScrollBars,
            vScrollWidth,
            wordWrap
        ]);
    }


}