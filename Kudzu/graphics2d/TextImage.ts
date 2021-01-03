import { TypedEvent, TypedEventBase } from "../events/EventBase";
import type { CanvasTypes, Context2D } from "../html/canvas";
import { createUtilityCanvas, setContextSize } from "../html/canvas";
import { clamp } from "../math/clamp";
import { isNumber } from "../typeChecks";
import { loadFont, makeFont } from "./fonts";

export interface PaddingRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface TextImageEvents {
    redrawn: TypedEvent<"redrawn">;
}

const redrawnEvt = new TypedEvent("redrawn");

export class TextImage extends TypedEventBase<TextImageEvents> {
    private _minWidth: number | null = null;
    private _maxWidth: number | null = null;
    private _minHeight: number | null = null;
    private _maxHeight: number | null = null;
    private _strokeColor: string | null = null;
    private _strokeSize: number | null = null;
    private _bgColor: string | null = null;
    private _value: string | null = null;

    private _scale = 1;
    private _fillColor = "black";
    private _textDirection = "horizontal";
    private _wrapWords = true;

    private _fontStyle = "normal";
    private _fontVariant = "normal";
    private _fontWeight = "normal";
    private _fontFamily = "sans-serif";
    private _fontSize = 20;

    private _padding: PaddingRect;

    private _canvas: CanvasTypes;
    private _g: Context2D;

    constructor() {
        super();

        this._padding = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        this._canvas = createUtilityCanvas(10, 10);
        const g = this.canvas.getContext("2d");
        if (!g) {
            throw new Error("Couldn't create a graphics context for the TextImage canvas.");
        }

        this._g = g;
    }

    async loadFontAndSetText(value: string | null = null) {
        const font = makeFont(this);
        await loadFont(font, value);
        this.value = value;
    }

    get scale() {
        return this._scale;
    }

    set scale(v) {
        if (this.scale !== v) {
            this._scale = v;
            this.redraw();
        }
    }

    get minWidth() {
        return this._minWidth;
    }

    set minWidth(v) {
        if (this.minWidth !== v) {
            this._minWidth = v;
            this.redraw();
        }
    }

    get maxWidth() {
        return this._maxWidth;
    }

    set maxWidth(v) {
        if (this.maxWidth !== v) {
            this._maxWidth = v;
            this.redraw();
        }
    }

    get minHeight() {
        return this._minHeight;
    }

    set minHeight(v) {
        if (this.minHeight !== v) {
            this._minHeight = v;
            this.redraw();
        }
    }

    get maxHeight() {
        return this._maxHeight;
    }

    set maxHeight(v) {
        if (this.maxHeight !== v) {
            this._maxHeight = v;
            this.redraw();
        }
    }

    get canvas() {
        return this._canvas;
    }

    get width() {
        return this.canvas.width / this.scale;
    }

    get height() {
        return this.canvas.height / this.scale;
    }


    get padding() {
        return this._padding;
    }

    set padding(v) {
        if (v instanceof Array) {
            throw new Error("Invalid padding");
        }
        if (this.padding.top !== v.top
            || this.padding.right != v.right
            || this.padding.bottom != v.bottom
            || this.padding.left != v.left) {
            this._padding = v;
            this.redraw();
        }
    }

    get wrapWords() {
        return this._wrapWords;
    }

    set wrapWords(v) {
        if (this.wrapWords !== v) {
            this._wrapWords = v;
            this.redraw();
        }
    }

    get textDirection() {
        return this._textDirection;
    }

    set textDirection(v) {
        if (this.textDirection !== v) {
            this._textDirection = v;
            this.redraw();
        }
    }

    get fontStyle() {
        return this._fontStyle;
    }

    set fontStyle(v) {
        if (this.fontStyle !== v) {
            this._fontStyle = v;
            this.redraw();
        }
    }

    get fontVariant() {
        return this._fontVariant;
    }

    set fontVariant(v) {
        if (this.fontVariant !== v) {
            this._fontVariant = v;
            this.redraw();
        }
    }

    get fontWeight() {
        return this._fontWeight;
    }

