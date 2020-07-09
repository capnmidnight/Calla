export class BaseAvatar {

    constructor(element) {
        this.element = element;
    }

    /** @type {boolean} */
    get canSwim() {
        return false;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} g
     * @param {number} width
     * @param {number} height
     */
    draw(g, width, height) {
        throw new Error("Not implemented in base class");
    }
}

export const AvatarMode = Object.freeze({
    none: null,
    emoji: "emoji",
    photo: "photo",
    video: "video"
});