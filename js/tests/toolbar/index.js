import { ToolBar } from "../../src/forms/ToolBar.js";
import { P } from "../../src/html/tags.js";
const toolbar = new ToolBar();
document.body.appendChild(toolbar.element);

let muted = false;

toolbar.addEventListener("toggleAudio", (evt) => {
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

toolbar.addEventListeners({
    toggleAudio: echo,
    emote: echo,
    selectEmoji: echo,
    zoomChanged: echo,
    options: echo,
    tweet: echo,
    leave: echo,
    toggleUI: echo,
    toggleOptions: echo,
    toggleInstructions: echo
})