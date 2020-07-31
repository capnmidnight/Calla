import { isSurfer } from "../emoji/emojis.js";
import { Emoji } from "../emoji/Emoji";
import { TextImage } from "../graphics/TextImage.js";
import { setContextSize } from "../html/canvas.js";
import { BaseAvatar } from "./BaseAvatar.js";

/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export class EmojiAvatar extends BaseAvatar {

    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {Emoji} emoji
     */
    constructor(emoji) {
        super(isSurfer(emoji));

        this.value = emoji.value;
        this.desc = emoji.desc;

        const emojiText = new TextImage("sans-serif");

        emojiText.color = emoji.color || "black";
        emojiText.fontSize = 256;
        emojiText.value = this.value;
        setContextSize(this.g, emojiText.width, emojiText.height);
        emojiText.draw(this.g, 0, 0);
    }
}