import { getUserNumber } from "./userNumber";
const windows = [];
// Closes all the windows.
window.addEventListener("unload", () => {
    for (const w of windows) {
        w.close();
    }
});
/**
 * Opens a window that will be closed when the window that opened it is closed.
 * @param href - the location to load in the window
 * @param x - the screen position horizontal component
 * @param y - the screen position vertical component
 * @param width - the screen size horizontal component
 * @param height - the screen size vertical component
 */
export function openWindow(href, x, y, width, height) {
    const w = window.open(href, "_blank", `left=${x},top=${y},width=${width},height=${height}`);
    if (w) {
        windows.push(w);
    }
}
/**
 * Opens a new window with a query string parameter that can be used to differentiate different test instances.
 **/
export function openSideTest() {
    const loc = new URL(document.location.href);
    loc.searchParams.set("testUserNumber", (getUserNumber() + windows.length + 1).toString());
    openWindow(loc.href, window.screenLeft + window.outerWidth, 0, window.innerWidth, window.innerHeight);
}
//# sourceMappingURL=windowing.js.map