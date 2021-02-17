import { AttribLocation } from "./AttribLocation";
import { ManagedWebGLResource } from "./ManagedWebGLResource";
import type { ShaderFragment } from "./ShaderFragment";
import type { ShaderVertex } from "./ShaderVertex";
import { UniformLocation } from "./UniformLocation";
export declare class ShaderProgram extends ManagedWebGLResource<WebGLProgram> {
    private vertexShader;
    private fragmentShader;
    /**
     * @param gl - the rendering context in which we're working.
     * @param vertexShader - first half of the shader program.
     * @param fragmentShader - the second half of the shader program.
     */
    constructor(gl: WebGL2RenderingContext, vertexShader: ShaderVertex, fragmentShader: ShaderFragment);
    private disposed;
    dispose(): void;
    link(): void;
    validate(): void;
    use(): void;
    getInfoLog(): string;
    attachShader(shader: WebGLShader): void;
    detachShader(shader: WebGLShader): void;
    getParameter(param: number): any;
    getAttribLocation(name: string): AttribLocation;
    getUniformLocation(name: string): UniformLocation;
}
