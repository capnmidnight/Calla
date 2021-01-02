import type { Context2D } from "kudzu/html/canvas";
import { BaseAvatar } from "./BaseAvatar";
/**
 * An avatar that uses an HTML Video element as its representation.
 **/
export declare class VideoAvatar extends BaseAvatar {
    video: HTMLVideoElement;
    /**
     * Creates a new avatar that uses a MediaStream as its representation.
     */
    constructor(stream: MediaProvider);
    /**
     * Render the avatar at a certain size.
     * @param g - the context to render to
     * @param width - the width the avatar should be rendered at
     * @param height - the height the avatar should be rendered at.
     * @param isMe - whether the avatar is the local user
     */
    draw(g: Context2D, width: number, height: number, isMe: boolean): void;
}
