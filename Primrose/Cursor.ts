import { stringReverse } from "kudzu/strings/stringReverse";
import { isDefined } from "kudzu/typeChecks";
import { Row } from "./Row";

export class Cursor {

    static min(a: Cursor, b: Cursor) {
        if (a.i <= b.i) {
            return a;
        }
        return b;
    }

    static max(a: Cursor, b: Cursor) {
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

    fullHome() {
        this.i = 0;
        this.x = 0;
        this.y = 0;
    }

    fullEnd(rows: readonly Row[]) {
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

    left(rows: readonly Row[], skipAdjust = false) {
        if (this.i > 0) {
            --this.i;
            --this.x;
            if (this.x < 0) {
                --this.y;
                const row = rows[this.y];
                this.x = row.stringLength - 1;
            }
            else if (!skipAdjust) {
                rows[this.y].adjust(this, -1);
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
            rows[this.y].adjust(this, -1);
        }
    }

    right(rows: readonly Row[], skipAdjust = false) {
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
                rows[this.y].adjust(this, 1);
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
            rows[this.y].adjust(this, 1);
        }
        else if (this.y < rows.length - 1) {
            this.right(rows);
        }
    }

    home() {
        this.i -= this.x;
        this.x = 0;
    }

    end(rows: readonly Row[]) {
        const row = rows[this.y];
        let dx = row.stringLength - this.x;
        if (this.y < rows.length - 1) {
            --dx;
        }
        this.i += dx;
        this.x += dx;
    }

    up(rows: readonly Row[], skipAdjust = false) {
        if (this.y > 0) {
            --this.y;
            const row = rows[this.y],
                dx = Math.min(0, row.stringLength - this.x - 1);
            this.x += dx;
            this.i -= row.stringLength - dx;
            if (!skipAdjust) {
                rows[this.y].adjust(this, 1);
            }
        }
    }

    down(rows: readonly Row[], skipAdjust = false) {
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
                rows[this.y].adjust(this, 1);
            }
        }
    }

    incX(rows: readonly Row[], dx: number) {
        const dir = Math.sign(dx);
        dx = Math.abs(dx);
        if (dir === -1) {
            for (let i = 0; i < dx; ++i) {
                this.left(rows, true);
            }
            rows[this.y].adjust(this, -1);
        }
        else if (dir === 1) {
            for (let i = 0; i < dx; ++i) {
                this.right(rows, true);
            }
            rows[this.y].adjust(this, 1);
        }
    }

    incY(rows: readonly Row[], dy: number) {
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
        rows[this.y].adjust(this, 1);
    }

    setXY(rows: readonly Row[], x: number, y: number) {
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
        rows[this.y].adjust(this, 1);
    }

    setI(rows: readonly Row[], i: number) {
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

        rows[this.y].adjust(this, dir);
    }
}
