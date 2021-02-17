import { ManagedWebGLResource } from "./ManagedWebGLResource";
import type { ShaderProgram } from "./ShaderProgram";
export declare class Shader extends ManagedWebGLResource<WebGLShader> {
    /**
    * @param type - the type of the shader. Expected values are:
        "vertex" - a vertex shader
        "fragment" - a fragment shader.
    * @param gl - the rendering context in which we're working.
    * @param src - the source code for the shader.
    */
    constructor(type: string, gl: WebGL2RenderingContext, src: string);
    private disposed;
    dispose(): void;
    setSource(src: string): void;
    compile(): void;
    getParameter(param: number): any;
    getInfoLog(): string;
    addTo(program: ShaderProgram): void;
    removeFrom(program: ShaderProgram): void;
}
