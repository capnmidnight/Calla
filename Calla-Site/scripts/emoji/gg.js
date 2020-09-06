import { Emoji } from "./Emoji";
import { g } from "./EmojiGroup";

/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {any} o - a set of properties to set on the Emoji object.
 * @param {...(Emoji|import("./EmojiGroup").EmojiGroup)} r - the emoji that are contained in this group.
 * @returns {import("./EmojiGroup").EmojiGroup}
 */
export function gg(v, d, o, ...r) {
    return Object.assign(
        g(
            v,
            d,
            ...Object
                .values(o)
                .filter(v => v instanceof Emoji),
            ...r),
        o);
}
