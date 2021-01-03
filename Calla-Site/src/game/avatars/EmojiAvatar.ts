import { isSurfer } from "kudzu/emoji/emojis";
import { TextImage } from "kudzu/graphics2d/TextImage";
import { setContextSize } from "kudzu/html/canvas";
import { AvatarMode } from "./AvatarMode";
import { BaseAvatar, BaseAvatarChangedEvent } from "./BaseAvatar";

export class EmojiAvatarChangedEvent extends BaseAvatarChangedEvent<AvatarMode.Emoji, string> {
    constructor(emoji: string) {
        super(AvatarMode.Emoji, emoji);
    }
}

/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export class EmojiAvatar extends BaseAvatar {
    value: string;

    /**
     * Creats a new avatar that uses a Unicode emoji as its representation.
     */
    constructor(emoji: string) {
        super(AvatarMode.Emoji, isSurfer(emoji));

        this.value = emoji;

        const emojiText = new TextImage();

        emojiText.fillColor = (emoji as any).color || "black";
        emojiText.fontFamily = "Noto Color Emoji";
        emojiText.fontSize = 256;
        emojiText.value = this.value;
        setContextSize(this.g, emojiText.width, emojiText.height);
        emojiText.draw(this.g, 0, 0);
    }
}