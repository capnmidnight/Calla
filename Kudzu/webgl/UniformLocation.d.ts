import { ManagedWebGLObject } from "./ManagedWebGLObject";
import type { Texture } from "./Texture";
export declare class UniformLocation extends ManagedWebGLObject<WebGLUniformLocation> {
    readonly name: string;
    constructor(gl: WebGL2RenderingContext, handle: WebGLUniformLocation, name: string);
    setMatrix4fv(data: Float32List): void;
    setUniform1i(v: number): void;
    setUniform1f(v: number): void;
    setTexture(texture: Texture, slot: number): void;
}
