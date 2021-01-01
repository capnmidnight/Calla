import { isSurfer } from "../../emoji/emojis";
import { TextImage } from "../../graphics2d/TextImage";
import { setContextSize } from "../../html/canvas";
import { BaseAvatar } from "./BaseAvatar";

/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export class EmojiAvatar extends BaseAvatar {

    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {import("../../emoji/Emoji").Emoji} emoji
     */
    constructor(emoji) {
        super(isSurfer(emoji));

        this.value = emoji.value;
        this.desc = emoji.desc;

        const emojiText = new TextImage();

        emojiText.color = emoji.color || "black";
        emojiText.fontFamily = "Noto Color Emoji";
        emojiText.fontSize = 256;
        emojiText.value = this.value;
        setContextSize(this.g, emojiText.width, emojiText.height);
        emojiText.draw(this.g, 0, 0);
    }
}