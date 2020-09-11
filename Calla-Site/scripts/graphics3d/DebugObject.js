import { BoxBufferGeometry } from "three/src/geometries/BoxGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";

const colors = new Map();
const cube = new BoxBufferGeometry(0.1, 0.1, 0.1, 1, 1, 1);
export function DebugObject(color = 0xff0000) {
    if (!colors.has(color)) {
        colors.set(color, new MeshBasicMaterial({ color }));
    }
    return new Mesh(cube, colors.get(color));
}