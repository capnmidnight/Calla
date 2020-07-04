export class BaseAvatar {

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