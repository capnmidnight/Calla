import { waitFor } from "../events/waitFor";
import { createScript } from "./createScript";
import { getFile } from "./getFile";
export async function loadScript(path, test, onProgress) {
    if (!test()) {
        const scriptLoadTask = waitFor(test);
        const file = await getFile(path, onProgress);
        createScript(file);
        await scriptLoadTask;
    }
    else if (onProgress) {
        onProgress(1, 1, "skip");
    }
}
//# sourceMappingURL=loadScript.js.map