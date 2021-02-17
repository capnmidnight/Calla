import { AttribLocation } from "./AttribLocation";
import { ManagedWebGLResource } from "./ManagedWebGLResource";
import { UniformLocation } from "./UniformLocation";
// Manage the shader program
export class ShaderProgram extends ManagedWebGLResource {
    /**
     * @param gl - the rendering context in which we're working.
     * @param vertexShader - first half of the shader program.
     * @param fragmentShader - the second half of the shader program.
     */
    constructor(gl, vertexShader, fragmentShader) {
        super(gl, gl.createProgram());
        this.disposed = false;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.vertexShader.addTo(this);
        this.fragmentShader.addTo(this);
        this.link();
        this.validate();
        if (!this.getParameter(gl.LINK_STATUS)) {
            const errorMessage = this.getInfoLog() || "Unknown error";
            this.dispose();
            throw new Error(errorMessage);
        }
    }
    dispose() {
        if (!this.disposed) {
            this.vertexShader.removeFrom(this);
            this.fragmentShader.removeFrom(this);
            this.gl.deleteProgram(this.handle);
            this.disposed = true;
        }
    }
    link() {
        this.gl.linkProgram(this.handle);
    }
    validate() {
        this.gl.validateProgram(this.handle);
    }
    use() {
        this.gl.useProgram(this.handle);
    }
    getInfoLog() {
        return this.gl.getProgramInfoLog(this.handle);
    }
    attachShader(shader) {
        this.gl.attachShader(this.handle, shader);
    }
    detachShader(shader) {
        this.gl.detachShader(this.handle, shader);
    }
    getParameter(param) {
        return this.gl.getProgramParameter(this.handle, param);
    }
    getAttribLocation(name) {
        return new AttribLocation(this.gl, this.gl.getAttribLocation(this.handle, name), name);
    }
    getUniformLocation(name) {
        return new UniformLocation(this.gl, this.gl.getUniformLocation(this.handle, name), name);
    }
}
//# sourceMappingURL=ShaderProgram.js.map