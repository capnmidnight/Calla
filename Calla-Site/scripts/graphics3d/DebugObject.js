import { BoxBufferGeometry } from "three/src/geometries/BoxGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";

const colors = new Map();
const cube = new BoxBufferGeometry(0.1, 0.1, 0.1, 1, 1, 1);

/**
 * @param {string|number|import("three").Color} color
 */
export function Cube(color) {
    if (!colors.has(color)) {
        colors.set(color, new MeshBasicMaterial({ color }));
    }
    return new Mesh(cube, colors.get(color));
}

/**
 * @param {string|number|import("three").Color} color
 */
export function DebugObject(color = 0xff0000) {
    const center = Cube(color);
    const x = Cube(0xff0000);
    const y = Cube(0x00ff00);
    const z = Cube(0x0000ff);

    x.scale.set(3, 0.1, 0.1);
    x.position.x = 0.15;

    y.scale.set(0.1, 3, 0.1);
    y.position.y = 0.15;

    z.scale.set(0.1, 0.1, 3);
    z.position.z = 0.15;

    center.add(x, y, z);
    return center;
}