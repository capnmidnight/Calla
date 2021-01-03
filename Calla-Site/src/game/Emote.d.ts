import type { Emoji } from "kudzu/emoji/Emoji";
import { TypedEvent } from "kudzu/events/EventBase";
import { TextImage } from "kudzu/graphics2d/TextImage";
import type { Context2D } from "kudzu/html/canvas";
import type { TileMap } from "./TileMap";
export declare class EmoteEvent extends TypedEvent<"emote"> {
    emoji: Emoji;
    constructor(emoji: Emoji);
}
export declare class Emote {
    emoji: Emoji;
    x: number;
    y: number;
    dx: number;
    dy: number;
    life: number;
    width: number;
    emoteText: TextImage;
    constructor(emoji: Emoji, x: number, y: number);
    isDead(): boolean;
    update(dt: number): void;
    drawShadow(g: Context2D, map: TileMap): void;
    drawEmote(g: Context2D, map: TileMap): void;
}
