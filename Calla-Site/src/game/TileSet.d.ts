import type { Context2D } from "kudzu/html/canvas";
export declare class TileSet {
    private url;
    name: string;
    tileWidth: number;
    tileHeight: number;
    tilesPerRow: number;
    tileCount: number;
    image: HTMLImageElement;
    collision: Map<number, boolean>;
    constructor(url: URL);
    load(): Promise<void>;
    isClear(tile: number): boolean;
    draw(g: Context2D, tile: number, x: number, y: number): void;
}
