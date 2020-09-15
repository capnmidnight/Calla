import { MeshBasicMaterial } from "../lib/three.js/src/materials/MeshBasicMaterial";
import { MeshStandardMaterial } from "../lib/three.js/src/materials/MeshStandardMaterial";

const colors = new Map();

/**
 * @param {(import("three").MeshBasicMaterialParameters|import("three").MeshStandardMaterialParameters)?} opts
 */
export function solid(opts) {
    const key = Object
        .keys(opts)
        .map(k => `${k}:${opts[k]}`)
        .join(",");

    if (!colors.has(key)) {
        const lit = opts.lit;
        if ("lit" in opts) {
            delete opts.lit;
        }

        if ("name" in opts) {
            delete opts.name;
        }

        if (lit !== false) {
            colors.set(key, new MeshStandardMaterial(opts));
        }
        else {
            colors.set(key, new MeshBasicMaterial(opts));
        }
    }

    return colors.get(key);
}