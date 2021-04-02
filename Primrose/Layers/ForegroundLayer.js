import { makeFont } from "kudzu/graphics2d/fonts";
import { isFinalTokenType } from "../Grammars/Token";
import { Dark as DefaultTheme } from "../themes";
import { BaseLayer } from "./BaseLayer";
export class ForegroundLayer extends BaseLayer {
    constructor(width, height) {
        super(width, height);
        this.g.textAlign = "left";
    }
    render(theme, _minCursor, _maxCursor, gridBounds, scroll, character, padding, _focused, rows, fontFamily, fontSize, _showLineNumbers, _lineCountWidth, _showScrollBars, _vScrollWidth, _wordWrap) {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.g.save();
        this.g.scale(this.scaleFactor, this.scaleFactor);
        this.g.translate((gridBounds.point.x - scroll.x) * character.width + padding, padding);
        const minY = scroll.y | 0, maxY = minY + gridBounds.size.height, minX = scroll.x | 0, maxX = minX + gridBounds.size.width;
        this.tokenFront.setXY(rows, 0, minY);
        this.tokenBack.copy(this.tokenFront);
        for (let y = minY; y <= maxY && y < rows.length; ++y) {
            // draw the tokens on this row
            const row = rows[y].tokens, textY = (y - scroll.y) * character.height;
            for (let i = 0; i < row.length; ++i) {
                const t = row[i];
                this.tokenBack.x += t.length;
                this.tokenBack.i += t.length;
                // skip drawing tokens that aren't in view
                if (minX <= this.tokenBack.x
                    && this.tokenFront.x <= maxX) {
                    // draw the text
                    const style = isFinalTokenType(t.type) && theme[t.type] || {}, fontWeight = style.fontWeight
                        || theme.regular.fontWeight
                        || DefaultTheme.regular.fontWeight
                        || "", fontStyle = style.fontStyle
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
                    this.g.fillText(t.value, this.tokenFront.x * character.width, textY);
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
//# sourceMappingURL=ForegroundLayer.js.map