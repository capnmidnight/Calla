import "./protos.js";
import { bestIcons } from "./emoji.js";

export class EmojiForm extends EventTarget {
    constructor(emojiView) {
        super();

        const emojiContainer = emojiView.querySelector(".content"),
            confirmEmojiButton = emojiView.querySelector("button.confirm"),
            cancelEmojiButton = emojiView.querySelector("button.cancel"),
            recentEmoji = emojiView.querySelector(".recent"),
            emojiPreview = emojiView.querySelector(".preview"),
            cancel = new Event("emojiCanceled"),
            previousEmoji = [],
            allAlts = [];

        let selectedEmoji = null,
            idCounter = 0;

        const closeAll = () => {
            for (let alt of allAlts) {
                alt.hide();
            }
        }

        const addIconsToContainer = (group, container, isAlts) => {
            for (let icon of group) {
                const g = document.createElement(isAlts ? "ul" : "span"),
                    btn = document.createElement("button");
                let alts = null;

                btn.type = "button";
                btn.title = icon.desc;
                btn.innerHTML = icon.value;
                btn.addEventListener("click", (evt) => {
                    selectedEmoji = icon;
                    emojiPreview.innerHTML = `${icon.value} - ${icon.desc}`;
                    confirmEmojiButton.unlock();
                    if (!!alts) {
                        alts.toggleOpen();
                        btn.innerHTML = icon.value + (alts.isOpen() ? "-" : "+");
                    }
                });

                if (isAlts) {
                    const item = document.createElement("li"),
                        id = `emoji-with-alt-${idCounter++}`,
                        label = document.createElement("label");

                    btn.id = id;
                    label.htmlFor = id;
                    label.innerHTML = icon.desc;

                    item.appendChild(btn);
                    item.appendChild(label);

                    g.appendChild(item);
                }
                else {
                    g.appendChild(btn);
                }

                if (!!icon.alt) {
                    alts = document.createElement("div");
                    allAlts.push(alts);
                    addIconsToContainer(icon.alt, alts, true);
                    alts.hide();
                    g.appendChild(alts);
                    btn.style.width = "3em";
                    btn.innerHTML += "+";
                }

                container.appendChild(g);
            }
        };

        confirmEmojiButton.addEventListener("click", () => {
            const idx = previousEmoji.indexOf(selectedEmoji);
            if (idx === -1) {
                previousEmoji.push(selectedEmoji);
                recentEmoji.innerHTML = "";
                addIconsToContainer(previousEmoji, recentEmoji);
            }

            emojiView.hide();
            this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
        });

        cancelEmojiButton.addEventListener("click", () => {
            confirmEmojiButton.lock();
            emojiView.hide();
            this.dispatchEvent(cancel);
        });

        this.isOpen = emojiView.isOpen.bind(emojiView);

        this.selectAsync = () => {
            return new Promise((resolve, reject) => {
                let yes = null,
                    no = null;

                const done = () => {
                    this.removeEventListener("emojiSelected", yes);
                    this.removeEventListener("emojiCanceled", no);
                };

                yes = (evt) => {
                    done();
                    try {
                        resolve(evt.emoji);
                    }
                    catch (exp) {
                        reject(exp);
                    }
                };

                no = () => {
                    done();
                    resolve(null);
                };

                this.addEventListener("emojiSelected", yes);
                this.addEventListener("emojiCanceled", no);

                closeAll();
                emojiView.show();
            });
        };

        for (let key of Object.keys(bestIcons)) {
            const header = document.createElement("h1"),
                container = document.createElement("p"),
                group = bestIcons[key];

            header.innerHTML = key;
            addIconsToContainer(group, container);

            emojiContainer.appendChild(header);
            emojiContainer.appendChild(container);
        }

        confirmEmojiButton.lock();
        emojiView.hide();
    }
}

class EmojiSelectedEvent extends Event {
    constructor(emoji) {
        super("emojiSelected");
        this.emoji = emoji;
    }
}