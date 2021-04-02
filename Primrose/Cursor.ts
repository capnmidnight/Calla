import { stringReverse } from "kudzu/strings/stringReverse";
import { isDefined } from "kudzu/typeChecks";
import { IRow, Row } from "./Row";

export interface ICursor {
    x: number;
    y: number;
    i: number;
}

export class Cursor implements ICursor {

    static min<CursorT extends ICursor>(a: CursorT, b: CursorT) {
        if (a.i <= b.i) {
            return a;
        }
        return b;
    }

    static max<CursorT extends ICursor>(a: CursorT, b: CursorT) {
        if (a.i > b.i) {
            return a;
        }
        return b;
    }

    constructor(public i: number = 0, public x: number = 0, public y: number = 0) {
        Object.seal(this);
    }

    clone() {
        return new Cursor(this.i, this.x, this.y);
    }

    toString() {
        return `[i:${this.i} x:${this.x} y:${this.y}]`;
    }

    copy(c: Cursor) {
        if (isDefined(c)) {
            this.i = c.i;
            this.x = c.x;
            this.y = c.y;
        }
    }

    adjust(row: IRow, dir: number) {
        const correction = dir === -1
            ? row.leftCorrections
            : row.rightCorrections;

        if (this.x < correction.length) {
            const delta = correction[this.x];
            this.x += delta;
            this.i += delta;
        }
        else if (dir === 1
            && row.text[row.text.length - 1] === '\n') {
            this.adjust(row, -1);
        }
    }

    fullHome() {
        this.i = 0;
        this.x = 0;
        this.y = 0;
    }

    fullEnd(rows: readonly IRow[]) {
        this.i = 0;
        let lastLength = 0;
        for (let y = 0; y < rows.length; ++y) {
            const row = rows[y];
            lastLength = row.stringLength;
            this.i += lastLength;
        }
        this.y = rows.length - 1;
        this.x = lastLength;
    }

    left(rows: readonly IRow[], skipAdjust = false) {
        if (this.i > 0) {
            --this.i;
            --this.x;
            if (this.x < 0) {
                --this.y;
                const row = rows[this.y];
                this.x = row.stringLength - 1;
            }
            else if (!skipAdjust) {
                this.adjust(rows[this.y], -1);
            }
        }
    }

    skipLeft(rows: readonly Row[]) {
        if (this.x <= 1) {
            this.left(rows);
        }
        else {
            const x = this.x - 1,
                row = rows[this.y],
                word = stringReverse(row.substring(0, x)),
                m = word.match(/\w+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : this.x;
            this.i -= dx;
            this.x -= dx;
            this.adjust(rows[this.y], -1);
        }
    }

    right(rows: readonly IRow[], skipAdjust = false) {
        const row = rows[this.y];
        if (this.y < rows.length - 1
            || this.x < row.stringLength) {
            ++this.i;
            ++this.x;
            if (this.y < rows.length - 1
                && this.x === row.stringLength) {
                this.x = 0;
                ++this.y;
            }
            else if (!skipAdjust) {
                this.adjust(rows[this.y], 1);
            }
        }
    }

    skipRight(rows: readonly Row[]) {
        const row = rows[this.y];
        if (this.x < row.stringLength - 1) {
            const x = this.x + 1,
                subrow = row.substring(x),
                m = subrow.match(/\w+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : (row.stringLength - this.x);
            this.i += dx;
            this.x += dx;
            if (this.x > 0
                && this.x === row.stringLength
                && this.y < rows.length - 1) {
                --this.x;
                --this.i;
            }
            this.adjust(rows[this.y], 1);
        }
        else if (this.y < rows.length - 1) {
            this.right(rows);
        }
    }

    home() {
        this.i -= this.x;
        this.x = 0;
    }

    end(rows: readonly IRow[]) {
        const row = rows[this.y];
        let dx = row.stringLength - this.x;
        if (this.y < rows.length - 1) {
            --dx;
        }
        this.i += dx;
        this.x += dx;
    }

    up(rows: readonly IRow[], skipAdjust = false) {
        if (this.y > 0) {
            --this.y;
            const row = rows[this.y],
                dx = Math.min(0, row.stringLength - this.x - 1);
            this.x += dx;
            this.i -= row.stringLength - dx;
            if (!skipAdjust) {
                this.adjust(rows[this.y], 1);
            }
        }
    }

    down(rows: readonly IRow[], skipAdjust = false) {
        if (this.y < rows.length - 1) {
            const prevRow = rows[this.y];
            ++this.y;
            this.i += prevRow.stringLength;

            const row = rows[this.y];
            if (this.x >= row.stringLength) {
                let dx = this.x - row.stringLength;
                if (this.y < rows.length - 1) {
                    ++dx;
                }
                this.i -= dx;
                this.x -= dx;
            }
            if (!skipAdjust) {
                this.adjust(rows[this.y], 1);
            }
        }
    }

    incX(rows: readonly IRow[], dx: number) {
        const dir = Math.sign(dx);
        dx = Math.abs(dx);
        if (dir === -1) {
            for (let i = 0; i < dx; ++i) {
                this.left(rows, true);
            }
            this.adjust(rows[this.y], -1);
        }
        else if (dir === 1) {
            for (let i = 0; i < dx; ++i) {
                this.right(rows, true);
            }
            this.adjust(rows[this.y], 1);
        }
    }

    incY(rows: readonly IRow[], dy: number) {
        const dir = Math.sign(dy);
        dy = Math.abs(dy);
        if (dir === -1) {
            for (let i = 0; i < dy; ++i) {
                this.up(rows, true);
            }
        }
        else if (dir === 1) {
            for (let i = 0; i < dy; ++i) {
                this.down(rows, true);
            }
        }
        this.adjust(rows[this.y], 1);
    }

    setXY(rows: IRow[], x: number, y: number) {
        x = Math.floor(x);
        y = Math.floor(y);
        this.y = Math.max(0, Math.min(rows.length - 1, y));
        const row = rows[this.y];
        this.x = Math.max(0, Math.min(row.stringLength, x));
        this.i = this.x;
        for (let i = 0; i < this.y; ++i) {
            this.i += rows[i].stringLength;
        }
        if (this.x > 0
            && this.x === row.stringLength
            && this.y < rows.length - 1) {
            --this.x;
            --this.i;
        }
        this.adjust(rows[this.y], 1);
    }

    setI(rows: readonly IRow[], i: number) {
        const delta = this.i - i,
            dir = Math.sign(delta);
        this.x = this.i = i;
        this.y = 0;
        let total = 0,
            row = rows[this.y];
        while (this.x > row.stringLength) {
            this.x -= row.stringLength;
            total += row.stringLength;
            if (this.y >= rows.length - 1) {
                this.i = total;
                this.x = row.stringLength;
                break;
            }
            ++this.y;
            row = rows[this.y];
        }

        if (this.y < rows.length - 1
            && this.x === row.stringLength) {
            this.x = 0;
            ++this.y;
        }

        this.adjust(rows[this.y], dir);
    }
}
