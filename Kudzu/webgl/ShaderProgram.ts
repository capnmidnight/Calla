import { AttribLocation } from "./AttribLocation";
import { ManagedWebGLResource } from "./ManagedWebGLResource";
import type { ShaderFragment } from "./ShaderFragment";
import type { ShaderVertex } from "./ShaderVertex";
import { UniformLocation } from "./UniformLocation";

// Manage the shader program
export class ShaderProgram extends ManagedWebGLResource<WebGLProgram> {
    private vertexShader: ShaderVertex;
    private fragmentShader: ShaderFragment;

    /**
     * @param gl - the rendering context in which we're working.
     * @param vertexShader - first half of the shader program.
     * @param fragmentShader - the second half of the shader program.
     */
    constructor(gl: WebGL2RenderingContext, vertexShader: ShaderVertex, fragmentShader: ShaderFragment) {
        super(gl, gl.createProgram());

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

    private disposed = false;
    dispose(): void {
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

    attachShader(shader: WebGLShader) {
        this.gl.attachShader(this.handle, shader);
    }

    detachShader(shader: WebGLShader) {
        this.gl.detachShader(this.handle, shader);
    }

    getParameter(param: number) {
        return this.gl.getProgramParameter(this.handle, param);
    }

    getAttribLocation(name: string) {
        return new AttribLocation(this.gl, this.gl.getAttribLocation(this.handle, name), name);
    }

    getUniformLocation(name: string) {
        return new UniformLocation(this.gl, this.gl.getUniformLocation(this.handle, name), name);
    }
}
