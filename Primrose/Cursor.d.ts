import { IRow, Row } from "./Row";
export interface ICursor {
    x: number;
    y: number;
    i: number;
}
export declare class Cursor implements ICursor {
    i: number;
    x: number;
    y: number;
    static min<CursorT extends ICursor>(a: CursorT, b: CursorT): CursorT;
    static max<CursorT extends ICursor>(a: CursorT, b: CursorT): CursorT;
    constructor(i?: number, x?: number, y?: number);
    clone(): Cursor;
    toString(): string;
    copy(c: Cursor): void;
    adjust(row: IRow, dir: number): void;
    fullHome(): void;
    fullEnd(rows: readonly IRow[]): void;
    left(rows: readonly IRow[], skipAdjust?: boolean): void;
    skipLeft(rows: readonly Row[]): void;
    right(rows: readonly IRow[], skipAdjust?: boolean): void;
    skipRight(rows: readonly Row[]): void;
    home(): void;
    end(rows: readonly IRow[]): void;
    up(rows: readonly IRow[], skipAdjust?: boolean): void;
    down(rows: readonly IRow[], skipAdjust?: boolean): void;
    incX(rows: readonly IRow[], dx: number): void;
    incY(rows: readonly IRow[], dy: number): void;
    setXY(rows: IRow[], x: number, y: number): void;
    setI(rows: readonly IRow[], i: number): void;
}
