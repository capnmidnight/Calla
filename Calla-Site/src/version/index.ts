import { version } from "calla/package.json";
const c = document.querySelector("#version");
if (c) {
    c.innerHTML = "v" + version;
}