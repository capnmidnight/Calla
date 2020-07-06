import { userNumber } from "./userNumber.js";

const windows = [];

function openWindow(href, x, y, width, height) {
    windows.push(window.open(href, "_blank", `left=${x},top=${y},width=${width},height=${height}`));
}

export function openSideTest() {
    const loc = new URL(document.location.href);
    loc.searchParams.set("testUserNumber", userNumber + 1);
    const width = window.screen.availWidth / 2,
        height = window.screen.availHeight;
    openWindow(loc.href, width, 0, width, height);
}

window.addEventListener("unload", () => {
    for (let w of windows) {
        w.close();
    }
});