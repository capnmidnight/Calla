import { FooterBar } from "../../../src/forms/FooterBar.js";
import { HeaderBar } from "../../../src/forms/HeaderBar.js";
import { BR, P } from "../../../src/html/tags.js";
import { addEventListeners } from "../../../src/events/addEventListeners.js";

const headbar = new HeaderBar();
const footbar = new FooterBar();

document.body.append(
    headbar.element,
    BR(),
    BR(),
    BR(),
    BR(),
    footbar.element);

function echo(evt) {
    const label = P(evt.type);
    document.body.appendChild(label);
    setTimeout(() => {
        document.body.removeChild(label);
    }, 3000);
}

addEventListeners(headbar, {
    options: echo,
    tweet: echo,
    leave: echo,
    toggleOptions: echo,
    toggleInstructions: echo,
    toggleUserDirectory: echo,
    toggleFullscreen: echo
});

addEventListeners(footbar, {
    toggleAudio: echo,
    emote: echo,
    selectEmoji: echo
});

addEventListeners(footbar, {
    toggleAudio: (evt) => {
        footbar.audioEnabled = !footbar.audioEnabled;
    },

    toggleVideo: () => {
        footbar.videoEnabled = !footbar.videoEnabled;
    }
});