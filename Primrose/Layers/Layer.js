import { setContextSize } from "kudzu/html/canvas";
import { Cursor } from "../Cursor";
export class Layer {
    constructor(canvas) {
        this.canvas = canvas;
        this.scaleFactor = 1;
        this.tokenFront = new Cursor();
        this.tokenBack = new Cursor();
        this.g = this.canvas.getContext("2d");
        this.g.imageSmoothingEnabled = true;
        this.g.textBaseline = "top";
    }
    fillRect(character, fill, x, y, w, h) {
        this.g.fillStyle = fill;
        this.g.fillRect(x * character.width, y * character.height, w * character.width + 1, h * character.height + 1);
    }
    setSize(w, h, scaleFactor) {
        this.scaleFactor = scaleFactor;
        setContextSize(this.g, w, h, scaleFactor);
    }
}
//# sourceMappingURL=Layer.js.map