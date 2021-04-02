import { IPoint } from "kudzu/graphics2d/Point";
import { IRectangle } from "kudzu/graphics2d/Rectangle";
import { ISize } from "kudzu/graphics2d/Size";
import { CanvasTypes, Context2D, setContextSize } from "kudzu/html/canvas";
import { Cursor, ICursor } from "../Cursor";
import { IRow } from "../Row";
import { Theme } from "../themes";

export abstract class Layer {
    protected scaleFactor: number = 1;
    protected tokenFront = new Cursor();
    protected tokenBack = new Cursor();
    protected g: Context2D;

    constructor(public canvas: CanvasTypes) {
        this.g = this.canvas.getContext("2d");
        this.g.imageSmoothingEnabled = true;
        this.g.textBaseline = "top";
    }

    protected fillRect(character: ISize, fill: string, x: number, y: number, w: number, h: number) {
        this.g.fillStyle = fill;
        this.g.fillRect(
            x * character.width,
            y * character.height,
            w * character.width + 1,
            h * character.height + 1);
    }

    setSize(w: number, h: number, scaleFactor: number) {
        this.scaleFactor = scaleFactor;
        setContextSize(this.g, w, h, scaleFactor);
    }

    abstract render(theme: Theme,
        minCursor: ICursor,
        maxCursor: ICursor,
        gridBounds: IRectangle,
        scroll: IPoint,
        character: ISize,
        padding: number,
        focused: boolean,
        rows: IRow[],
        fontFamily: string,
        fontSize: number): Promise<void>;
}
