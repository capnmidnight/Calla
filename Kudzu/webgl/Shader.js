import { ManagedWebGLResource } from "./ManagedWebGLResource";
function resolveShaderType(gl, type) {
    if (type === "vertex") {
        return gl.VERTEX_SHADER;
    }
    else if (type === "fragment") {
        return gl.FRAGMENT_SHADER;
    }
    else {
        throw new Error(`Unknown shader type: ${type}`);
    }
}
// Manage a shader
export class Shader extends ManagedWebGLResource {
    /**
    * @param type - the type of the shader. Expected values are:
        "vertex" - a vertex shader
        "fragment" - a fragment shader.
    * @param gl - the rendering context in which we're working.
    * @param src - the source code for the shader.
    */
    constructor(type, gl, src) {
        super(gl, gl.createShader(resolveShaderType(gl, type)));
        this.disposed = false;
        this.setSource(src);
        this.compile();
        if (!this.getParameter(gl.COMPILE_STATUS)) {
            const errorMessage = this.getInfoLog() || "Unknown error";
            this.dispose();
            throw new Error(errorMessage);
        }
    }
    dispose() {
        if (!this.disposed) {
            this.gl.deleteShader(this.handle);
            this.disposed = true;
        }
    }
    setSource(src) {
        this.gl.shaderSource(this.handle, src);
    }
    compile() {
        this.gl.compileShader(this.handle);
    }
    getParameter(param) {
        return this.gl.getShaderParameter(this.handle, param);
    }
    getInfoLog() {
        return this.gl.getShaderInfoLog(this.handle);
    }
    addTo(program) {
        program.attachShader(this.handle);
    }
    removeFrom(program) {
        program.detachShader(this.handle);
    }
}
//# sourceMappingURL=Shader.js.map