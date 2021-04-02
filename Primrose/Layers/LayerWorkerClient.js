import { isOffscreenCanvas } from "kudzu/html/canvas";
import { WorkerClient } from "kudzu/workers/WorkerClient";
export class LayerWorkerClient extends WorkerClient {
    get canvas() {
        return this._canvas;
    }
    createLayer(canvas, type) {
        this._canvas = canvas;
        const canv = isOffscreenCanvas(canvas)
            ? canvas
            : canvas.transferControlToOffscreen();
        return this.execute("createLayer", [canv, type], [canv]);
    }
    setSize(w, h, scaleFactor) {
        return this.execute("setSize", [w, h, scaleFactor]);
    }
    render(theme, minCursor, maxCursor, gridBounds, scroll, character, padding, focused, rows, fontFamily, fontSize, showLineNumbers, lineCountWidth, showScrollBars, vScrollWidth, wordWrap) {
        return this.execute("render", [
            theme,
            minCursor,
            maxCursor,
            gridBounds,
            scroll,
            character,
            padding,
            focused,
            rows,
            fontFamily,
            fontSize,
            showLineNumbers,
            lineCountWidth,
            showScrollBars,
            vScrollWidth,
            wordWrap
        ]);
    }
}
//# sourceMappingURL=LayerWorkerClient.js.map