import { className, disabled, href, htmlFor, title } from "../../html/attrs.js";
import { onClick } from "../../html/evts.js";
import { gridPos } from "../../html/grid.js";
import { hide, isOpen, show, toggleOpen } from "../../html/ops.js";
import { A, Button, Div, H1, H2, Label, LI, P, Span, UL } from "../../html/tags.js";
import { EmojiGroup } from "../emoji/EmojiGroup.js";
import { allIcons as icons, emojiStyle, textStyle } from "../emoji/emojis.js";
import { FormDialog } from "./FormDialog.js";

const disabler = disabled(true),
    enabler = disabled(false);

const cancelEvt = new Event("emojiCanceled");

export class EmojiForm extends FormDialog {
    constructor() {
        super("emoji");

        this.header.append(
            H2("Recent"),
            this.recent = P("(None)"));

        const previousEmoji = [],
            allAlts = [];

        let selectedEmoji = null,
            idCounter = 0;

        const closeAll = () => {
            for (let alt of allAlts) {
                hide(alt);
            }
        }

        function combine(a, b) {
            let left = a.value;

            let idx = left.indexOf(emojiStyle.value);
            if (idx === -1) {
                idx = left.indexOf(textStyle.value);
            }
            if (idx >= 0) {
                left = left.substring(0, idx);
            }

            return {
                value: left + b.value,
                desc: a.desc + "/" + b.desc
            };
        }

        /**
         * 
         * @param {EmojiGroup} group
         * @param {HTMLElement} container
         * @param {boolean} isAlts
         */
        const addIconsToContainer = (group, container, isAlts) => {
            const alts = group.alts || group;
            for (let icon of alts) {
                const btn = Button(
                    title(icon.desc),
                    onClick((evt) => {
                        selectedEmoji = selectedEmoji && evt.ctrlKey
                            ? combine(selectedEmoji, icon)
                            : icon;
                        this.preview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                        enabler.apply(this.confirmButton);

                        if (alts) {
                            toggleOpen(alts);
                            btn.innerHTML = icon.value + (isOpen(alts) ? "-" : "+");
                        }
                    }), icon.value);

                let alts = null;

                /** @type {HTMLUListElement|HTMLSpanElement} */
                let g = null;

                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g = UL(
                        LI(btn,
                            Label(htmlFor(btn.id),
                                icon.desc)));
                }
                else {
                    g = Span(btn)
                }

                if (icon.alts) {
                    alts = Div();
                    allAlts.push(alts);
                    addIconsToContainer(icon, alts, true);
                    hide(alts);
                    g.appendChild(alts);
                    btn.style.width = "3em";
                    btn.innerHTML += "+";
                }

                if (icon.width) {
                    btn.style.width = icon.width;
                }

                if (icon.color) {
                    btn.style.color = icon.color;
                }

                container.appendChild(g);
            }
        };

        for (let group of Object.values(icons)) {
            if (group instanceof EmojiGroup) {
                const header = H1(),
                    container = P(),
                    headerButton = A(
                        href("javascript:undefined"),
                        title(group.desc),
                        onClick(() => {
                            toggleOpen(container);
                            headerButton.innerHTML = group.value + (isOpen(container) ? " -" : " +");
                        }),
                        group.value + " -");

                addIconsToContainer(group, container);
                header.appendChild(headerButton);
                this.content.appendChild(header);
                this.content.appendChild(container);
            }
        }

        this.footer.append(

            this.confirmButton = Button(className("confirm"),
                "OK",
                onClick(() => {
                    const idx = previousEmoji.indexOf(selectedEmoji);
                    if (idx === -1) {
                        previousEmoji.push(selectedEmoji);
                        this.recent.innerHTML = "";
                        addIconsToContainer(previousEmoji, this.recent);
                    }

                    this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
                    hide(this);
                })),

            Button(className("cancel"),
                "Cancel",
                onClick(() => {
                    disabler.apply(this.confirmButton);
                    this.dispatchEvent(cancelEvt);
                    hide(this);
                })),

            this.preview = Span(gridPos(1, 4, 3, 1)));

        disabler.apply(this.confirmButton)

        this.selectAsync = () => {
            return new Promise((resolve, reject) => {
                let yes = null,
                    no = null;

                const done = () => {
                    this.removeEventListener("emojiSelected", yes);
                    this.removeEventListener("emojiCanceled", no);
                    this.removeEventListener("hidden", no);
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
                this.addEventListener("hidden", no);

                closeAll();
                show(this);
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