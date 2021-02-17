import type { Geometry } from "./Geometry";
import { Material } from "./Material";
import type { Texture } from "./Texture";
export declare class MaterialFlatTexture extends Material {
    private uTexture;
    private texture;
    private aPosition;
    private aColor;
    private aUV;
    constructor(gl: WebGL2RenderingContext, texture: Texture, clearBits?: number);
    setGeometry(geom: Geometry): void;
}
