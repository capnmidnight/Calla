import { Cursor } from "../Cursor";
import { Dark as DefaultTheme } from "../themes";
import { Layer } from "./Layer";
export class BackgroundLayer extends Layer {
    render(theme, minCursor, maxCursor, gridBounds, scroll, character, padding, focused, rows, _fontFamily, _fontSize, _showLineNumbers, _lineCountWidth, _showScrollBars, _vScrollWidth, _wordWrap) {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (theme.regular.backColor) {
            this.g.fillStyle = theme.regular.backColor;
            this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.g.save();
        this.g.scale(this.scaleFactor, this.scaleFactor);
        this.g.translate((gridBounds.x - scroll.x) * character.width + padding, -scroll.y * character.height + padding);
        // draw the current row highlighter
        if (focused) {
            this.fillRect(character, theme.currentRowBackColor ||
                DefaultTheme.currentRowBackColor, 0, minCursor.y, gridBounds.width, maxCursor.y - minCursor.y + 1);
        }
        const minY = scroll.y | 0, maxY = minY + gridBounds.height, minX = scroll.x | 0, maxX = minX + gridBounds.width;
        this.tokenFront.setXY(rows, 0, minY);
        this.tokenBack.copy(this.tokenFront);
        for (let y = minY; y <= maxY && y < rows.length; ++y) {
            // draw the tokens on this row
            const row = rows[y].tokens;
            for (let i = 0; i < row.length; ++i) {
                const t = row[i];
                this.tokenBack.x += t.length;
                this.tokenBack.i += t.length;
                // skip drawing tokens that aren't in view
                if (minX <= this.tokenBack.x && this.tokenFront.x <= maxX) {
                    // draw the selection box
                    const inSelection = minCursor.i <= this.tokenBack.i
                        && this.tokenFront.i < maxCursor.i;
                    if (inSelection) {
                        const selectionFront = Cursor.max(minCursor, this.tokenFront), selectionBack = Cursor.min(maxCursor, this.tokenBack), cw = selectionBack.i - selectionFront.i;
                        this.fillRect(character, theme.selectedBackColor ||
                            DefaultTheme.selectedBackColor, selectionFront.x, selectionFront.y, cw, 1);
                    }
                }
                this.tokenFront.copy(this.tokenBack);
            }
            this.tokenFront.x = 0;
            ++this.tokenFront.y;
            this.tokenBack.copy(this.tokenFront);
        }
        // draw the cursor caret
        if (focused) {
            const cc = theme.cursorColor || DefaultTheme.cursorColor, w = 1 / character.width;
            this.fillRect(character, cc, minCursor.x, minCursor.y, w, 1);
            this.fillRect(character, cc, maxCursor.x, maxCursor.y, w, 1);
        }
        this.g.restore();
        return Promise.resolve();
    }
}
//# sourceMappingURL=BackgroundLayer.js.map