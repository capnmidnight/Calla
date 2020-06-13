import "./protos.js";
import { TileSet } from "./tileset.js";
import { isSurfer } from "./emoji.js";

// TODO: move map data to requestable files
export class TileMap {
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
    }

    async load() {
        const response = await fetch(this.url.href),
            map = await response.xml(),
            width = 1 * map.getAttribute("width"),
            height = 1 * map.getAttribute("height"),
            tileWidth = 1 * map.getAttribute("tilewidth"),
            tileHeight = 1 * map.getAttribute("tileheight"),
            tileset = map.querySelector("tileset"),
            tilesetSource = tileset.getAttribute("source"),
            layers = map.querySelectorAll("layer > data");

        this.layers = layers.length;
        this.width = width;
        this.height = height;
        this.offsetX = -Math.floor(width / 2);
        this.offsetY = -Math.floor(height / 2);
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.tiles = [];
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
            this.tiles.push(rows);
        }

        this.tileset = new TileSet(new URL(tilesetSource, this.url));
        await this.tileset.load();
        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;
    }

    draw(g) {
        g.save();
        {
            g.translate(this.offsetX * this.tileWidth, this.offsetY * this.tileHeight);
            for (let l = 0; l < this.layers; ++l) {
                const layer = this.tiles[l];
                for (let y = 0; y < this.height; ++y) {
                    const row = layer[y];
                    for (let x = 0; x < this.width; ++x) {
                        const tile = row[x];
                        this.tileset.draw(g, tile, x, y);
                    }
                }
            }
        }
        g.restore();
    }

    isClear(x, y, avatar) {
        x -= this.offsetX;
        y -= this.offsetY;
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || this.tileset.isClear(this.tiles[0][y][x])
            || isSurfer(avatar);
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
}