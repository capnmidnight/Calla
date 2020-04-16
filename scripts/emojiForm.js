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

        let selectedEmoji = null;

        const closeAll = () => {
            for (let alt of allAlts) {
                alt.hide();
            }
        }

        const addIconsToContainer = (group, container) => {
            for (let icon of group) {
                const g = document.createElement("span"),
                    btn = document.createElement("button");
                let alts = null;

                if (!!icon.alt) {
                    alts = document.createElement("div");
                    allAlts.push(alts);
                    addIconsToContainer(icon.alt, alts);
                    alts.hide();
                }

                btn.type = "button";
                btn.addEventListener("click", (evt) => {
                    selectedEmoji = icon;
                    emojiPreview.innerHTML = `${icon.value} - ${icon.desc}`;
                    confirmEmojiButton.unlock();
                    if (!!alts) {
                        alts.toggleOpen();
                    }
                });
                btn.title = icon.desc;
                btn.innerHTML = icon.value;
                g.appendChild(btn);
                if (!!alts) {
                    g.appendChild(alts);
                }
                g.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
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