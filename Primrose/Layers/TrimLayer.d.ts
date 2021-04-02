import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { BaseLayer } from "./BaseLayer";
export declare class TrimLayer extends BaseLayer {
    constructor(width: number, height: number);
    render(theme: Theme, gridBounds: IRectangle, scroll: IPoint, character: ISize, padding: number, focused: boolean, rows: IRow[], fontFamily: string, fontSize: number, showLineNumbers: boolean, lineCountWidth: number, showScrollBars: boolean, vScrollWidth: number, wordWrap: boolean): Promise<void>;
}
