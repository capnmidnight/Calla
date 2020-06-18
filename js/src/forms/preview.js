import {
    H2,
    Video
} from "../html/tags.js";

import {
    autoPlay,
    controls,
    loop,
    src,
    style
} from "../html/attrs.js";

export function preview() {
    return [
        H2("Preview"),
        Video(src("/videos/demo.webm"),
            style({ width: "100%" }),
            loop,
            autoPlay,
            controls)];
}