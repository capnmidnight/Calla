import { BaseAvatar } from "./BaseAvatar";
/**
 * An avatar that uses an HTML Video element as its representation.
 **/
export declare class VideoAvatar extends BaseAvatar {
    /**
     * Creates a new avatar that uses a MediaStream as its representation.
     * @param {MediaStream|HTMLVideoElement} stream
     */
    constructor(stream: any);
    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g: any, width: any, height: any, isMe: any): void;
}
