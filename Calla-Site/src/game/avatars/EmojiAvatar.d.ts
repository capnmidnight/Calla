import type { Emoji } from "kudzu/emoji/Emoji";
import { BaseAvatar } from "./BaseAvatar";
/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export declare class EmojiAvatar extends BaseAvatar {
    value: string;
    desc: string;
    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {import("../../emoji/Emoji").Emoji} emoji
     */
    constructor(emoji: Emoji);
}
