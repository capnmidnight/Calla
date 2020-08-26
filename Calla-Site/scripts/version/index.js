import { versionString } from "../calla/version";
const c = document.querySelector("#version");
if (c) {
    c.innerHTML = versionString;
}