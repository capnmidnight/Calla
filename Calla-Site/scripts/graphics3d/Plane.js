import { PlaneBufferGeometry } from "../lib/three.js/src/geometries/PlaneGeometry";
import { Mesh } from "../lib/three.js/src/objects/Mesh";
import { solid } from "./solid";

export const plane = new PlaneBufferGeometry(1, 1, 1, 1);
plane.name = "PlaneGeom";

/**
 * @param {string|number|import("three").Color} color
 * @param {number} sx
 * @param {number} sy
 * @param {number} sz
 * @param {(import("three").MeshBasicMaterialParameters|import("three").MeshStandardMaterialParameters)?} materialOptions
 */
export class Plane extends Mesh {
    constructor(color, sx, sy, sz, materialOptions) {
        super(cube, solid(Object.assign(
            { transparent: true, opacity: 1 },
            materialOptions,
            { color })));
        this.scale.set(sx, sy, sz);
    }
}