    set fontWeight(v) {
        if (this.fontWeight !== v) {
            this._fontWeight = v;
            this.redraw();
        }
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(v) {
        if (this.fontSize !== v) {
            this._fontSize = v;
            this.redraw();
        }
    }

    get fontFamily() {
        return this._fontFamily;
    }

    set fontFamily(v) {
        if (this.fontFamily !== v) {
            this._fontFamily = v;
            this.redraw();
        }
    }

    get fillColor() {
        return this._fillColor;
    }

    set fillColor(v) {
        if (this.fillColor !== v) {
            this._fillColor = v;
            this.redraw();
        }
    }

    get strokeColor() {
        return this._strokeColor;
    }

    set strokeColor(v) {
        if (this.strokeColor !== v) {
            this._strokeColor = v;
            this.redraw();
        }
    }

    get strokeSize() {
        return this._strokeSize;
    }

    set strokeSize(v) {
        if (this.strokeSize !== v) {
            this._strokeSize = v;
            this.redraw();
        }
    }

    get bgColor() {
        return this._bgColor;
    }

    set bgColor(v) {
        if (this.bgColor !== v) {
            this._bgColor = v;
            this.redraw();
        }
    }

    get value() {
        return this._value;
    }

    set value(v) {
        if (this.value !== v) {
            this._value = v;
            this.redraw();
        }
    }

    draw(g: Context2D, x: number, y: number) {
        if (this._canvas.width > 0
            && this._canvas.height > 0) {
            g.drawImage(this._canvas, x, y, this.width, this.height);
        }
    }

    private split(value: string) {
        if (this.wrapWords) {
            return value
                .split(' ')
                .join('\n')
                .replace(/\r\n/, '\n')
                .split('\n');
        }
        else {
            return value
                .replace(/\r\n/, '\n')
                .split('\n');
        }
    }

    private redraw() {
        this._g.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.fontFamily
            && this.fontSize
            && (this.fillColor || (this.strokeColor && this.strokeSize))
            && this.value) {

            const isVertical = this.textDirection && this.textDirection.indexOf("vertical") === 0;

            const autoResize = this.minWidth != null
                || this.maxWidth != null
                || this.minHeight != null
                || this.maxHeight != null;

            const _targetMinWidth = ((this.minWidth || 0) - this.padding.right - this.padding.left) * this.scale;
            const _targetMaxWidth = ((this.maxWidth || 4096) - this.padding.right - this.padding.left) * this.scale;
            const _targetMinHeight = ((this.minHeight || 0) - this.padding.top - this.padding.bottom) * this.scale;
            const _targetMaxHeight = ((this.maxHeight || 4096) - this.padding.top - this.padding.bottom) * this.scale;

            const targetMinWidth = isVertical ? _targetMinHeight : _targetMinWidth;
            const targetMaxWidth = isVertical ? _targetMaxHeight : _targetMaxWidth;
            const targetMinHeight = isVertical ? _targetMinWidth : _targetMinHeight;
            const targetMaxHeight = isVertical ? _targetMaxWidth : _targetMaxHeight;

            const tried = [];

            const lines = this.split(this.value);

            let dx = 0,
                trueWidth = 0,
                trueHeight = 0,
                tooBig = false,
                tooSmall = false,
                highFontSize = 10000,
                lowFontSize = 0,
                fontSize = clamp(this.fontSize * this.scale, lowFontSize, highFontSize),
                minFont = null,
                minFontDelta = Number.MAX_VALUE;
            do {
                const realFontSize = this.fontSize;
                this._fontSize = fontSize;
                const font = makeFont(this);
                this._fontSize = realFontSize;

                this._g.textAlign = "center";
                this._g.textBaseline = "middle";
                this._g.font = font;

                trueWidth = 0;
                trueHeight = 0;
                for (const line of lines) {
                    const metrics = this._g.measureText(line);
                    trueWidth = Math.max(trueWidth, metrics.width);
                    trueHeight += fontSize;
                    if (isNumber(metrics.actualBoundingBoxLeft)
                        && isNumber(metrics.actualBoundingBoxRight)
                        && isNumber(metrics.actualBoundingBoxAscent)
                        && isNumber(metrics.actualBoundingBoxDescent)) {
                        if (!autoResize) {
                            trueWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
                            trueHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                            dx = (metrics.actualBoundingBoxLeft - trueWidth / 2) / 2;
                        }
                    }
                }

                if (autoResize) {
                    const dMinWidth = trueWidth - targetMinWidth;
                    const dMaxWidth = trueWidth - targetMaxWidth;
                    const dMinHeight = trueHeight - targetMinHeight;
                    const dMaxHeight = trueHeight - targetMaxHeight;

                    const mdMinWidth = Math.abs(dMinWidth);
                    const mdMaxWidth = Math.abs(dMaxWidth);
                    const mdMinHeight = Math.abs(dMinHeight);
                    const mdMaxHeight = Math.abs(dMaxHeight);

                    tooBig = dMaxWidth > 1 || dMaxHeight > 1;
                    tooSmall = dMinWidth < -1 && dMinHeight < -1;

                    const minDif = Math.min(mdMinWidth, Math.min(mdMaxWidth, Math.min(mdMinHeight, mdMaxHeight)));
                    if (minDif < minFontDelta) {
                        minFontDelta = minDif;
                        minFont = this._g.font;
                    }

                    if ((tooBig || tooSmall)
                        && tried.indexOf(this._g.font) > -1
                        && minFont) {
                        this._g.font = minFont;
                        tooBig = false;
                        tooSmall = false;
                    }

                    if (tooBig) {
                        highFontSize = fontSize;
                        fontSize = (lowFontSize + fontSize) / 2;
                    }
                    else if (tooSmall) {
                        lowFontSize = fontSize;
                        fontSize = (fontSize + highFontSize) / 2;
                    }
                }

                tried.push(this._g.font);
            } while (tooBig || tooSmall);

            if (autoResize) {
                if (trueWidth < targetMinWidth) {
                    trueWidth = targetMinWidth;
                }
                else if (trueWidth > targetMaxWidth) {
                    trueWidth = targetMaxWidth;
                }

                if (trueHeight < targetMinHeight) {
                    trueHeight = targetMinHeight;
                }
                else if (trueHeight > targetMaxHeight) {
                    trueHeight = targetMaxHeight;
                }
            }

            const newW = trueWidth + this.scale * (this.padding.right + this.padding.left);
            const newH = trueHeight + this.scale * (this.padding.top + this.padding.bottom);
            try {
                setContextSize(this._g, newW, newH);
            }
            catch (exp) {
                console.error(exp);
                throw exp;
            }

            if (this.bgColor) {
                this._g.fillStyle = this.bgColor;
                this._g.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            else {
                this._g.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            if (this.strokeColor && this.strokeSize) {
                this._g.lineWidth = this.strokeSize * this.scale;
                this._g.strokeStyle = this.strokeColor;
            }

            if (this.fillColor) {
                this._g.fillStyle = this.fillColor;
            }

            const di = 0.5 * (lines.length - 1);

            for (let i = 0; i < lines.length; ++i) {
                const line = lines[i];
                const dy = (i - di) * fontSize;
                const x = dx + this.canvas.width / 2;
                const y = dy + this.canvas.height / 2;

                if (this.strokeColor && this.strokeSize) {
                    this._g.strokeText(line, x, y);
                }

                if (this.fillColor) {
                    this._g.fillText(line, x, y);
                }
            }

            if (isVertical) {
                const canv = createUtilityCanvas(this.canvas.height, this.canvas.width);
                const g = canv.getContext("2d");
                if (g) {
                    g.translate(canv.width / 2, canv.height / 2);
                    if (this.textDirection === "vertical"
                        || this.textDirection === "vertical-left") {
                        g.rotate(Math.PI / 2);
                    }
                    else if (this.textDirection === "vertical-right") {
                        g.rotate(-Math.PI / 2);
                    }
                    g.translate(-this.canvas.width / 2, -this.canvas.height / 2);
                    g.drawImage(this.canvas, 0, 0);
                    setContextSize(this._g, canv.width, canv.height);
                }
                else {
                    console.warn("Couldn't rotate the TextImage");
                }
                this._g.drawImage(canv, 0, 0);
            }

            this.dispatchEvent(redrawnEvt);
        }
    }
}