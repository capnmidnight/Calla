import { assertNever } from "kudzu/typeChecks";
import { BackgroundLayer } from "./BackgroundLayer";
import { LayerType } from "./BaseLayer";
import { ForegroundLayer } from "./ForegroundLayer";
import { TrimLayer } from "./TrimLayer";
export class Layer {
    constructor() {
        this.layer = null;
        this._canvas = null;
    }
    get canvas() {
        return this._canvas;
    }
    createLayer(canvas, type) {
        this._canvas = canvas;
        switch (type) {
            case LayerType.background:
                this.layer = new BackgroundLayer(canvas);
                break;
            case LayerType.foreground:
                this.layer = new ForegroundLayer(canvas);
                break;
            case LayerType.trim:
                this.layer = new TrimLayer(canvas);
                break;
            default:
                assertNever(type);
        }
        return Promise.resolve();
    }
    setSize(w, h, scaleFactor) {
        return this.layer.setSize(w, h, scaleFactor);
    }
    render(theme, minCursor, maxCursor, gridBounds, scroll, character, padding, focused, rows, fontFamily, fontSize, showLineNumbers, lineCountWidth, showScrollBars, vScrollWidth, wordWrap) {
        return this.layer.render(theme, minCursor, maxCursor, gridBounds, scroll, character, padding, focused, rows, fontFamily, fontSize, showLineNumbers, lineCountWidth, showScrollBars, vScrollWidth, wordWrap);
    }
}
//# sourceMappingURL=Layer.js.map