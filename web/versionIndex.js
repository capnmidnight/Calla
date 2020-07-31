import { versionString } from "../js/src/version.js";
const c = document.querySelector("#version");
if (c) {
    c.innerHTML = versionString;
}