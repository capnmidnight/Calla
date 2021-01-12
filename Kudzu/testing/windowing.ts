import { getUserNumber } from "./userNumber";

const windows: Window[] = [];

if ("window" in globalThis) {
    // Closes all the windows.
    window.addEventListener("unload", () => {
        for (const w of windows) {
            w.close();
        }
    });
}

/**
 * Opens a window that will be closed when the window that opened it is closed.
 * @param href - the location to load in the window
 * @param x - the screen position horizontal component
 * @param y - the screen position vertical component
 * @param width - the screen size horizontal component
 * @param height - the screen size vertical component
 */
export function openWindow(href: string, x: number, y: number, width: number, height: number) {
    if ("window" in globalThis) {
        const w = window.open(href, "_blank", `left=${x},top=${y},width=${width},height=${height}`);
        if (w) {
            windows.push(w);
        }
    }
    else {
        throw new Error("Cannot open a window from a Worker.");
    }
}

/**
 * Opens a new window with a query string parameter that can be used to differentiate different test instances.
 **/
export function openSideTest() {
    if ("window" in globalThis) {
        const loc = new URL(location.href);
        loc.searchParams.set("testUserNumber", (getUserNumber() + windows.length + 1).toString());
        openWindow(
            loc.href,
            window.screenLeft + window.outerWidth,
            0,
            window.innerWidth,
            window.innerHeight);
    }
    else {
        throw new Error("Cannot open a window from a Worker.");
    }
}