import { BoxBufferGeometry } from "../lib/three.js/src/geometries/BoxGeometry";
import { Mesh } from "../lib/three.js/src/objects/Mesh";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";
import { solid } from "./solid";

export const cube = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
cube.name = "CubeGeom";

export const invCube = cube.clone();
invCube.name = "InvertedCubeGeom";
setGeometryUVsForCubemaps(invCube);

/**
 * @param {string|number|import("../lib/three.js").Color} color
 * @param {number} sx
 * @param {number} sy
 * @param {number} sz
 * @param {(import("../lib/three.js").MeshBasicMaterialParameters|import("../lib/three.js").MeshStandardMaterialParameters)?} materialOptions
 */
export class Cube extends Mesh {
    constructor(color, sx, sy, sz, materialOptions) {
        super(cube, solid(Object.assign(
            { transparent: true, opacity: 1 },
            materialOptions,
            { color })));
        this.scale.set(sx, sy, sz);
    }
}
