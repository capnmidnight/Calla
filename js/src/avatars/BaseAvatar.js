import { Emoji } from "../emoji/emoji.js";

/**
 * A base class for different types of avatars.
 **/
export class BaseAvatar {

    /**
     * Encapsulates a resource to use as an avatar.
     * @param {Image|Video|Emoji} element
     */
    constructor(element) {
        this.element = element;
    }

    /** 
     *  Is the avatar able to run on water?
     *  @type {boolean} 
     **/
    get canSwim() {
        return false;
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        throw new Error("Not implemented in base class");
    }
}

/**
 * Types of avatars.
 * @enum {string}
 **/
export const AvatarMode = Object.freeze({
    none: null,
    emoji: "emoji",
    photo: "photo",
    video: "video"
});