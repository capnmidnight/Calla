import { Row } from "./Row";
export declare class Cursor {
    i: number;
    x: number;
    y: number;
    static min(a: Cursor, b: Cursor): Cursor;
    static max(a: Cursor, b: Cursor): Cursor;
    constructor(i?: number, x?: number, y?: number);
    clone(): Cursor;
    toString(): string;
    copy(c: Cursor): void;
    fullHome(): void;
    fullEnd(rows: readonly Row[]): void;
    left(rows: readonly Row[], skipAdjust?: boolean): void;
    skipLeft(rows: readonly Row[]): void;
    right(rows: readonly Row[], skipAdjust?: boolean): void;
    skipRight(rows: readonly Row[]): void;
    home(): void;
    end(rows: readonly Row[]): void;
    up(rows: readonly Row[], skipAdjust?: boolean): void;
    down(rows: readonly Row[], skipAdjust?: boolean): void;
    incX(rows: readonly Row[], dx: number): void;
    incY(rows: readonly Row[], dy: number): void;
    setXY(rows: readonly Row[], x: number, y: number): void;
    setI(rows: readonly Row[], i: number): void;
}
