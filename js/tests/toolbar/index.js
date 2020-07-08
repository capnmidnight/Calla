import { HeaderBar } from "../../src/forms/HeaderBar.js";
import { P, BR } from "../../src/html/tags.js";
import { FooterBar } from "../../src/forms/FooterBar.js";

const headbar = new HeaderBar();
const footbar = new FooterBar();

document.body.append(
    headbar.element,
    BR(),
    BR(),
    BR(),
    BR(),
    footbar.element);

let muted = false;

footbar.addEventListener("toggleAudio", (evt) => {
    muted = !muted;
    footbar.audioEnabled = !muted;
});

function echo(evt) {
    const label = P(evt.type);
    document.body.appendChild(label);
    setTimeout(() => {
        document.body.removeChild(label);
    }, 3000);
}

headbar.addEventListeners({
    options: echo,
    tweet: echo,
    leave: echo,
    toggleOptions: echo,
    toggleInstructions: echo
});

footbar.addEventListeners({
    toggleAudio: echo,
    emote: echo,
    selectEmoji: echo
});