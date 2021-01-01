export declare class Emote {
    constructor(emoji: any, x: any, y: any);
    isDead(): boolean;
    update(dt: any): void;
    drawShadow(g: any, map: any): void;
    /**
     *
     * @param {CanvasRenderingContext2D} g
     * @param {any} map
     */
    drawEmote(g: any, map: any): void;
}
