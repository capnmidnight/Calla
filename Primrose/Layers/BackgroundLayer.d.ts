import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { BaseLayer } from "./BaseLayer";
export declare class BackgroundLayer extends BaseLayer {
    render(theme: Theme, minCursor: ICursor, maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[]): Promise<void>;
}
