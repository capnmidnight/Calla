import { TextImage } from "./TextImage.js";
import { getTransform } from "./getTransform.js";

const EMOJI_LIFE = 3;

export class Emote {
    constructor(emoji, x, y) {
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.dx = Math.random() - 0.5;
        this.dy = -Math.random() * 0.5 - 0.5;
        this.life = 1;
        this.width = -1;
        this.emoteText = new TextImage("sans-serif");
        this.emoteText.value = emoji.value;
    }

    isDead() {
        return this.life <= 0.01;
    }

    update(dt) {
        this.life -= dt / EMOJI_LIFE;
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    drawShadow(g, map) {
        const scale = getTransform(g).a;
        g.save();
        {
            g.shadowColor = "rgba(0, 0, 0, 0.5)";
            g.shadowOffsetX = 3 * scale;
            g.shadowOffsetY = 3 * scale;
            g.shadowBlur = 3 * scale;

            this.drawEmote(g, map);
        }
        g.restore();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} g
     * @param {any} map
     */
    drawEmote(g, map) {
        const oldAlpha = g.globalAlpha,
            scale = getTransform(g).a;
        g.globalAlpha = this.life;
        this.emoteText.fontSize = map.tileHeight / 2;
        this.emoteText.scale = scale;
        this.emoteText.draw(g,
            this.x * map.tileWidth - this.width / 2,
            this.y * map.tileHeight);
        g.globalAlpha = oldAlpha;
    }
}
