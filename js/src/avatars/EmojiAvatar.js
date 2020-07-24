import { BaseAvatar } from "./BaseAvatar.js";
import { Emoji, isSurfer } from "../emoji/emoji.js";
import { Span } from "../html/tags.js";
import { title } from "../html/attrs.js";
import { TextImage } from "../graphics/TextImage.js";

/** @type {WeakMap<EmojiAvatar, EmojiAvatarPrivate>} */
const selfs = new WeakMap();

class EmojiAvatarPrivate {
    constructor(emoji) {
        this.canSwim = isSurfer(emoji);
        this.x = 0;
        this.y = 0;
        this.aspectRatio = null;
    }
}

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

        const self = new EmojiAvatarPrivate(emoji);
        selfs.set(this, self);

        this.value = emoji.value;
        this.desc = emoji.desc;
        this.emojiText = new TextImage("sans-serif");
        this.emojiText.color = emoji.color || "black";
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
            this.emojiText.fontSize = 100;
            this.emojiText.scale = 1;
            this.emojiText.value = this.value;
            self.aspectRatio = this.emojiText.width / this.emojiText.height;
        }

        if (self.aspectRatio !== null) {
            const fontHeight = self.aspectRatio <= 1
                ? height
                : width / self.aspectRatio;
            this.emojiText.fontSize = fontHeight;
            this.emojiText.scale = g.getTransform().a;
            this.emojiText.draw(g, 0, 0);
        }
    }
}