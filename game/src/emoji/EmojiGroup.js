import { arrayRandom } from "../../lib/Calla.js";
import { Emoji } from "./Emoji.js";

export class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     * @param {Emoji[]} rest - Emojis in this group.
     */
    constructor(value, desc, ...rest) {
        super(value, desc);
        /** @type {Emoji[]} */
        this.alts = rest;
        /** @type {string} */
        this.width = null;
    }

    /**
     * Selects a random emoji out of the collection.
     * @returns {(Emoji|EmojiGroup)}
     **/
    random() {
        const selection = arrayRandom(this.alts);
        if (selection instanceof EmojiGroup) {
            return selection.random();
        }
        else {
            return selection;
        }
    }

    /**
     *
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return super.contains(e)
            || this.alts.reduce((a, b) => a || b.contains(e), false);
    }
}


/**
 * Shorthand for `new EmojiGroup`, which saves significantly on bundle size.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {...(Emoji|EmojiGroup)} r - the emoji that are contained in this group.
 * @returns {EmojiGroup}
 */
export function g(v, d, ...r) {
    return new EmojiGroup(v, d, ...r);
}