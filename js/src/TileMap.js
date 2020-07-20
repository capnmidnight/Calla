import "./protos.js";
import { Graph, astar } from "../lib/astar.js";
import { TileSet } from "./TileSet.js";

class TileMapPrivate {
    constructor(tilemapName) {
        this.url = new URL(`/data/tilemaps/${tilemapName}.tmx`, document.location);
        this.tileset = null;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.layers = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.tiles = null;
        this.collision = null;
        this.graph = null;

        Object.seal(this);
    }
}

const selfs = new WeakMap();

export class TileMap {
    constructor(tilemapName) {
        selfs.set(this, new TileMapPrivate(tilemapName));
    }

    async load() {
        const self = selfs.get(this),
            response = await fetch(self.url.href),
            map = await response.xml(),
            width = 1 * map.getAttribute("width"),
            height = 1 * map.getAttribute("height"),
            tileWidth = 1 * map.getAttribute("tilewidth"),
            tileHeight = 1 * map.getAttribute("tileheight"),
            tileset = map.querySelector("tileset"),
            tilesetSource = tileset.getAttribute("source"),
            layers = map.querySelectorAll("layer > data");

        self.layers = layers.length;
        self.width = width;
        self.height = height;
        self.offsetX = -Math.floor(width / 2);
        self.offsetY = -Math.floor(height / 2);
        self.tileWidth = tileWidth;
        self.tileHeight = tileHeight;

        self.tiles = [];
        for (let layer of layers) {
            const tileIds = layer.innerHTML
                .replace(" ", "")
                .replace("\t", "")
                .replace("\n", "")
                .replace("\r", "")
                .split(","),
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
            self.tiles.push(rows);
        }

        self.tileset = new TileSet(new URL(tilesetSource, self.url));
        await self.tileset.load();
        self.tileWidth = self.tileset.tileWidth;
        self.tileHeight = self.tileset.tileHeight;

        let grid = [];
        for (let row of self.tiles[0]) {
            let gridrow = [];
            for (let tile of row) {
                if (self.tileset.isClear(tile)) {
                    gridrow.push(1);
                } else {
                    gridrow.push(0);
                }
            }
            grid.push(gridrow);
        }
        self.graph = new Graph(grid, { diagonal: true });
    }

    get width() {
        return selfs.get(this).width;
    }

    get height() {
        return selfs.get(this).height;
    }

    get tileWidth() {
        return selfs.get(this).tileWidth;
    }

    get tileHeight() {
        return selfs.get(this).tileHeight;
    }

    isInBounds(x, y) {
        return 0 <= x && x < this.width
            && 0 <= y && y < this.height;
    }

    getGridNode(x, y) {
        const self = selfs.get(this);
        x -= self.offsetX;
        y -= self.offsetY;
        if (this.isInBounds(x, y)) {
            return self.graph.grid[y][x];
        }
        else {
            return null;
        }
    }

    draw(g) {
        const self = selfs.get(this);
        g.save();
        {
            g.translate(self.offsetX * this.tileWidth, self.offsetY * this.tileHeight);
            for (let l = 0; l < self.layers; ++l) {
                const layer = self.tiles[l];
                for (let y = 0; y < this.height; ++y) {
                    const row = layer[y];
                    for (let x = 0; x < this.width; ++x) {
                        const tile = row[x];
                        self.tileset.draw(g, tile, x, y);
                    }
                }
            }
        }
        g.restore();
    }

    searchPath(start, end) {
        const self = selfs.get(this);
        return astar.search(self.graph, start, end)
            .map(p => {
                return {
                    x: p.y + self.offsetX,
                    y: p.x + self.offsetY
                };
            });
    }

    isClear(x, y, avatar) {
        const self = selfs.get(this);
        x -= self.offsetX;
        y -= self.offsetY;
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || self.tileset.isClear(self.tiles[0][y][x])
            || avatar && avatar.canSwim;
    }

    // Use Bresenham's line algorithm (with integer error)
    // to draw a line through the map, cutting it off if
    // it hits a wall.
    getClearTile(x, y, dx, dy, avatar) {
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

    getClearTileNear(x, y, maxRadius, avatar) {
        for (let r = 1; r <= maxRadius; ++r) {
            for (let dx = -r; dx <= r; ++dx) {
                const dy1 = r - Math.abs(dx);
                const dy2 = -dy1;
                const tx = x + dx;
                const ty1 = y + dy1;
                const ty2 = y + dy2;

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
