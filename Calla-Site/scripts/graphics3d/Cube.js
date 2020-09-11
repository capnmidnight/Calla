import { BoxBufferGeometry } from "three/src/geometries/BoxGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";

export const cube = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
cube.name = "CubeGeom";

export const invCube = cube.clone();
invCube.name = "InvertedCubeGeom";
setGeometryUVsForCubemaps(invCube);

const colors = new Map();

/**
 * @param {string|number|import("three").Color} color
 * @param {number} sx
 * @param {number} sy
 * @param {number} sz
 */
export class Cube extends Mesh {
    constructor(color, sx, sy, sz) {
        if (!colors.has(color)) {
            colors.set(color, new MeshBasicMaterial({ color }));
        }
        super(cube, colors.get(color));
        this.scale.set(sx, sy, sz);
    }
}
