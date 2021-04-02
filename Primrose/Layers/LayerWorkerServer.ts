import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import { WorkerServer } from "kudzu/workers/WorkerServer";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import type { LayerType } from "./BaseLayer";
import { Layer } from "./Layer";

export class LayerWorkerServer extends WorkerServer {

    private layer: Layer;

    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        this.layer = new Layer();

        this.add("createLayer",
            (canvas: OffscreenCanvas, type: LayerType) =>
                this.layer.createLayer(canvas, type));

        this.add(
            "setSize",
            (width: number, height: number, scaleFactor: number) =>
                this.layer.setSize(width, height, scaleFactor));

        this.add(
            "render",
            (theme: Theme,
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
                wordWrap: boolean) =>
                this.layer.render(theme,
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
                    wordWrap));
    }
}