export abstract class ManagedWebGLObject<PointerT> {
    protected gl: WebGL2RenderingContext;
    protected handle: PointerT;

    constructor(gl: WebGL2RenderingContext, handle: PointerT) {
        this.gl = gl;
        this.handle = handle;
    }
}