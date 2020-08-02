import { EmojiForm } from "../../../src/forms/EmojiForm.js";

const emoji = new EmojiForm();
document.body.appendChild(emoji.element);
emoji.element.style.height = "100%";

async function showEmoji() {
    const emote = await emoji.selectAsync();
    console.log(emote);
    setTimeout(showEmoji, 1000);
}

showEmoji();