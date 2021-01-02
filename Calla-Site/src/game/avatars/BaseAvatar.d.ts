import type { CanvasTypes, Context2D } from "kudzu/html/canvas";
/**
 * A base class for different types of avatars.
 **/
export declare class BaseAvatar {
    canSwim: boolean;
    protected element: CanvasTypes;
    protected g: Context2D;
    /**
     * Encapsulates a resource to use as an avatar.
     */
    constructor(canSwim: boolean);
    /**
     * Render the avatar at a certain size.
     * @param g - the context to render to
     * @param width - the width the avatar should be rendered at
     * @param height - the height the avatar should be rendered at.
     * @param isMe - whether the avatar is the local user
     */
    draw(g: Context2D, width: number, height: number, _isMe: boolean): void;
}
