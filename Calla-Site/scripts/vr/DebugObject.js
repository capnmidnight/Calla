import { BoxBufferGeometry, MeshBasicMaterial, Mesh } from "three";

const cube = new BoxBufferGeometry(0.1, 0.1, 0.1, 1, 1, 1),
    mube = new MeshBasicMaterial({ color: 0xff0000 });
export function DebugObject() {
    return new Mesh(cube, mube);
}