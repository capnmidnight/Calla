export interface ISize {
    width: number;
    height: number;
}
export declare class Size implements ISize {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    set(width: number, height: number): void;
    copy(s: Size): void;
    clone(): Size;
    toString(): string;
}
