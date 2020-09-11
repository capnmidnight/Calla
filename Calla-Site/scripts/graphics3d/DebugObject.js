import { Cube } from "./Cube";

/**
 * @param {string|number|import("three").Color} color
 */
export function DebugObject(color = 0xff0000) {
    const center = new Cube(color, 0.1, 0.1, 0.1);
    const x = new Cube(0xff0000, 3, 0.1, 0.1);
    const y = new Cube(0x00ff00, 0.1, 3, 0.1);
    const z = new Cube(0x0000ff, 0.1, 0.1, 3);

    x.position.x = 1.5;
    y.position.y = 1.5;
    z.position.z = 1.5;

    center.add(x, y, z);
    return center;
}