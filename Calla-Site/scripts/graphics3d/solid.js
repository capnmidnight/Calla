import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";

const colors = new Map();

export function solid(opts) {
    const key = Object
        .keys(opts)
        .map(k => `${k}:${opts[k]}`)
        .join(",");

    if (!colors.has(key)) {
        colors.set(key, new MeshStandardMaterial(opts));
    }

    return colors.get(key);
}