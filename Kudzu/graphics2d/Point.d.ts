import type { Rectangle } from "./Rectangle";
export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): void;
    copy(p: Point): void;
    toCell(character: Rectangle, scroll: Point, gridBounds: Rectangle): void;
    inBounds(bounds: Rectangle): boolean;
    clone(): Point;
    toString(): string;
}
