import { Emoji } from "./Emoji";
export class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param value - a Unicode sequence.
     * @param desc - an English text description of the pictogram.
     * @param ...rest - Emojis in this group.
     */
    constructor(value, desc, ...alts) {
        super(value, desc);
        this.width = null;
        this.alts = alts;
    }
    /**
     * Selects a random emoji out of the collection.
     **/
    random() {
        const idx = Math.floor(Math.random() * this.alts.length);
        if (idx < 0) {
            return null;
        }
        const selection = this.alts[idx];
        if (selection instanceof EmojiGroup) {
            return selection.random();
        }
        else {
            return selection;
        }
    }
    contains(e) {
        if (super.contains(e)) {
            return true;
        }
        else {
            for (const alt of this.alts) {
                if (alt.contains(e)) {
                    return true;
                }
            }
            return false;
        }
    }
}
/**
 * Shorthand for `new EmojiGroup`, which saves significantly on bundle size.
 * @param v - a Unicode sequence.
 * @param d - an English text description of the pictogram.
 * @param r - the emoji that are contained in this group.
 */
export function g(v, d, ...r) {
    return new EmojiGroup(v, d, ...r);
}
//# sourceMappingURL=EmojiGroup.js.map