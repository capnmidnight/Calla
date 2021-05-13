import { isWorker } from "../html/flags";
import { isNumber } from "../typeChecks";
import { getUserNumber } from "./userNumber";
const windows = [];
if (!isWorker) {
    // Closes all the windows.
    window.addEventListener("unload", () => {
        for (const w of windows) {
            w.close();
        }
    });
}
export function openWindow(href, xOrWidth, yOrHeight, width, height) {
    if (isWorker) {
        throw new Error("Cannot open a window from a Worker.");
    }
    let opts = undefined;
    if (isNumber(width) && isNumber(height)) {
        opts = `left=${xOrWidth},top=${yOrHeight},width=${width},height=${height}`;
    }
    else if (isNumber(xOrWidth) && isNumber(yOrHeight)) {
        opts = `width=${xOrWidth},height=${yOrHeight}`;
    }
    const w = window.open(href, "_blank", opts);
    if (w) {
        windows.push(w);
    }
}
/**
 * Opens a new window with a query string parameter that can be used to differentiate different test instances.
 **/
export function openSideTest() {
    if (isWorker) {
        throw new Error("Cannot open a window from a Worker.");
    }
    const loc = new URL(location.href);
    loc.searchParams.set("testUserNumber", (getUserNumber() + windows.length + 1).toString());
    openWindow(loc.href, window.screenLeft + window.outerWidth, 0, window.innerWidth, window.innerHeight);
}
//# sourceMappingURL=windowing.js.map