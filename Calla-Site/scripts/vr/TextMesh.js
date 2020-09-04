import { TextImage } from "../game/graphics/TextImage";
import { Image2DMesh } from "./Image2DMesh";

export class TextMesh extends Image2DMesh {
    constructor() {
        super();
        this.textImage = new TextImage();
        this.setImage(this.textImage.canvas);
        this.textImage.addEventListener("redrawn", () => {
            this.scale.set(this.textImage.width / 300, this.textImage.height / 300, 1);
            this.updateTexture();
        });
    }

    async loadFontAndSetText(value = null) {
        await this.textImage.loadFontAndSetText(value);
    }

    get textWidth() {
        this.textImage.width;
    }

    get textHeight() {
        return this.textImage.height;
    }

    get textScale() {
        return this.textImage.scale;
    }

    set textScale(v) {
        this.textImage.scale = v;
    }

    get textPadding() {
        return this.textImage.padding;
    }

    set textPadding(v) {
        this.textImage.padding = v;
    }

    get fontStyle() {
        return this.textImage.fontStyle;
    }

    set fontStyle(v) {
        this.textImage.fontStyle = v;
    }

    get fontVariant() {
        return this.textImage.fontVariant;
    }

    set fontVariant(v) {
        this.textImage.fontVariant = v;
    }

    get fontWeight() {
        return this.textImage.fontWeight;
    }

    set fontWeight(v) {
        this.textImage.fontWeight = v;
    }

    get fontSize() {
        return this.textImage.fontSize;
    }

    set fontSize(v) {
        this.textImage.fontSize = v;
    }

    get fontFamily() {
        return this.textImage.fontFamily;
    }

    set fontFamily(v) {
        this.textImage.fontFamily = v;
    }

    get textColor() {
        return this.textImage.color;
    }

    set textColor(v) {
        this.textImage.color = v;
    }

    get textBgColor() {
        return this.textImage.bgColor;
    }

    set textBgColor(v) {
        this.textImage.bgColor = v;
    }

    get value() {
        return this.textImage.value;
    }

    set value(v) {
        this.textImage.value = v;
    }
}