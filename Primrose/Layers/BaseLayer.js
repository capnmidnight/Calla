import { createUtilityCanvas, setContextSize } from "kudzu/html/canvas";
import { Cursor } from "../Cursor";
export var LayerType;
(function (LayerType) {
    LayerType[LayerType["background"] = 0] = "background";
    LayerType[LayerType["foreground"] = 1] = "foreground";
    LayerType[LayerType["trim"] = 2] = "trim";
})(LayerType || (LayerType = {}));
export class BaseLayer {
    constructor(width, height) {
        this.scaleFactor = 1;
        this.tokenFront = new Cursor();
        this.tokenBack = new Cursor();
        this.canvas = createUtilityCanvas(width, height);
        this.g = this.canvas.getContext("2d");
        this.g.imageSmoothingEnabled = true;
        this.g.textBaseline = "top";
    }
    fillRect(character, fill, x, y, w, h) {
        this.g.fillStyle = fill;
        this.g.fillRect(x * character.width, y * character.height, w * character.width + 1, h * character.height + 1);
    }
    strokeRect(character, stroke, x, y, w, h) {
        this.g.strokeStyle = stroke;
        this.g.strokeRect(x * character.width, y * character.height, w * character.width + 1, h * character.height + 1);
    }
    setSize(w, h, scaleFactor) {
        this.scaleFactor = scaleFactor;
        setContextSize(this.g, w, h, scaleFactor);
        return Promise.resolve();
    }
}
//# sourceMappingURL=BaseLayer.js.map