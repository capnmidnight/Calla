export declare class TileSet {
    constructor(url: any);
    load(): Promise<void>;
    isClear(tile: any): boolean;
    draw(g: any, tile: any, x: any, y: any): void;
}
