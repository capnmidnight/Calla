import type { mat4 } from "gl-matrix";
import type { IDisposable } from "../using";
import type { Camera } from "./Camera";
import type { Geometry } from "./Geometry";
import { ShaderFragment } from "./ShaderFragment";
import { ShaderProgram } from "./ShaderProgram";
import { ShaderVertex } from "./ShaderVertex";
import type { UniformLocation } from "./UniformLocation";

export abstract class Material implements IDisposable {
    protected gl: WebGL2RenderingContext;
    protected program: ShaderProgram;
    private vertShader: ShaderVertex;
    private fragShader: ShaderFragment;
    private clearBits: number;

    private uProjection: UniformLocation;
    private uView: UniformLocation;
    private uModel: UniformLocation;
    private uAspect: UniformLocation;
    private uGamma: UniformLocation;

    constructor(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string, clearBits?: number) {
        try {
            this.vertShader = new ShaderVertex(gl, vertSrc);
            this.fragShader = new ShaderFragment(gl, fragSrc);
            this.program = new ShaderProgram(gl, this.vertShader, this.fragShader);

            this.uProjection = this.program.getUniformLocation("uProjection");
            this.uView = this.program.getUniformLocation("uView");
            this.uModel = this.program.getUniformLocation("uModel");
            this.uAspect = this.program.getUniformLocation("uAspect");
            this.uGamma = this.program.getUniformLocation("uGamma");

            this.gl = gl;
            this.clearBits = clearBits || (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        catch (exp) {
            this.dispose();
            throw exp;
        }
    }

    use() {
        if (!this.program) {
            throw new Error("Program is not ready to use.");
        }

        this.program.use();
    }

    clear() {
        if (this.clearBits) {
            this.gl.clear(this.clearBits);
        }
    }

    setCamera(cam: Camera) {
        this.uProjection.setMatrix4fv(cam.projection);
        this.uView.setMatrix4fv(cam.view);
        this.uAspect.setUniform1f(cam.aspect);
        this.uGamma.setUniform1f(cam.gamma);
    }

    setModel(model: mat4) {
        this.uModel.setMatrix4fv(model);
    }

    abstract setGeometry(geom: Geometry): void;

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.program.dispose();
            this.vertShader.dispose();
            this.fragShader.dispose();
            this.disposed = true;
        }
    }
}
