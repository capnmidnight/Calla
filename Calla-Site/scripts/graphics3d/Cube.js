import { BoxBufferGeometry } from "three/src/geometries/BoxGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";
import { solid } from "./solid";

export const cube = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
cube.name = "CubeGeom";

export const invCube = cube.clone();
invCube.name = "InvertedCubeGeom";
setGeometryUVsForCubemaps(invCube);

/**
 * @param {string|number|import("three").Color} color
 * @param {number} sx
 * @param {number} sy
 * @param {number} sz
 */
export class Cube extends Mesh {
    constructor(color, sx, sy, sz) {
        super(cube, solid({ color }));
        this.scale.set(sx, sy, sz);
    }
}
