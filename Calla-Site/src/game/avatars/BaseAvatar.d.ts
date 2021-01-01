/**
 * A base class for different types of avatars.
 **/
export declare class BaseAvatar {
    /**
     * Encapsulates a resource to use as an avatar.
     * @param {boolean} canSwim
     */
    constructor(canSwim: any);
    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g: any, width: any, height: any, isMe: any): void;
}
