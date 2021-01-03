import type { CanvasTypes, Context2D } from "kudzu/html/canvas";
import type { AvatarMode } from "./AvatarMode";
import type { EmojiAvatarChangedEvent } from "./EmojiAvatar";
import type { PhotoAvatarChangedEvent } from "./PhotoAvatar";
import type { VideoAvatarChangedEvent } from "./VideoAvatar";
export declare abstract class BaseAvatarChangedEvent<ModeT extends AvatarMode, AvatarT> extends Event {
    mode: ModeT;
    avatar: AvatarT;
    constructor(mode: ModeT, avatar: AvatarT);
}
export declare type AvatarChangedEvent = EmojiAvatarChangedEvent | PhotoAvatarChangedEvent | VideoAvatarChangedEvent;
/**
 * A base class for different types of avatars.
 **/
export declare class BaseAvatar {
    mode: AvatarMode;
    canSwim: boolean;
    element: CanvasTypes;
    protected g: Context2D;
    /**
     * Encapsulates a resource to use as an avatar.
     */
    constructor(mode: AvatarMode, canSwim: boolean);
    /**
     * Render the avatar at a certain size.
     * @param g - the context to render to
     * @param width - the width the avatar should be rendered at
     * @param height - the height the avatar should be rendered at.
     * @param isMe - whether the avatar is the local user
     */
    draw(g: Context2D, width: number, height: number, _isMe: boolean): void;
}
