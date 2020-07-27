import { Canvas } from "../html/tags.js";

/**
 * A base class for different types of avatars.
 **/
export class BaseAvatar {

    /**
     * Encapsulates a resource to use as an avatar.
     * @param {boolean} canSwim
     */
    constructor(canSwim) {
        this.canSwim = canSwim;
        this.element = Canvas(128, 128);
        this.g = this.element.getContext("2d");
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        const aspectRatio = this.element.width / this.element.height,
            w = aspectRatio > 1 ? width : aspectRatio * height,
            h = aspectRatio > 1 ? width / aspectRatio : height,
            dx = (width - w) / 2,
            dy = (height - h) / 2;
        g.drawImage(
            this.element,
            dx, dy,
            w, h);
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