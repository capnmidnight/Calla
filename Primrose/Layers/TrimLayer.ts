import { makeFont } from "kudzu/graphics2d/fonts";
import type { IPoint } from "kudzu/graphics2d/Point";
import type { IRectangle } from "kudzu/graphics2d/Rectangle";
import type { ISize } from "kudzu/graphics2d/Size";
import type { ICursor } from "../Cursor";
import type { IRow } from "../Row";
import type { Theme } from "../themes";
import { Dark as DefaultTheme } from "../themes";
import { BaseLayer } from "./BaseLayer";

export class TrimLayer extends BaseLayer {

    constructor(width: number, height: number) {
        super(width, height);
        this.g.textAlign = "right";
    }

    render(theme: Theme,
        _minCursor: ICursor,
        _maxCursor: ICursor,
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
        wordWrap: boolean) {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.g.save();
        this.g.scale(this.scaleFactor, this.scaleFactor);
        this.g.translate(padding, padding);

        const width = this.canvas.width / this.scaleFactor;
        const height = this.canvas.height / this.scaleFactor;

        if (showLineNumbers) {
            this.fillRect(character, theme.selectedBackColor ||
                DefaultTheme.selectedBackColor,
                0, 0,
                gridBounds.point.x, width - padding * 2);
            this.strokeRect(character,
                theme.regular.foreColor ||
                DefaultTheme.regular.foreColor,
                0, 0,
                gridBounds.point.x, height - padding * 2);
        }

        let maxRowWidth = 2;
        this.g.save();
        {
            this.g.translate((lineCountWidth - 0.5) * character.width, -scroll.y * character.height);
            let lastLineNumber = -1;
            const minY = scroll.y | 0,
                maxY = minY + gridBounds.size.height;
            this.tokenFront.setXY(rows, 0, minY);
            this.tokenBack.copy(this.tokenFront);
            for (let y = minY; y <= maxY && y < rows.length; ++y) {
                const row = rows[y];
                maxRowWidth = Math.max(maxRowWidth, row.text.length);
                if (showLineNumbers) {
                    // draw the left gutter
                    if (row.lineNumber > lastLineNumber) {
                        lastLineNumber = row.lineNumber;
                        this.g.font = makeFont({
                            fontFamily,
                            fontSize,
                            fontWeight: "bold"
                        });
                        this.g.fillStyle = theme.regular.foreColor;
                        this.g.fillText(
                            (row.lineNumber + 1).toFixed(0),
                            0, y * character.height);
                    }
                }
            }
        }
        this.g.restore();

        // draw the scrollbars
        if (showScrollBars) {
            this.g.fillStyle = theme.selectedBackColor ||
                DefaultTheme.selectedBackColor;

            // horizontal
            if (!wordWrap && maxRowWidth > gridBounds.size.width) {
                const drawWidth = gridBounds.size.width * character.width - padding,
                    scrollX = (scroll.x * drawWidth) / maxRowWidth + gridBounds.point.x * character.width,
                    scrollBarWidth = drawWidth * (gridBounds.size.width / maxRowWidth),
                    by = height - character.height - padding,
                    bw = Math.max(character.width, scrollBarWidth);
                this.g.fillRect(scrollX, by, bw, character.height);
                this.g.strokeRect(scrollX, by, bw, character.height);
            }

            //vertical
            if (rows.length > gridBounds.size.height) {
                const drawHeight = gridBounds.size.height * character.height,
                    scrollY = (scroll.y * drawHeight) / rows.length,
                    scrollBarHeight = drawHeight * (gridBounds.size.height / rows.length),
                    bx = width - vScrollWidth * character.width - 2 * padding,
                    bw = vScrollWidth * character.width,
                    bh = Math.max(character.height, scrollBarHeight);
                this.g.fillRect(bx, scrollY, bw, bh);
                this.g.strokeRect(bx, scrollY, bw, bh);
            }
        }

        this.g.restore();
        if (!focused) {
            this.g.fillStyle = theme.unfocused || DefaultTheme.unfocused;
            this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        return Promise.resolve();
    }
}