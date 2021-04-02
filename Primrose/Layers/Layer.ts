import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import type { CanvasTypes } from "kudzu/html/canvas";
import { assertNever } from "kudzu/typeChecks";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { BackgroundLayer } from "./BackgroundLayer";
import type { BaseLayer } from "./BaseLayer";
import { LayerType } from "./BaseLayer";
import { ForegroundLayer } from "./ForegroundLayer";
import { TrimLayer } from "./TrimLayer";

export interface ILayer {
    canvas: CanvasTypes;
    createLayer(canvas: CanvasTypes, type: LayerType): Promise<void>;
    setSize(w: number, h: number, scaleFactor: number): Promise<void>;
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
        wordWrap: boolean): Promise<void>;
}

export class Layer implements ILayer {
    private layer: BaseLayer = null;

    private _canvas: CanvasTypes = null;
    get canvas() {
        return this._canvas;
    }

    createLayer(canvas: CanvasTypes, type: LayerType): Promise<void> {
        this._canvas = canvas;
        switch (type) {
            case LayerType.background:
                this.layer = new BackgroundLayer(canvas);
                break;
            case LayerType.foreground:
                this.layer = new ForegroundLayer(canvas);
                break;
            case LayerType.trim:
                this.layer = new TrimLayer(canvas);
                break;
            default:
                assertNever(type);
        }

        return Promise.resolve();
    }

    setSize(w: number, h: number, scaleFactor: number): Promise<void> {
        return this.layer.setSize(w, h, scaleFactor);
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
        return this.layer.render(
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
            wordWrap);
    }
}
