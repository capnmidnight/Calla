import { versionString } from "../../../Calla/src/version";
const c = document.querySelector("#version");
if (c) {
    c.innerHTML = versionString;
}