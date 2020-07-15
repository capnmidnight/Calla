import { userNumber } from "./userNumber.js";

/** @type {Window[]} */
const windows = [];

// Closes all the windows.
window.addEventListener("unload", () => {
    for (let w of windows) {
        w.close();
    }
});

/**
 * Opens a window that will be closed when the window that opened it is closed.
 * @param {string} href - the location to load in the window
 * @param {number} x - the screen position horizontal component
 * @param {number} y - the screen position vertical component
 * @param {number} width - the screen size horizontal component
 * @param {number} height - the screen size vertical component
 */
function openWindow(href, x, y, width, height) {
    windows.push(window.open(href, "_blank", `left=${x},top=${y},width=${width},height=${height}`));
}
/**
 * Opens a new window with a query string parameter that can be used to differentiate different test instances.*/
export function openSideTest() {
    const loc = new URL(document.location.href);
    loc.searchParams.set("testUserNumber", userNumber + windows.length + 1);
    openWindow(
        loc.href,
        window.screenLeft + window.outerWidth,
        0,
        window.outerWidth,
        window.outerHeight);
}