import { makeFont } from "kudzu/graphics2d/fonts";
import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import type { ICursor } from "../Cursor";
import { isFinalTokenType } from "../Grammars/Token";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { Dark as DefaultTheme } from "../themes";
import { BaseLayer } from "./BaseLayer";

export class ForegroundLayer extends BaseLayer {

    constructor(width: number, height: number) {
        super(width, height);
        this.g.textAlign = "left";
    }

    render(theme: Theme,
        _minCursor: ICursor,
        _maxCursor: ICursor,
        gridBounds: IRectangle,
        scroll: IPoint,
        character: ISize,
        padding: number,
        _focused: boolean,
        rows: IRow[],
        fontFamily: string,
        fontSize: number,
        _showLineNumbers: boolean,
        _lineCountWidth: number,
        _showScrollBars: boolean,
        _vScrollWidth: number,
        _wordWrap: boolean) {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.g.save();
        this.g.scale(this.scaleFactor, this.scaleFactor);
        this.g.translate(
            (gridBounds.point.x - scroll.x) * character.width + padding,
            padding);

        const minY = scroll.y | 0,
            maxY = minY + gridBounds.size.height,
            minX = scroll.x | 0,
            maxX = minX + gridBounds.size.width;
        this.tokenFront.setXY(rows, 0, minY);
        this.tokenBack.copy(this.tokenFront);
        for (let y = minY; y <= maxY && y < rows.length; ++y) {
            // draw the tokens on this row
            const row = rows[y].tokens,
                textY = (y - scroll.y) * character.height;

            for (let i = 0; i < row.length; ++i) {
                const t = row[i];
                this.tokenBack.x += t.length;
                this.tokenBack.i += t.length;
                // skip drawing tokens that aren't in view
                if (minX <= this.tokenBack.x
                    && this.tokenFront.x <= maxX) {

                    // draw the text
                    const style = isFinalTokenType(t.type) && theme[t.type] || {},
                        fontWeight = style.fontWeight
                            || theme.regular.fontWeight
                            || DefaultTheme.regular.fontWeight
                            || "",
                        fontStyle = style.fontStyle
                            || theme.regular.fontStyle
                            || DefaultTheme.regular.fontStyle
                            || "";
                    this.g.font = makeFont({
                        fontFamily,
                        fontSize,
                        fontWeight,
                        fontStyle
                    });
                    this.g.fillStyle = style.foreColor || theme.regular.foreColor;
                    this.g.fillText(
                        t.value,
                        this.tokenFront.x * character.width,
                        textY);
                }

                this.tokenFront.copy(this.tokenBack);
            }

            this.tokenFront.x = 0;
            ++this.tokenFront.y;
            this.tokenBack.copy(this.tokenFront);
        }

        this.g.restore();

        return Promise.resolve();
    }
}