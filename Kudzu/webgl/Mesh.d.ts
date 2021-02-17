import { mat4 } from "gl-matrix";
import type { Camera } from "./Camera";
import type { Geometry } from "./Geometry";
import type { Material } from "./Material";
export declare class Mesh {
    private gl;
    private material;
    private geom;
    model: mat4;
    constructor(gl: WebGL2RenderingContext, material: Material, geom: Geometry);
    draw(cam: Camera): void;
}
