import { versionString } from "../calla/version.js";
const c = document.querySelector("#version");
if (c) {
    c.innerHTML = versionString;
}