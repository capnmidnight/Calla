import { TileSet } from "./tileset.js";

// TODO: move map data to requestable files
export class TileMap {
    constructor(tilemapName) {
        this.tilemapName = tilemapName;
        this.tileset = null;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.tiles = null;
        this.collision = null;
    }

    async load() {
        const response = await fetch(`data/tilemaps/${this.tilemapName}.json`),
            data = await response.json();
        this.tileset = new TileSet(data.tileset);
        this.offsetX = data.offset.x;
        this.offsetY = data.offset.y;
        this.tiles = data.tiles;
        this.width = this.tiles[0].length;
        this.height = this.tiles.length;
        this.collision = data.collision;
        await this.tileset.load();
        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;
    }

    draw(g) {
        g.save();
        {
            g.translate(this.offsetX * this.tileWidth, this.offsetY * this.tileHeight);
            for (let y = 0; y < this.height; ++y) {
                for (let x = 0; x < this.width; ++x) {
                    const tile = this.tiles[y][x];
                    this.tileset.draw(g, tile, x, y);
                }
            }
        }
        g.restore();
    }

    isClear(x, y) {
        x -= this.offsetX;
        y -= this.offsetY;
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || this.collision[y][x] != 1;
    }

    // Use Bresenham's line algorithm (with integer error)
    // to draw a line through the map, cutting it off if
    // it hits a wall.
    getClearTile(x, y, dx, dy) {
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
                if (this.isClear(x + sx, y)) {
                    err -= dy;
                    x += sx;
                }
                else {
                    break;
                }
            }
            if (e2 < dy) {
                if (this.isClear(x, y + sy)) {
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
}