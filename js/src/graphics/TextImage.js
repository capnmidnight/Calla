import { setContextSize } from "../html/canvas.js";
import { CanvasOffscreen } from "../html/tags.js";

class TextImagePrivate {
    /**
     * @param {string} fontFamily
     */
    constructor(fontFamily) {
        /** @type {string} */
        this.fontFamily = fontFamily;

        /** @type {string} */
        this.color = "black";

        /** @type {number} */
        this.fontSize = null;

        /** @type {number} */
        this.scale = null;

        /** @type {string} */
        this.value = null;

        this.canvas = CanvasOffscreen(10, 10);
        this.g = this.canvas.getContext("2d");
        this.g.textBaseline = "top";
    }

    redraw() {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.fontFamily
            && this.fontSize
            && this.color
            && this.scale
            && this.value) {
            const fontHeight = this.fontSize * this.scale;
            this.g.font = `${fontHeight}px ${this.fontFamily}`;

            const metrics = this.g.measureText(this.value);
            let dx = 0,
                dy = 0,
                trueWidth = metrics.width,
                trueHeight = fontHeight;
            if (metrics.actualBoundingBoxLeft) {
                dx = metrics.actualBoundingBoxLeft;
                dy = metrics.actualBoundingBoxAscent;
                trueWidth = metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;
                trueHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent;
            }
            setContextSize(this.g, trueWidth, trueHeight);
            this.g.fillStyle = this.color;
            this.g.fillText(this.value, dx, dy);
        }
    }
}

/**
 * @type {WeakMap<TextImage, TextImagePrivate>}
 **/
const selfs = new WeakMap();

export class TextImage {
    /**
     * @param {string} fontFamily
     */
    constructor(fontFamily) {
        selfs.set(this, new TextImagePrivate(fontFamily));
    }

    get width() {
        const self = selfs.get(this);
        return self.canvas.width / self.scale;
    }

    get height() {
        const self = selfs.get(this);
        return self.canvas.height / self.scale;
    }

    get fontSize() {
        return selfs.get(this).fontSize;
    }

    set fontSize(v) {
        if (this.fontSize !== v) {
            const self = selfs.get(this);
            self.fontSize = v;
            self.redraw();
        }
    }

    get scale() {
        return selfs.get(this).scale;
    }

    set scale(v) {
        if (this.scale !== v) {
            const self = selfs.get(this);
            self.scale = v;
            self.redraw();
        }
    }


    get fontFamily() {
        return selfs.get(this).fontFamily;
    }

    set fontFamily(v) {
        if (this.fontFamily !== v) {
            const self = selfs.get(this);
            self.fontFamily = v;
            self.redraw();
        }
    }

    get color() {
        return selfs.get(this).color;
    }

    set color(v) {
        if (this.color !== v) {
            const self = selfs.get(this);
            self.color = v;
            self.redraw();
        }
    }

    get value() {
        return selfs.get(this).value;
    }

    set value(v) {
        if (this.value !== v) {
            const self = selfs.get(this);
            self.value = v;
            self.redraw();
        }
    }

    /**
     *
     * @param {CanvasRenderingContext2D} g - the canvas to which to render the text.
     * @param {number} x
     * @param {number} y
     */
    draw(g, x, y) {
        const self = selfs.get(this);
        if (self.canvas.width > 0
            && self.canvas.height > 0) {
            g.drawImage(self.canvas, x, y, this.width, this.height);
        }
    }
}