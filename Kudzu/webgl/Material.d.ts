import type { mat4 } from "gl-matrix";
import type { IDisposable } from "../using";
import type { Camera } from "./Camera";
import type { Geometry } from "./Geometry";
import { ShaderProgram } from "./ShaderProgram";
export declare abstract class Material implements IDisposable {
    protected gl: WebGL2RenderingContext;
    protected program: ShaderProgram;
    private vertShader;
    private fragShader;
    private clearBits;
    private uProjection;
    private uView;
    private uModel;
    private uAspect;
    private uGamma;
    constructor(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string, clearBits?: number);
    use(): void;
    clear(): void;
    setCamera(cam: Camera): void;
    setModel(model: mat4): void;
    abstract setGeometry(geom: Geometry): void;
    private disposed;
    dispose(): void;
}
