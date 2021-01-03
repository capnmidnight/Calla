import { AvatarMode } from "./AvatarMode";
import { BaseAvatar, BaseAvatarChangedEvent } from "./BaseAvatar";
export declare class EmojiAvatarChangedEvent extends BaseAvatarChangedEvent<AvatarMode.Emoji, string> {
    constructor(emoji: string);
}
/**
 * An avatar that uses a Unicode emoji as its representation
 **/
export declare class EmojiAvatar extends BaseAvatar {
    value: string;
    /**
     * Creats a new avatar that uses a Unicode emoji as its representation.
     */
    constructor(emoji: string);
}
