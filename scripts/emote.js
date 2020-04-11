const EMOJI_LIFE = 2;

export class Emote {
    constructor(emoji, x, y) {
        this.emoji = emoji;
        this.x = x; this.y = y;
        this.dx = Math.random() - 0.5; this.dy = -Math.random();
        this.ax = Math.random() - 0.5; this.ay = Math.random();
        this.life = 1;
    }

    isDead() {
        return this.life <= 0;
    }

    update(dt) {
        this.life -= dt / EMOJI_LIFE;
        this.ax *= 0.99; this.ay *= 0.99;
        this.dx += this.ax * dt; this.dy += this.ay * dt;
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
        g.font = "12pt";
        g.fillText(
            this.emoji.value,
            this.x * map.tileWidth,
            this.y * map.tileHeight,
            map.tileWidth,
            map.tileHeight);
    }
}
