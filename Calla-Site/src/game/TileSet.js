export class TileSet {
    constructor(url, fetcher) {
        this.url = url;
        this.fetcher = fetcher;
        this.name = null;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.tilesPerRow = 0;
        this.tileCount = 0;
        this.image = null;
        this.collision = new Map();
    }
    async load() {
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
        this.image = await this.fetcher.getCanvasImage(imageURL.href);
        this.tilesPerRow = Math.floor(this.image.width / this.tileWidth);
    }
    isClear(tile) {
        return !this.collision.get(tile - 1);
    }
    draw(g, tile, x, y) {
        if (tile > 0) {
            const idx = tile - 1, sx = this.tileWidth * (idx % this.tilesPerRow), sy = this.tileHeight * Math.floor(idx / this.tilesPerRow), dx = x * this.tileWidth, dy = y * this.tileHeight;
            g.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, dx, dy, this.tileWidth, this.tileHeight);
        }
    }
}
//# sourceMappingURL=TileSet.js.map