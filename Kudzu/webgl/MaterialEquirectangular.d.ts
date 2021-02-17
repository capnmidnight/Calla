import type { Geometry } from "./Geometry";
import { Material } from "./Material";
import type { Texture } from "./Texture";
export declare class MaterialEquirectangular extends Material {
    private uTexture;
    private texture;
    private aPosition;
    constructor(gl: WebGL2RenderingContext, texture: Texture, clearBits?: number);
    setGeometry(geom: Geometry): void;
}
