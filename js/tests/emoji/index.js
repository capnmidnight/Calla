import { EmojiForm } from "../../src/forms/EmojiForm.js";
const emoji = new EmojiForm();
document.body.appendChild(emoji.element);
(async function () {
    while (true) {
        const emote = await emoji.selectAsync();
        console.log(emote);
    }
})();