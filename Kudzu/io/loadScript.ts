import { waitFor } from "../events/waitFor";
import { createScript } from "./createScript";
import { getFile } from "./getFile";
import type { progressCallback } from "./progressCallback";

export async function loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void> {
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
