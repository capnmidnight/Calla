import { ManagedWebGLResource } from "./ManagedWebGLResource";
export declare class Texture extends ManagedWebGLResource<WebGLTexture> {
    constructor(gl: WebGL2RenderingContext, image: TexImageSource, pixelType?: GLenum, componentType?: GLenum);
    bind(): void;
    private disposed;
    dispose(): void;
}
