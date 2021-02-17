import { Shader } from "./Shader";

export class ShaderVertex extends Shader {
    constructor(gl: WebGL2RenderingContext, src: string) {
        super("vertex", gl, src);
    }
}
