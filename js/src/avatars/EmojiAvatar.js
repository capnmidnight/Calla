import { BaseAvatar } from "./BaseAvatar.js";
import { Emoji, isSurfer } from "../emoji/emoji.js";
import { Span } from "../html/tags.js";
import { title } from "../html/attrs.js";

const selfs = new WeakMap();

/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export class EmojiAvatar extends BaseAvatar {

    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {Emoji} emoji
     */
    constructor(emoji) {
        super(Span(
            title(emoji.desc),
            emoji.value));

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

    /**
     *  Is the avatar able to run on water?
     *  @type {boolean}
     **/
    get canSwim() {
        return selfs.get(this).canSwim;
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
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