import { BaseAvatar } from "./BaseAvatar";
/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export declare class EmojiAvatar extends BaseAvatar {
    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {import("../../emoji/Emoji").Emoji} emoji
     */
    constructor(emoji: any);
}
