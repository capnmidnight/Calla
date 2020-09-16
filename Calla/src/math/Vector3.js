export class Vector3 {
    constructor() {
        /** @type {number} */
        this.x = 0;

        /** @type {number} */
        this.y = 0;

        /** @type {number} */
        this.z = 0;

        Object.seal(this);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @param {Vector3} v
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
}