import { makeFont } from "kudzu/graphics2d/fonts";
import { Size } from "kudzu/graphics2d/Size";
import { setContextSize } from "kudzu/html/canvas";
import { BackgroundLayer } from "../Layers/BackgroundLayer";
import { ForegroundLayer } from "../Layers/ForegroundLayer";
import { TrimLayer } from "../Layers/TrimLayer";
export class PrimroseRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.character = new Size();
        this.context = this.canvas.getContext("2d");
        this.fg = new ForegroundLayer(this.canvas.width, this.canvas.height);
        this.bg = new BackgroundLayer(this.canvas.width, this.canvas.height);
        this.trim = new TrimLayer(this.canvas.width, this.canvas.height);
    }
    async setSize(width, height, scaleFactor) {
        if (setContextSize(this.context, width, height, scaleFactor)
            || scaleFactor !== this.scaleFactor) {
            this.scaleFactor = scaleFactor;
            await Promise.all([
                this.fg.setSize(this.width, this.height, this.scaleFactor),
                this.bg.setSize(this.width, this.height, this.scaleFactor),
                this.trim.setSize(this.width, this.height, this.scaleFactor)
            ]);
        }
    }
    async setFont(family, size) {
        size = Math.max(1, size || 0);
        const font = makeFont({
            fontFamily: family,
            fontSize: size
        });
        if (font !== this.context.font) {
            this.context.font = font;
            this.character.height = size;
            // measure 100 letter M's, then divide by 100, to get the width of an M
            // to two decimal places on systems that return integer values from
            // measureText.
            this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                .width /
                100;
        }
    }
    get width() {
        return this.canvas.width / this.scaleFactor;
    }
    get height() {
        return this.canvas.height / this.scaleFactor;
    }
    async render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.bg.canvas, 0, 0);
        this.context.drawImage(this.fg.canvas, 0, 0);
        this.context.drawImage(this.trim.canvas, 0, 0);
    }
}
//# sourceMappingURL=PrimroseRenderer.js.map