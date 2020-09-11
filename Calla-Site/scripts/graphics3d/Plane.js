import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { solid } from "./solid";

export const plane = new PlaneBufferGeometry(1, 1, 1, 1);
plane.name = "PlaneGeom";

/**
 * @param {string|number|import("three").Color} color
 * @param {number} sx
 * @param {number} sy
 * @param {number} sz
 */
export class Cube extends Mesh {
    constructor(color, sx, sy, sz) {
        super(cube, solid({ color, transparent: true, opacity: 1 }));
        this.scale.set(sx, sy, sz);
    }
}
