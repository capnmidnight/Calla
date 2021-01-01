export declare class TileMap {
    constructor(tilemapName: any);
    load(): Promise<void>;
    get width(): any;
    get height(): any;
    get tileWidth(): any;
    get tileHeight(): any;
    isInBounds(x: any, y: any): boolean;
    getGridNode(x: any, y: any): any;
    draw(g: any): void;
    searchPath(start: any, end: any): any;
    isClear(x: any, y: any, avatar: any): any;
    getClearTile(x: any, y: any, dx: any, dy: any, avatar: any): {
        x: any;
        y: any;
    };
    getClearTileNear(x: any, y: any, maxRadius: any, avatar: any): {
        x: any;
        y: any;
    };
}
