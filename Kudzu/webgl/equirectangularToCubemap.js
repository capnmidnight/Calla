import { createUtilityCanvas } from "../html/canvas";
import { usingAsync } from "../using";
import { Camera } from "./Camera";
import { Context3D } from "./Context3D";
import { Geometry } from "./Geometry";
import { invCube } from "./geometry/cubes";
import { MaterialEquirectangular } from "./MaterialEquirectangular";
import { Mesh } from "./Mesh";
import { Texture } from "./Texture";
const captureParams = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [-1, 0, 2, 1],
    [2, 0, 3, 1],
    [0, -1, 1, 2]
];
export async function equirectangularToCubemap(image, size, onProgress) {
    const ctx3d = new Context3D(createUtilityCanvas(size, size), {
        alpha: true,
        antialias: true,
        powerPreference: "low-power"
    });
    ctx3d.gl.clearColor(0, 0, 0, 1);
    ctx3d.gl.clearDepth(1);
    ctx3d.gl.enable(ctx3d.gl.DEPTH_TEST);
    ctx3d.gl.enable(ctx3d.gl.BLEND);
    ctx3d.gl.enable(ctx3d.gl.CULL_FACE);
    ctx3d.gl.cullFace(ctx3d.gl.BACK);
    ctx3d.gl.depthFunc(ctx3d.gl.LEQUAL);
    const output = createUtilityCanvas(size * 4, size * 3);
    const ctx2d = output.getContext("2d");
    const cam = new Camera(ctx3d, 90);
    return await usingAsync(new Texture(ctx3d.gl, image), async (texture) => await usingAsync(new MaterialEquirectangular(ctx3d.gl, texture), async (material) => await usingAsync(new Geometry(ctx3d.gl, invCube.verts, invCube.indices, ctx3d.gl.TRIANGLES), async (geom) => {
        const mesh = new Mesh(ctx3d.gl, material, geom);
        for (let i = 0; i < captureParams.length; ++i) {
            const [, , dx, dy] = captureParams[i];
            const [h, p] = captureParams[i];
            if (onProgress) {
                onProgress(i, captureParams.length, "rendering");
            }
            cam.rotateTo(h * 90, p * 90);
            ctx3d.gl.clear(ctx3d.gl.COLOR_BUFFER_BIT | ctx3d.gl.DEPTH_BUFFER_BIT);
            mesh.draw(cam);
            ctx2d.drawImage(ctx3d.gl.canvas, dx * size, dy * size);
            if (onProgress) {
                onProgress(i + 1, captureParams.length, "rendering");
            }
        }
        return output;
    })));
}
//# sourceMappingURL=equirectangularToCubemap.js.map