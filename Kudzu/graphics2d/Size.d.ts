export declare class Size {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    set(width: number, height: number): void;
    copy(s: Size): void;
    clone(): Size;
    toString(): string;
}
