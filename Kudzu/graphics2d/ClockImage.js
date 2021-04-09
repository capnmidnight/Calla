import { makeFont } from "./fonts";
import { CanvasImage } from "./CanvasImage";
export class ClockImage extends CanvasImage {
    constructor() {
        super(256, 128);
        const redraw = this.redraw.bind(this);
        setInterval(redraw, 500);
        redraw();
    }
    onRedraw() {
        const padding = 10;
        const height = this.canvas.height - 3 * padding;
        const midX = this.canvas.width / 2;
        const midY = this.canvas.height / 2;
        const time = new Date();
        const timeStr = time.toLocaleTimeString();
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.fillRect("white", 0, 0, this.canvas.width, this.canvas.height, 0);
        this.fillRect("black", 0, 0, this.canvas.width, this.canvas.height, padding);
        this.g.fillStyle = "white";
        this.g.strokeStyle = "black";
        this.g.lineWidth = 3;
        this.g.textBaseline = "middle";
        this.g.font = makeFont({
            fontSize: height / 3,
            fontFamily: "monospace"
        });
        this.g.textAlign = "center";
        this.g.fillText(timeStr, midX, midY);
        return true;
    }
}
//# sourceMappingURL=ClockImage.js.map