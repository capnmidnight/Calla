import type { CanvasTypes, Context2D } from "kudzu/html/canvas";
import { createUtilityCanvas } from "kudzu/html/canvas";
import { getXml } from "kudzu/io/getXml";
import * as astar from "../lib/astar";
import type { BaseAvatar } from "./avatars/BaseAvatar";
import { TileSet } from "./TileSet";


export class TileMap {
    private _tileWidth = 0;
    private _tileHeight = 0;
    private _layers = 0;
    private _width = 0;
    private _height = 0;
    private _offsetX = 0;
    private _offsetY = 0;
    private _layerImages = new Array<CanvasTypes>();

    private _url: URL = null;
    private _tileset: TileSet = null;
    private _tiles: number[][][] = null;
    private _graph: astar.Graph = null;

    constructor(tilemapName: string) {
        this._url = new URL(`data/tilemaps/${tilemapName}.tmx`, document.baseURI);
    }

    async load() {
        const map = await getXml(this._url.href),
            width = parseInt(map.getAttribute("width"), 10),
            height = parseInt(map.getAttribute("height"), 10),
            tileWidth = parseInt(map.getAttribute("tilewidth"), 10),
            tileHeight = parseInt(map.getAttribute("tileheight"), 10),
            tileset = map.querySelector("tileset"),
            tilesetSource = tileset.getAttribute("source"),
            layers = map.querySelectorAll("layer > data");

        this._layers = layers.length;
        this._width = width;
        this._height = height;
        this._offsetX = -Math.floor(width / 2);
        this._offsetY = -Math.floor(height / 2);
        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;

        this._tiles = [];
        for (let i = 0; i < layers.length; ++i) {
            const layer = layers[i];
            const tileIds = layer.innerHTML
                .replace(" ", "")
                .replace("\t", "")
                .replace("\n", "")
                .replace("\r", "")
                .split(",")
                .map(s => parseInt(s, 10)),
                rows = [];
            let row = [];
            for (let tile of tileIds) {
                row.push(tile);
                if (row.length === width) {
                    rows.push(row);
                    row = [];
                }
            }
            if (row.length > 0) {
                rows.push(row);
            }

            this._tiles.push(rows);
        }

        this._tileset = new TileSet(new URL(tilesetSource, this._url));
        await this._tileset.load();
        this._tileWidth = this._tileset.tileWidth;
        this._tileHeight = this._tileset.tileHeight;

        for (let l = 0; l < this._layers; ++l) {
            const img = createUtilityCanvas(this.width * this.tileWidth, this.height * this.tileHeight);
            this._layerImages.push(img);
            const context = img.getContext("2d");
            const layer = this._tiles[l];
            for (let y = 0; y < this.height; ++y) {
                const row = layer[y];
                for (let x = 0; x < this.width; ++x) {
                    const tile = row[x];
                    this._tileset.draw(context, tile, x, y);
                }
            }
        }

        let grid = [];
        for (let row of this._tiles[0]) {
            let gridrow = [];
            for (let tile of row) {
                if (this._tileset.isClear(tile)) {
                    gridrow.push(1);
                } else {
                    gridrow.push(0);
                }
            }
            grid.push(gridrow);
        }
        this._graph = new astar.Graph(grid, { diagonal: true });
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get tileWidth() {
        return this._tileWidth;
    }

    get tileHeight() {
        return this._tileHeight;
    }

    isInBounds(x: number, y: number): boolean {
        return 0 <= x && x < this.width
            && 0 <= y && y < this.height;
    }

    getGridNode(x: number, y: number): astar.GridNode {
        x -= this._offsetX;
        y -= this._offsetY;
        x = Math.round(x);
        y = Math.round(y);
        if (this.isInBounds(x, y)) {
            return this._graph.grid[y][x];
        }
        else {
            return null;
        }
    }

    draw(g: Context2D) {
        g.save();
        {
            g.translate(this._offsetX * this.tileWidth, this._offsetY * this.tileHeight);
            for (let img of this._layerImages) {
                g.drawImage(img, 0, 0);
            }
        }
        g.restore();
    }

    searchPath(start: astar.GridNode, end: astar.GridNode): { x: number, y: number; }[] {
        return astar.search(this._graph, start, end)
            .map(p => {
                return {
                    x: p.y + this._offsetX,
                    y: p.x + this._offsetY
                };
            });
    }

    isClear(x: number, y: number, avatar: BaseAvatar): boolean {
        x -= this._offsetX;
        y -= this._offsetY;
        x = Math.round(x);
        y = Math.round(y);
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || this._tileset && this._tileset.isClear(this._tiles[0][y][x])
            || avatar && avatar.canSwim;
    }

    // Use Bresenham's line algorithm (with integer error)
    // to draw a line through the map, cutting it off if
    // it hits a wall.
    getClearTile(x: number, y: number, dx: number, dy: number, avatar: BaseAvatar): { x: number, y: number; } {
        const x1 = x + dx,
            y1 = y + dy,
            sx = x < x1 ? 1 : -1,
            sy = y < y1 ? 1 : -1;

        dx = Math.abs(x1 - x);
        dy = Math.abs(y1 - y);

        let err = (dx > dy ? dx : -dy) / 2;

        while (x !== x1
            || y !== y1) {
            const e2 = err;
            if (e2 > -dx) {
                if (this.isClear(x + sx, y, avatar)) {
                    err -= dy;
                    x += sx;
                }
                else {
                    break;
                }
            }
            if (e2 < dy) {
                if (this.isClear(x, y + sy, avatar)) {
                    err += dx;
                    y += sy;
                }
                else {
                    break;
                }
            }
        }

        return { x, y };
    }

    getClearTileNear(x: number, y: number, maxRadius: number, avatar: BaseAvatar): { x: number, y: number; } {
        for (let r = 1; r <= maxRadius; ++r) {
            for (let dx = -r; dx <= r; ++dx) {
                const dy = r - Math.abs(dx);
                const tx = x + dx;
                const ty1 = y + dy;
                const ty2 = y - dy;

                if (this.isClear(tx, ty1, avatar)) {
                    return { x: tx, y: ty1 };
                }
                else if (this.isClear(tx, ty2, avatar)) {
                    return { x: tx, y: ty2 };
                }
            }
        }

        return { x, y };
    }
}
