import { lerp } from "../../math.js";

/**
 * A 3D point.
 **/
export class Vector {
    /**
     * Creates a new 3D point.
     **/
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        Object.seal(this);
    }

    /**
     * Sets the components of this vector.
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
     * Copies another vector into this vector.
     * @param {Vector} other
     */
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
    }

    /**
     * Performs a linear interpolation between two vectors,
     * storing the result in this vector.
     * @param {Vector} a
     * @param {Vector} b
     * @param {number} p
     */
    lerp(a, b, p) {
        this.x = lerp(a.x, b.x, p);
        this.y = lerp(a.y, b.y, p);
        this.z = lerp(a.z, b.z, p);
    }

    /**
     * Computes the dot product of this vector with another vector
     * @param {Vector} other
     */
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * Subtracts two vectors and stores the result in this vector.
     * @param {Vector} a
     * @param {Vector} b
     */
    sub(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
    }

    /**
     * Performs a spherical linear interpolation between two vectors,
     * storing the result in this vector.
     * @param {Vector} a
     * @param {Vector} b
     * @param {number} p
     */
    slerp(a, b, p) {
        const dot = a.dot(b);
        const angle = Math.acos(dot);
        if (angle !== 0) {
            const c = Math.sin(angle);
            const pA = Math.sin((1 - p) * angle) / c;
            const pB = Math.sin(p * angle) / c;
            this.x = pA * a.x + pB * b.x;
            this.y = pA * a.y + pB * b.y;
            this.x = pA * a.z + pB * b.z;
        }
    }

    /**
     * Gets the squared length of the vector
     **/
    get lenSq() {
        return this.dot(this);
    }

    /**
     * Gets the length of the vector
     **/
    get len() {
        return Math.sqrt(this.lenSq);
    }

    /**
     * Makes this vector a unit vector
     **/
    normalize() {
        const len = this.len;
        if (len !== 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
    }
}
