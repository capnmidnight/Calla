import { ToolBar } from "../../src/forms/ToolBar.js";
import { P } from "../../src/html/tags.js";
const toolbar = new ToolBar();
document.body.appendChild(toolbar.element);

let muted = false;

toolbar.addEventListener("toggleaudio", (evt) => {
    muted = !muted;
    toolbar.audioEnabled = !muted;
});

function echo(evt) {
    const label = P(evt.type);
    document.body.appendChild(label);
    setTimeout(() => {
        document.body.removeChild(label);
    }, 3000);
}

document.body.append(P("asdf"));

toolbar.addEventListener("toggleaudio", echo);
toolbar.addEventListener("emote", echo);
toolbar.addEventListener("selectemoji", echo);
toolbar.addEventListener("zoomchanged", echo);
toolbar.addEventListener("options", echo);
toolbar.addEventListener("tweet", echo);
toolbar.addEventListener("leave", echo);
toolbar.addEventListener("toggleui", echo);
toolbar.addEventListener("toggleoptions", echo);
toolbar.addEventListener("toggleinstructions", echo);