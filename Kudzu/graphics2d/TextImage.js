import { TypedEvent } from "../events/EventBase";
import { createUtilityCanvas, setContextSize } from "../html/canvas";
import { clamp } from "../math/clamp";
import { isDefined, isNullOrUndefined, isNumber } from "../typeChecks";
import { CanvasImage } from "./CanvasImage";
import { makeFont } from "./fonts";
export class TextImage extends CanvasImage {
    trueWidth = null;
    trueHeight = null;
    trueFontSize = null;
    dx = null;
    _minWidth = null;
    _maxWidth = null;
    _minHeight = null;
    _maxHeight = null;
    _freezeDimensions = false;
    _dimensionsFrozen = false;
    _bgFillColor = null;
    _bgStrokeColor = null;
    _bgStrokeSize = null;
    _textStrokeColor = null;
    _textStrokeSize = null;
    _textFillColor = "black";
    _textDirection = "horizontal";
    _wrapWords = true;
    _fontStyle = "normal";
    _fontVariant = "normal";
    _fontWeight = "normal";
    _fontFamily = "sans-serif";
    _fontSize = 20;
    _padding;
    _value = null;
    notReadyEvt = new TypedEvent("notready");
    constructor(options) {
        super(10, 10, options);
        if (isDefined(options)) {
            if (isDefined(options.minWidth)) {
                this._minWidth = options.minWidth;
            }
            if (isDefined(options.maxWidth)) {
                this._maxWidth = options.maxWidth;
            }
            if (isDefined(options.minHeight)) {
                this._minHeight = options.minHeight;
            }
            if (isDefined(options.maxHeight)) {
                this._maxHeight = options.maxHeight;
            }
            if (isDefined(options.freezeDimensions)) {
                this._freezeDimensions = options.freezeDimensions;
            }
            if (isDefined(options.textStrokeColor)) {
                this._textStrokeColor = options.textStrokeColor;
            }
            if (isDefined(options.textStrokeSize)) {
                this._textStrokeSize = options.textStrokeSize;
            }
            if (isDefined(options.bgFillColor)) {
                this._bgFillColor = options.bgFillColor;
            }
            if (isDefined(options.bgStrokeColor)) {
                this._bgStrokeColor = options.bgStrokeColor;
            }
            if (isDefined(options.bgStrokeSize)) {
                this._bgStrokeSize = options.bgStrokeSize;
            }
            if (isDefined(options.value)) {
                this._value = options.value;
            }
            if (isDefined(options.textFillColor)) {
                this._textFillColor = options.textFillColor;
            }
            if (isDefined(options.textDirection)) {
                this._textDirection = options.textDirection;
            }
            if (isDefined(options.wrapWords)) {
                this._wrapWords = options.wrapWords;
            }
            if (isDefined(options.fontStyle)) {
                this._fontStyle = options.fontStyle;
            }
            if (isDefined(options.fontVariant)) {
                this._fontVariant = options.fontVariant;
            }
            if (isDefined(options.fontWeight)) {
                this._fontWeight = options.fontWeight;
            }
            if (isDefined(options.fontFamily)) {
                this._fontFamily = options.fontFamily;
            }
            if (isDefined(options.fontSize)) {
                this._fontSize = options.fontSize;
            }
            if (isDefined(options.padding)) {
                if (isNumber(options.padding)) {
                    this._padding = {
                        left: options.padding,
                        right: options.padding,
                        top: options.padding,
                        bottom: options.padding
                    };
                }
                else {
                    this._padding = options.padding;
                }
            }
        }
        if (isNullOrUndefined(this._padding)) {
            this._padding = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
        }
        this.redraw();
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
    get textFillColor() {
        return this._textFillColor;
    }
    set textFillColor(v) {
        if (this.textFillColor !== v) {
            this._textFillColor = v;
            this.redraw();
        }
    }
    get textStrokeColor() {
        return this._textStrokeColor;
    }
    set textStrokeColor(v) {
        if (this.textStrokeColor !== v) {
            this._textStrokeColor = v;
            this.redraw();
        }
    }
    get textStrokeSize() {
        return this._textStrokeSize;
    }
    set textStrokeSize(v) {
        if (this.textStrokeSize !== v) {
            this._textStrokeSize = v;
            this.redraw();
        }
    }
    get bgFillColor() {
        return this._bgFillColor;
    }
    set bgFillColor(v) {
        if (this.bgFillColor !== v) {
            this._bgFillColor = v;
            this.redraw();
        }
    }
    get bgStrokeColor() {
        return this._bgStrokeColor;
    }
    set bgStrokeColor(v) {
        if (this.bgStrokeColor !== v) {
            this._bgStrokeColor = v;
            this.redraw();
        }
    }
    get bgStrokeSize() {
        return this._bgStrokeSize;
    }
    set bgStrokeSize(v) {
        if (this.bgStrokeSize !== v) {
            this._bgStrokeSize = v;
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
    draw(g, x, y) {
        if (this.canvas.width > 0
            && this.canvas.height > 0) {
            g.drawImage(this.canvas, x, y, this.width, this.height);
        }
    }
    split(value) {
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
    unfreeze() {
        this._dimensionsFrozen = false;
    }
    onRedraw() {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.fontFamily
            && this.fontSize
            && (this.textFillColor || (this.textStrokeColor && this.textStrokeSize))
            && this.value) {
            const lines = this.split(this.value);
            const isVertical = this.textDirection && this.textDirection.indexOf("vertical") === 0;
            if (this.trueWidth === null
                || this.trueHeight === null
                || this.dx === null
                || this.trueFontSize === null
                || !this._dimensionsFrozen) {
                this._dimensionsFrozen = this._freezeDimensions;
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
                this.trueWidth = 0;
                this.trueHeight = 0;
                this.dx = 0;
                let tooBig = false, tooSmall = false, highFontSize = 10000, lowFontSize = 0;
                this.trueFontSize = clamp(this.fontSize * this.scale, lowFontSize, highFontSize);
                let minFont = null, minFontDelta = Number.MAX_VALUE;
                do {
                    const realFontSize = this.fontSize;
                    this._fontSize = this.trueFontSize;
                    const font = makeFont(this);
                    this._fontSize = realFontSize;
                    this.g.textAlign = "center";
                    this.g.textBaseline = "middle";
                    this.g.font = font;
                    this.trueWidth = 0;
                    this.trueHeight = 0;
                    for (const line of lines) {
                        const metrics = this.g.measureText(line);
                        this.trueWidth = Math.max(this.trueWidth, metrics.width);
                        this.trueHeight += this.trueFontSize;
                        if (isNumber(metrics.actualBoundingBoxLeft)
                            && isNumber(metrics.actualBoundingBoxRight)
                            && isNumber(metrics.actualBoundingBoxAscent)
                            && isNumber(metrics.actualBoundingBoxDescent)) {
                            if (!autoResize) {
                                this.trueWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
                                this.trueHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                                this.dx = (metrics.actualBoundingBoxLeft - this.trueWidth / 2) / 2;
                            }
                        }
                    }
                    if (autoResize) {
                        const dMinWidth = this.trueWidth - targetMinWidth;
                        const dMaxWidth = this.trueWidth - targetMaxWidth;
                        const dMinHeight = this.trueHeight - targetMinHeight;
                        const dMaxHeight = this.trueHeight - targetMaxHeight;
                        const mdMinWidth = Math.abs(dMinWidth);
                        const mdMaxWidth = Math.abs(dMaxWidth);
                        const mdMinHeight = Math.abs(dMinHeight);
                        const mdMaxHeight = Math.abs(dMaxHeight);
                        tooBig = dMaxWidth > 1 || dMaxHeight > 1;
                        tooSmall = dMinWidth < -1 && dMinHeight < -1;
                        const minDif = Math.min(mdMinWidth, Math.min(mdMaxWidth, Math.min(mdMinHeight, mdMaxHeight)));
                        if (minDif < minFontDelta) {
                            minFontDelta = minDif;
                            minFont = this.g.font;
                        }
                        if ((tooBig || tooSmall)
                            && tried.indexOf(this.g.font) > -1
                            && minFont) {
                            this.g.font = minFont;
                            tooBig = false;
                            tooSmall = false;
                        }
                        if (tooBig) {
                            highFontSize = this.trueFontSize;
                            this.trueFontSize = (lowFontSize + this.trueFontSize) / 2;
                        }
                        else if (tooSmall) {
                            lowFontSize = this.trueFontSize;
                            this.trueFontSize = (this.trueFontSize + highFontSize) / 2;
                        }
                    }
                    tried.push(this.g.font);
                } while (tooBig || tooSmall);
                if (autoResize) {
                    if (this.trueWidth < targetMinWidth) {
                        this.trueWidth = targetMinWidth;
                    }
                    else if (this.trueWidth > targetMaxWidth) {
                        this.trueWidth = targetMaxWidth;
                    }
                    if (this.trueHeight < targetMinHeight) {
                        this.trueHeight = targetMinHeight;
                    }
                    else if (this.trueHeight > targetMaxHeight) {
                        this.trueHeight = targetMaxHeight;
                    }
                }
                const newW = this.trueWidth + this.scale * (this.padding.right + this.padding.left);
                const newH = this.trueHeight + this.scale * (this.padding.top + this.padding.bottom);
                try {
                    setContextSize(this.g, newW, newH);
                }
                catch (exp) {
                    console.error(exp);
                    throw exp;
                }
            }
            if (this.bgFillColor) {
                this.g.fillStyle = this.bgFillColor;
                this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            else {
                this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if (this.textStrokeColor && this.textStrokeSize) {
                this.g.lineWidth = this.textStrokeSize * this.scale;
                this.g.strokeStyle = this.textStrokeColor;
            }
            if (this.textFillColor) {
                this.g.fillStyle = this.textFillColor;
            }
            const di = 0.5 * (lines.length - 1);
            for (let i = 0; i < lines.length; ++i) {
                const line = lines[i];
                const dy = (i - di) * this.trueFontSize;
                const x = this.dx + this.trueWidth / 2 + this.scale * this.padding.left;
                const y = dy + this.trueHeight / 2 + this.scale * this.padding.top;
                if (this.textStrokeColor && this.textStrokeSize) {
                    this.g.strokeText(line, x, y);
                }
                if (this.textFillColor) {
                    this.g.fillText(line, x, y);
                }
            }
            if (this.bgStrokeColor && this.bgStrokeSize) {
                this.g.strokeStyle = this.bgStrokeColor;
                this.g.lineWidth = this.bgStrokeSize * this.scale;
                const s = this.bgStrokeSize / 2;
                this.g.strokeRect(s, s, this.canvas.width - this.bgStrokeSize, this.canvas.height - this.bgStrokeSize);
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
                    setContextSize(this.g, canv.width, canv.height);
                }
                else {
                    console.warn("Couldn't rotate the TextImage");
                }
                this.g.drawImage(canv, 0, 0);
            }
            return true;
        }
        else {
            this.dispatchEvent(this.notReadyEvt);
            return false;
        }
    }
}
//# sourceMappingURL=TextImage.js.map