import { EventBase, isNumber } from "../../calla";
import { setContextSize } from "../../html/canvas";
import { CanvasOffscreen } from "../../html/tags";
import { loadFont } from "./loadFont";

/**
 * @type {WeakMap<TextImage, TextImagePrivate>}
 **/
const selfs = new WeakMap();
const DEFAULT_TEST_TEXT = "The quick brown fox jumps over the lazy dog";
const redrawnEvt = new Event("redrawn");

function makeFont(style) {
    const fontParts = [];
    if (style.fontStyle && style.fontStyle !== "normal") {
        fontParts.push(style.fontStyle);
    }

    if (style.fontVariant && style.fontVariant !== "normal") {
        fontParts.push(style.fontVariant);
    }

    if (style.fontWeight && style.fontWeight !== "normal") {
        fontParts.push(style.fontWeight);
    }

    fontParts.push(style.fontSize + "px");
    fontParts.push(style.fontFamily);

    return fontParts.join(" ");
}

class TextImagePrivate {
    constructor() {
        /** @type {string} */
        this.color = "black";

        /** @type {string} */
        this.bgColor = null;

        /** @type {string} */
        this.fontStyle = "normal";

        /** @type {string} */
        this.fontVariant = "normal";

        /** @type {string} */
        this.fontWeight = "normal";

        /** @type {string} */
        this.fontFamily = "sans-serif";

        /** @type {number} */
        this.fontSize = 20;

        /** @type {number} */
        this.scale = 1;

        /** @type {number} */
        this.padding = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        /** @type {string} */
        this.value = null;

        this.canvas = CanvasOffscreen(10, 10);
        this.g = this.canvas.getContext("2d");
        this.g.textBaseline = "top";
    }

    redraw(parent) {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.fontFamily
            && this.fontSize
            && this.color
            && this.scale
            && this.value) {
            const fontHeight = this.fontSize * this.scale;
            const font = makeFont(this);
            this.g.font = font;

            const metrics = this.g.measureText(this.value);
            let dx = 0,
                dy = 0,
                trueWidth = metrics.width,
                trueHeight = fontHeight;
            if (metrics.actualBoundingBoxLeft !== undefined) {
                dy = metrics.actualBoundingBoxAscent;
                trueWidth = metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft;
                trueHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent;
            }

            dx += this.padding.left;
            dy += this.padding.top;
            trueWidth += this.padding.right + this.padding.left;
            trueHeight += this.padding.top + this.padding.bottom;

            setContextSize(this.g, trueWidth, trueHeight);

            if (this.bgColor) {
                this.g.fillStyle = this.bgColor;
                this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            else {
                this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            this.g.fillStyle = this.color;
            this.g.fillText(this.value, dx, dy);
            parent.dispatchEvent(redrawnEvt);
        }
    }
}

export class TextImage extends EventBase {
    /**
     * @param {string} fontFamily
     */
    constructor() {
        super();
        selfs.set(this, new TextImagePrivate());
    }

    async loadFontAndSetText(value = null) {
        const testString = value || DEFAULT_TEST_TEXT;
        const font = makeFont(this);
        await loadFont(font);
        this.value = value;
    }

    get canvas() {
        return selfs.get(this).canvas;
    }

    get width() {
        const self = selfs.get(this);
        return self.canvas.width / self.scale;
    }

    get height() {
        const self = selfs.get(this);
        return self.canvas.height / self.scale;
    }

    get scale() {
        return selfs.get(this).scale;
    }

    set scale(v) {
        if (this.scale !== v) {
            const self = selfs.get(this);
            self.scale = v;
            self.redraw(this);
        }
    }

    get padding() {
        return selfs.get(this).padding;
    }

    set padding(v) {

        if (v instanceof Array) {
            if (v.length === 1) {
                v = {
                    top: v[0],
                    right: v[0],
                    bottom: v[0],
                    left: v[0]
                };
            }
            else if (v.length === 2) {
                v = {
                    top: v[0],
                    right: v[1],
                    bottom: v[0],
                    left: v[1]
                };
            }
            else if (v.length === 4) {
                v = {
                    top: v[0],
                    right: v[1],
                    bottom: v[2],
                    left: v[3]
                };
            }
            else {
                return;
            }
        }
        else if (isNumber(v)) {
            v = {
                top: v,
                right: v,
                bottom: v,
                left: v
            }
        }


        if (this.padding.top !== v.top
            || this.padding.right != v.right
            || this.padding.bottom != v.bottom
            || this.padding.left != v.left) {
            const self = selfs.get(this);
            self.padding = v;
            self.redraw(this);
        }
    }

    get fontStyle() {
        return selfs.get(this).fontStyle;
    }

    set fontStyle(v) {
        if (this.fontStyle !== v) {
            const self = selfs.get(this);
            self.fontStyle = v;
            self.redraw(this);
        }
    }

    get fontVariant() {
        return selfs.get(this).fontVariant;
    }

    set fontVariant(v) {
        if (this.fontVariant !== v) {
            const self = selfs.get(this);
            self.fontVariant = v;
            self.redraw(this);
        }
    }

    get fontWeight() {
        return selfs.get(this).fontWeight;
    }

    set fontWeight(v) {
        if (this.fontWeight !== v) {
            const self = selfs.get(this);
            self.fontWeight = v;
            self.redraw(this);
        }
    }

    get fontSize() {
        return selfs.get(this).fontSize;
    }

    set fontSize(v) {
        if (this.fontSize !== v) {
            const self = selfs.get(this);
            self.fontSize = v;
            self.redraw(this);
        }
    }

    get fontFamily() {
        return selfs.get(this).fontFamily;
    }

    set fontFamily(v) {
        if (this.fontFamily !== v) {
            const self = selfs.get(this);
            self.fontFamily = v;
            self.redraw(this);
        }
    }

    get color() {
        return selfs.get(this).color;
    }

    set color(v) {
        if (this.color !== v) {
            const self = selfs.get(this);
            self.color = v;
            self.redraw(this);
        }
    }

    get bgColor() {
        return selfs.get(this).bgColor;
    }

    set bgColor(v) {
        if (this.bgColor !== v) {
            const self = selfs.get(this);
            self.bgColor = v;
            self.redraw(this);
        }
    }

    get value() {
        return selfs.get(this).value;
    }

    set value(v) {
        if (this.value !== v) {
            const self = selfs.get(this);
            self.value = v;
            self.redraw(this);
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