const DEFAULT_STYLES = ["lightgrey", "darkgrey"]

export class TileSet {
    constructor(data) {
        this.tileWidth = 0;
        this.tileHeight = 0;
    }

    draw(g) {
    }
}

TileSet.DEFAULT = {
    tileWidth: 32,
    tileHeight: 32,
    draw: function (g, tile, x, y) {
        const tx = x * this.tileWidth - 0.25,
            ty = y * this.tileHeight - 0.25,
            tw = this.tileWidth + 0.5,
            th = this.tileHeight + 0.5;
        g.save();
        {
            g.fillStyle = DEFAULT_STYLES[tile];
            g.fillRect(tx, ty, tw, th);

            g.strokeStyle = "rgba(0, 0, 0, 0.05)";
            g.lineWidth = 0.5;
            g.strokeRect(tx + 0.25, ty + 0.25, tw - 0.5, th - 0.5);
        }
        g.restore();
    }
};