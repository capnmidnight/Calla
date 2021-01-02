import { isSurfer } from "kudzu/emoji/emojis";
import { TextImage } from "kudzu/graphics2d/TextImage";
import { setContextSize } from "kudzu/html/canvas";
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
        emojiText.fillColor = emoji.color || "black";
        emojiText.fontFamily = "Noto Color Emoji";
        emojiText.fontSize = 256;
        emojiText.value = this.value;
        setContextSize(this.g, emojiText.width, emojiText.height);
        emojiText.draw(this.g, 0, 0);
    }
}
//# sourceMappingURL=EmojiAvatar.js.map