import { BaseAvatar } from "./BaseAvatar.js";
import { isSurfer } from "../emoji/emoji.js";

const selfs = new Map();

export class EmojiAvatar extends BaseAvatar {
    constructor(emoji) {
        super();

        const self = {
            canSwim: isSurfer(emoji),
            x: 0,
            y: 0,
            aspectRatio: null
        }

        this.value = emoji.value;
        this.desc = emoji.desc;

        selfs.set(this, self);
    }

    get canSwim() {
        return selfs.get(this).canSwim;
    }

    draw(g, width, height) {
        const self = selfs.get(this);

        if (self.aspectRatio === null) {
            const oldFont = g.font;
            const size = 100;
            g.font = size + "px sans-serif";
            const metrics = g.measureText(this.value);
            self.aspectRatio = metrics.width / size;
            self.x = (size - metrics.width) / 2;
            self.y = metrics.actualBoundingBoxAscent / 2;

            self.x /= size;
            self.y /= size;

            g.font = oldFont;
        }

        if (self.aspectRatio !== null) {
            const fontHeight = self.aspectRatio <= 1
                ? height
                : width / self.aspectRatio;

            g.font = fontHeight + "px sans-serif";
            g.fillText(this.value, self.x * fontHeight, self.y * fontHeight);
        }
    }
}