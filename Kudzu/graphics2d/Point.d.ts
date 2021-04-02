import type { Rectangle } from "./Rectangle";
import { Size } from "./Size";
export interface IPoint {
    x: number;
    y: number;
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): void;
    copy(p: Point): void;
    toCell(character: Size, scroll: Point, gridBounds: Rectangle): void;
    inBounds(bounds: Rectangle): boolean;
    clone(): Point;
    toString(): string;
}
