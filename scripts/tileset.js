export class TileSet {
    constructor(tilesetName) {
        this.tilesetName = tilesetName;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.tilesPerRow = 0;
        this.image = new Image();
    }

    async load() {
        const response = await fetch(`data/tilesets/${this.tilesetName}/index.json`),
            data = await response.json(),
            imageLoad = new Promise((resolve, reject) => {
                this.image.addEventListener("load", (evt) => {
                    this.tilesPerRow = this.image.width / this.tileWidth;
                    resolve();
                });
                this.image.addEventListener("error", reject);
            });

        this.tileWidth = data.tileWidth;
        this.tileHeight = data.tileHeight;
        this.image.src = `data/tilesets/${this.tilesetName}/${data.file}`;
        await imageLoad;
    }

    draw(g, tile, x, y) {
        const sx = this.tileWidth * (tile % this.tilesPerRow),
            sy = this.tileHeight * Math.floor(tile / this.tilesPerRow),
            dx = x * this.tileWidth,
            dy = y * this.tileHeight;

        g.drawImage(this.image,
            sx, sy, this.tileWidth, this.tileHeight,
            dx, dy, this.tileWidth, this.tileHeight);
    }
}