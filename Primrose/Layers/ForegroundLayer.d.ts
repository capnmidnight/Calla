import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import { CanvasTypes } from "kudzu/html/canvas";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { Layer } from "./Layer";
export declare class ForegroundLayer extends Layer {
    constructor(canvas: CanvasTypes);
    render(theme: Theme, _minCursor: ICursor, _maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, _focused: boolean, rows: IRow[], fontFamily: string, fontSize: number): Promise<void>;
}
