import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

const colors = new Map();

export function solid(opts) {
    const key = Object
        .keys(opts)
        .map(k => `${k}:${opts[k]}`)
        .join(",");

    if (!colors.has(key)) {
        colors.set(key, new MeshBasicMaterial(opts));
    }

    return colors.get(key);
}