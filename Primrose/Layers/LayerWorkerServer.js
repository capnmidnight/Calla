import { WorkerServer } from "kudzu/workers/WorkerServer";
import { Layer } from "./Layer";
export class LayerWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        this.layer = new Layer();
        this.add("createLayer", (canvas, type) => this.layer.createLayer(canvas, type));
        this.add("setSize", (width, height, scaleFactor) => this.layer.setSize(width, height, scaleFactor));
        this.add("render", (theme, minCursor, maxCursor, gridBounds, scroll, character, padding, focused, rows, fontFamily, fontSize, showLineNumbers, lineCountWidth, showScrollBars, vScrollWidth, wordWrap) => this.layer.render(theme, minCursor, maxCursor, gridBounds, scroll, character, padding, focused, rows, fontFamily, fontSize, showLineNumbers, lineCountWidth, showScrollBars, vScrollWidth, wordWrap));
    }
}
//# sourceMappingURL=LayerWorkerServer.js.map