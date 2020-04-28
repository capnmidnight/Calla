import "./protos.js";
import {
    allIcons as icons,
    emojiStyle,
    textStyle
} from "./emoji.js";
import * as H from "./html.js";

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

        function combine(a, b) {
            let left = a.value;
            const idx = left.indexOf(emojiStyle.value);
            if (idx >= 0) {
                left = left.substring(0, idx);
            }
            return {
                value: left + b.value,
                desc: a.desc + "/" + b.desc
            };
        }

        const addIconsToContainer = (group, container, isAlts) => {
            for (let icon of group) {
                const g = isAlts ? H.ul() : H.span(),
                    btn = H.button({
                        type: "button",
                        title: icon.desc,
                        onclick: (evt) => {
                            selectedEmoji = selectedEmoji && evt.ctrlKey
                                ? combine(selectedEmoji, icon)
                                : icon;
                            emojiPreview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                            confirmEmojiButton.unlock();

                            if (!!alts) {
                                alts.toggleOpen();
                                btn.innerHTML = icon.value + (alts.isOpen() ? "-" : "+");
                            }
                        }
                    }, icon.value);

                let alts = null;

                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g.appendChild(H.li(
                        btn,
                        H.label({
                            htmlFor: btn.id
                        }, icon.desc)));
                }
                else {
                    g.appendChild(btn);
                }

                if (!!icon.alt) {
                    alts = H.div();
                    allAlts.push(alts);
                    addIconsToContainer(icon.alt, alts, true);
                    alts.hide();
                    g.appendChild(alts);
                    btn.style.width = "3em";
                    btn.innerHTML += "+";
                }

                if (!!icon.width) {
                    btn.style.width = icon.width;
                }

                if (!!icon.color) {
                    btn.style.color = icon.color;
                }

                container.appendChild(g);
            }
        };

        for (let key of Object.keys(icons)) {

            const header = H.h1(),
                container = H.p(),
                headerButton = H.a({
                    href: "javascript:undefined",
                    title: key,
                    onclick: () => {
                        container.toggleOpen();
                        headerButton.innerHTML = key + (container.isOpen() ? " -" : " +");
                    }
                }, key + " -"),
                group = icons[key];

            addIconsToContainer(group, container);
            header.appendChild(headerButton);
            emojiContainer.appendChild(header);
            emojiContainer.appendChild(container);
        }

        confirmEmojiButton.lock();
        emojiView.hide();

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
    }
}

class EmojiSelectedEvent extends Event {
    constructor(emoji) {
        super("emojiSelected");
        this.emoji = emoji;
    }
}