import type { Context2D } from "kudzu/html/canvas";
import * as astar from "../lib/astar";
import type { BaseAvatar } from "./avatars/BaseAvatar";
export declare class TileMap {
    private _tileWidth;
    private _tileHeight;
    private _layers;
    private _width;
    private _height;
    private _offsetX;
    private _offsetY;
    private _layerImages;
    private _url;
    private _tileset;
    private _tiles;
    private _graph;
    constructor(tilemapName: string);
    load(): Promise<void>;
    get width(): number;
    get height(): number;
    get tileWidth(): number;
    get tileHeight(): number;
    isInBounds(x: number, y: number): boolean;
    getGridNode(x: number, y: number): astar.GridNode;
    draw(g: Context2D): void;
    searchPath(start: astar.GridNode, end: astar.GridNode): {
        x: number;
        y: number;
    }[];
    isClear(x: number, y: number, avatar: BaseAvatar): boolean;
    getClearTile(x: number, y: number, dx: number, dy: number, avatar: BaseAvatar): {
        x: number;
        y: number;
    };
    getClearTileNear(x: number, y: number, maxRadius: number, avatar: BaseAvatar): {
        x: number;
        y: number;
    };
}
