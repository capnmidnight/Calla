import { ManagedWebGLResource } from "./ManagedWebGLResource";
import type { ShaderProgram } from "./ShaderProgram";

function resolveShaderType(gl: WebGL2RenderingContext, type: string): GLenum {
    if (type === "vertex") {
        return gl.VERTEX_SHADER;
    } else if (type === "fragment") {
        return gl.FRAGMENT_SHADER;
    } else {
        throw new Error(`Unknown shader type: ${type}`);
    }
}

// Manage a shader
export class Shader extends ManagedWebGLResource<WebGLShader> {
    /**
    * @param type - the type of the shader. Expected values are:
        "vertex" - a vertex shader
        "fragment" - a fragment shader.
    * @param gl - the rendering context in which we're working.
    * @param src - the source code for the shader.
    */
    constructor(type: string, gl: WebGL2RenderingContext, src: string) {
        super(gl, gl.createShader(resolveShaderType(gl, type)));

        this.setSource(src);
        this.compile();
        if (!this.getParameter(gl.COMPILE_STATUS)) {
            const errorMessage = this.getInfoLog() || "Unknown error";
            this.dispose();
            throw new Error(errorMessage);
        }
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.gl.deleteShader(this.handle);
            this.disposed = true;
        }
    }

    setSource(src: string) {
        this.gl.shaderSource(this.handle, src);
    }

    compile() {
        this.gl.compileShader(this.handle);
    }

    getParameter(param: number) {
        return this.gl.getShaderParameter(this.handle, param);
    }

    getInfoLog() {
        return this.gl.getShaderInfoLog(this.handle);
    }

    addTo(program: ShaderProgram) {
        program.attachShader(this.handle);
    }

    removeFrom(program: ShaderProgram) {
        program.detachShader(this.handle);
    }
}
