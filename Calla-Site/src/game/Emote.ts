import type { Emoji } from "kudzu/emoji/Emoji";
import { TypedEvent } from "kudzu/events/EventBase";
import { getTransform } from "kudzu/graphics2d/getTransform";
import { TextImage } from "kudzu/graphics2d/TextImage";
import type { Context2D } from "kudzu/html/canvas";
import type { TileMap } from "./TileMap";

const EMOJI_LIFE = 3;

export class EmoteEvent extends TypedEvent<"emote"> {
    constructor(public emoji: Emoji) {
        super("emote");
    }
}

export class Emote {
    dx: number;
    dy: number;

    life = 1;
    width = -1;
    emoteText: TextImage = null;

    constructor(public emoji: Emoji, public x: number, public y: number) {
        this.dx = Math.random() - 0.5;
        this.dy = -Math.random() * 0.5 - 0.5;
        this.emoteText = new TextImage();
        this.emoteText.fontFamily = "Noto Color Emoji";
        this.emoteText.value = emoji.value;
    }

    isDead() {
        return this.life <= 0.01;
    }

    update(dt: number) {
        this.life -= dt / EMOJI_LIFE;
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    drawShadow(g: Context2D, map: TileMap) {
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

    drawEmote(g: Context2D, map: TileMap) {
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
