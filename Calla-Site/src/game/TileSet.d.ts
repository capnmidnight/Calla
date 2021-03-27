import { CanvasImageTypes, Context2D } from "kudzu/html/canvas";
import { IFetcher } from "kudzu/io/IFetcher";
export declare class TileSet {
    private url;
    private fetcher;
    name: string;
    tileWidth: number;
    tileHeight: number;
    tilesPerRow: number;
    tileCount: number;
    image: CanvasImageTypes;
    collision: Map<number, boolean>;
    constructor(url: URL, fetcher: IFetcher);
    load(): Promise<void>;
    isClear(tile: number): boolean;
    draw(g: Context2D, tile: number, x: number, y: number): void;
}
