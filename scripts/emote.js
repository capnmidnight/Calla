const EMOJI_LIFE = 2;

export class Emote {
    constructor(emoji, x, y) {
        this.emoji = emoji;
        this.x = x; this.y = y;
        this.dx = Math.random() - 0.5;
        this.dy = -Math.random() * 0.5 - 0.5;
        this.life = 1;
        this.width = -1;
    }

    isDead() {
        return this.life <= 0;
    }

    update(dt) {
        this.life -= dt / EMOJI_LIFE;
        this.dx *= 0.99; this.dy *= 0.99;
        this.x += this.dx * dt; this.y += this.dy * dt;
    }

    drawShadow(g, map, cameraZ) {
        g.save();
        {
            g.shadowColor = "rgba(0, 0, 0, 0.5)";
            g.shadowOffsetX = 3 * cameraZ;
            g.shadowOffsetY = 3 * cameraZ;
            g.shadowBlur = 3 * cameraZ;

            this.drawEmote(g, map);
        }
        g.restore();
    }

    drawEmote(g, map) {
        g.fillStyle = `rgba(0, 0, 0, ${this.life})`;
        g.font = map.tileHeight / 2 + "px sans-serif";
        if (this.width === -1) {
            const metrics = g.measureText(this.emoji.value);
            this.width = metrics.width;
        }

        g.fillText(
            this.emoji.value,
            this.x * map.tileWidth - this.width / 2,
            this.y * map.tileHeight);
    }
}
