import { Emoji } from "kudzu/emoji/Emoji";
import { EmojiGroup } from "kudzu/emoji/EmojiGroup";
import { emojiStyle, textStyle } from "kudzu/emoji/emojis";
import { allIcons as icons } from "kudzu/emoji/allIcons";
import { TypedEvent } from "kudzu/events/EventBase";
import { className, disabled, href, htmlFor, title } from "kudzu/html/attrs";
import { onClick } from "kudzu/html/evts";
import { gridPos } from "kudzu/html/grid";
import { A, Button, Div, H1, H2, Label, LI, P, Span, UL } from "kudzu/html/tags";
import { isArray } from "kudzu/typeChecks";
import { FormDialog } from "./FormDialog";
import { hide, isOpen, show, toggleOpen } from "./ops";
const disabler = disabled(true), enabler = disabled(false);
class EmojiSelectedEvent extends TypedEvent {
    emoji;
    constructor(emoji) {
        super("emojiSelected");
        this.emoji = emoji;
    }
}
const cancelEvt = new TypedEvent("emojiCanceled");
export class EmojiForm extends FormDialog {
    recent;
    preview;
    confirmButton;
    selectAsync;
    constructor() {
        super("emoji", "Emoji");
        this.element.classList.add("dialog-3");
        const header = Div(className("header"), H2("Recent"), this.recent = P("(None)"));
        this.content.insertAdjacentElement("beforebegin", header);
        const previousEmoji = new Array(), allAlts = new Array();
        let selectedEmoji = null, idCounter = 0;
        const closeAll = () => {
            for (let alt of allAlts) {
                hide(alt);
            }
        };
        function combine(a, b) {
            let left = a.value;
            let idx = left.indexOf(emojiStyle.value);
            if (idx === -1) {
                idx = left.indexOf(textStyle.value);
            }
            if (idx >= 0) {
                left = left.substring(0, idx);
            }
            return new Emoji(left + b.value, a.desc + "/" + b.desc);
        }
        /**
         *
         * @param {EmojiGroup} group
         * @param {HTMLElement} container
         * @param {boolean} isAlts
         */
        const addIconsToContainer = (group, container, isAlts) => {
            const alts = isArray(group) && group
                || !isArray(group) && group.alts;
            for (let icon of alts) {
                let subAlts = null;
                const btn = Button(title(icon.desc), onClick((_evt) => {
                    const evt = _evt;
                    selectedEmoji = selectedEmoji && evt.ctrlKey
                        ? combine(selectedEmoji, icon)
                        : icon;
                    this.preview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                    enabler.apply(this.confirmButton);
                    if (subAlts) {
                        toggleOpen(subAlts);
                        btn.innerHTML = icon.value + (isOpen(subAlts) ? "-" : "+");
                    }
                }), icon.value);
                /** @type {HTMLUListElement|HTMLSpanElement} */
                let g = null;
                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g = UL(LI(btn, Label(htmlFor(btn.id), icon.desc)));
                }
                else {
                    g = Span(btn);
                }
                if (icon.alts) {
                    subAlts = Div();
                    allAlts.push(subAlts);
                    addIconsToContainer(icon, subAlts, true);
                    hide(subAlts);
                    g.appendChild(subAlts);
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
                const header = H1(), container = P(), headerButton = A(href("javascript:undefined"), title(group.desc), onClick(() => {
                    toggleOpen(container);
                    headerButton.innerHTML = group.value + (isOpen(container) ? " -" : " +");
                }), group.value + " -");
                addIconsToContainer(group, container, false);
                header.appendChild(headerButton);
                this.content.appendChild(header);
                this.content.appendChild(container);
            }
        }
        this.element.append(Div(this.confirmButton = Button(className("confirm"), "OK", onClick(() => {
            const idx = previousEmoji.indexOf(selectedEmoji);
            if (idx === -1) {
                previousEmoji.push(selectedEmoji);
                this.recent.innerHTML = "";
                addIconsToContainer(previousEmoji, this.recent, false);
            }
            this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
            hide(this);
        })), Button(className("cancel"), "Cancel", onClick(() => {
            disabler.apply(this.confirmButton);
            this.dispatchEvent(cancelEvt);
            hide(this);
        })), this.preview = Span(gridPos(1, 4, 3, 1))));
        disabler.apply(this.confirmButton);
        this.selectAsync = () => {
            return new Promise((resolve, reject) => {
                let yes = null, no = null;
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
//# sourceMappingURL=EmojiForm.js.map