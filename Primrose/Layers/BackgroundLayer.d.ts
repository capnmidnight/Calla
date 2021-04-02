import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { Layer } from "./Layer";
export declare class BackgroundLayer extends Layer {
    render(theme: Theme, minCursor: ICursor, maxCursor: ICursor, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[], _fontFamily: string, _fontSize: number, _showLineNumbers: boolean, _lineCountWidth: number, _showScrollBars: boolean, _vScrollWidth: number, _wordWrap: boolean): Promise<void>;
}
