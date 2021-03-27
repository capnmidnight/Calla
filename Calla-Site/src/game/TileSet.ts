import { CanvasTypes, Context2D, createUtilityCanvasFromImageBitmap } from "kudzu/html/canvas";
import { IFetcher } from "kudzu/io/IFetcher";
import { using } from "kudzu/using";

export class TileSet {
    name: string = null;
    tileWidth = 0;
    tileHeight = 0;
    tilesPerRow = 0;
    tileCount = 0;
    image: CanvasTypes = null;
    collision = new Map<number, boolean>();

    constructor(private url: URL, private fetcher: IFetcher) {
    }

    async load(): Promise<void> {
        const tileset = await this.fetcher.getXml(this.url.href);
        const image = tileset.querySelector("image");
        const imageSource = image.getAttribute("source");
        const imageURL = new URL(imageSource, this.url);
        const tiles = tileset.querySelectorAll("tile");

        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            const id = parseInt(tile.getAttribute("id"), 10);
            const collid = tile.querySelector("properties > property[name='Collision']");
            const value = collid.getAttribute("value");
            this.collision.set(id, value === "true");
        }

        this.name = tileset.getAttribute("name");
        this.tileWidth = parseInt(tileset.getAttribute("tilewidth"), 10);
        this.tileHeight = parseInt(tileset.getAttribute("tileheight"), 10);
        this.tileCount = parseInt(tileset.getAttribute("tilecount"), 10);

        using(await this.fetcher.getImageBitmap(imageURL.href), (img) =>
            this.image = createUtilityCanvasFromImageBitmap(img));

        this.tilesPerRow = Math.floor(this.image.width / this.tileWidth);
    }

    isClear(tile: number) {
        return !this.collision.get(tile - 1);
    }

    draw(g: Context2D, tile: number, x: number, y: number) {
        if (tile > 0) {
            const idx = tile - 1,
                sx = this.tileWidth * (idx % this.tilesPerRow),
                sy = this.tileHeight * Math.floor(idx / this.tilesPerRow),
                dx = x * this.tileWidth,
                dy = y * this.tileHeight;

            g.drawImage(this.image,
                sx, sy, this.tileWidth, this.tileHeight,
                dx, dy, this.tileWidth, this.tileHeight);
        }
    }
}