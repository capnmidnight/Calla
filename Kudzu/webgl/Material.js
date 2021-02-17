import { ShaderFragment } from "./ShaderFragment";
import { ShaderProgram } from "./ShaderProgram";
import { ShaderVertex } from "./ShaderVertex";
export class Material {
    constructor(gl, vertSrc, fragSrc, clearBits) {
        this.disposed = false;
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
    setCamera(cam) {
        this.uProjection.setMatrix4fv(cam.projection);
        this.uView.setMatrix4fv(cam.view);
        this.uAspect.setUniform1f(cam.aspect);
        this.uGamma.setUniform1f(cam.gamma);
    }
    setModel(model) {
        this.uModel.setMatrix4fv(model);
    }
    dispose() {
        if (!this.disposed) {
            this.program.dispose();
            this.vertShader.dispose();
            this.fragShader.dispose();
            this.disposed = true;
        }
    }
}
//# sourceMappingURL=Material.js.map