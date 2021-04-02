import { makeFont } from "kudzu/graphics2d/fonts";
import { Size } from "kudzu/graphics2d/Size";
import { CanvasTypes, Context2D, setContextSize } from "kudzu/html/canvas";
import { BackgroundLayer } from "../Layers/BackgroundLayer";
import { ForegroundLayer } from "../Layers/ForegroundLayer";
import { TrimLayer } from "../Layers/TrimLayer";

export interface IPrimroseRenderer {
    context: Context2D;
    fg: ForegroundLayer;
    bg: BackgroundLayer;
    trim: TrimLayer;
    character: Size;
    setSize(width: number, height: number, scaleFactor: number): Promise<void>;
    setFont(family: string, size: number): Promise<void>;
    render(): Promise<void>;
}

export class PrimroseRenderer implements IPrimroseRenderer {

    context: Context2D;
    fg: ForegroundLayer;
    bg: BackgroundLayer;
    trim: TrimLayer;

    character = new Size();

    constructor(private canvas: CanvasTypes) {
        this.context = this.canvas.getContext("2d");

        this.fg = new ForegroundLayer(this.canvas.width, this.canvas.height);
        this.bg = new BackgroundLayer(this.canvas.width, this.canvas.height);
        this.trim = new TrimLayer(this.canvas.width, this.canvas.height);
    }

    async setSize(width: number, height: number, scaleFactor: number) {
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

    async setFont(family: string, size: number): Promise<void> {
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
            this.character.width = this.context.measureText(
                "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                .width /
                100;
        }
    }

    private get width() {
        return this.canvas.width / this.scaleFactor;
    }

    private get height() {
        return this.canvas.height / this.scaleFactor;
    }

    private scaleFactor: number;

    async render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.bg.canvas, 0, 0);
        this.context.drawImage(this.fg.canvas, 0, 0);
        this.context.drawImage(this.trim.canvas, 0, 0);
    }
}