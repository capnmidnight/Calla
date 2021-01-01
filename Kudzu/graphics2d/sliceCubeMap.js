import { nextPowerOf2 } from "../math/powerOf2";
import { sliceImage } from "./sliceImage";
var CubeMapFaceIndex;
(function (CubeMapFaceIndex) {
    CubeMapFaceIndex[CubeMapFaceIndex["None"] = -1] = "None";
    CubeMapFaceIndex[CubeMapFaceIndex["Left"] = 0] = "Left";
    CubeMapFaceIndex[CubeMapFaceIndex["Right"] = 1] = "Right";
    CubeMapFaceIndex[CubeMapFaceIndex["Up"] = 2] = "Up";
    CubeMapFaceIndex[CubeMapFaceIndex["Down"] = 3] = "Down";
    CubeMapFaceIndex[CubeMapFaceIndex["Back"] = 4] = "Back";
    CubeMapFaceIndex[CubeMapFaceIndex["Front"] = 5] = "Front";
})(CubeMapFaceIndex || (CubeMapFaceIndex = {}));
const cubemapPattern = {
    rows: 3,
    columns: 4,
    indices: [
        [CubeMapFaceIndex.None, CubeMapFaceIndex.Up, CubeMapFaceIndex.None, CubeMapFaceIndex.None],
        [CubeMapFaceIndex.Left, CubeMapFaceIndex.Front, CubeMapFaceIndex.Right, CubeMapFaceIndex.Back],
        [CubeMapFaceIndex.None, CubeMapFaceIndex.Down, CubeMapFaceIndex.None, CubeMapFaceIndex.None]
    ],
    rotations: [
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0]
    ]
};
export function sliceCubeMap(img) {
    const w1 = img.width / cubemapPattern.columns;
    const h1 = img.height / cubemapPattern.rows;
    const w2 = nextPowerOf2(w1);
    const h2 = nextPowerOf2(h1);
    const images = new Array(6);
    for (let r = 0; r < cubemapPattern.rows; ++r) {
        const indices = cubemapPattern.indices[r];
        const rotations = cubemapPattern.rotations[r];
        for (let c = 0; c < cubemapPattern.columns; ++c) {
            const index = indices[c];
            if (index > -1) {
                images[index] = sliceImage(img, c * w1, r * h1, w1, h1, w2, h2, rotations[c]);
            }
        }
    }
    return images;
}
//# sourceMappingURL=sliceCubeMap.js.map