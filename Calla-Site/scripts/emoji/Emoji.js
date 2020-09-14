/**
 * Unicode-standardized pictograms.
 **/
export class Emoji {
    /**
     * Creates a new Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     */
    constructor(value, desc) {
        this.value = value;
        this.desc = desc;
    }

    /**
     * Determines of the provided Emoji or EmojiGroup is a subset of
     * this emoji.
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return this.value.indexOf(e.value) >= 0;
    }
}

/**
 * Shorthand for `new Emoji`, which saves significantly on bundle size.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {any} [o=null] - an optional set of properties to set on the Emoji object.
 * @returns {Emoji}
 */
export function e(v, d, o = null) {
    return Object.assign(new Emoji(v, d), o);
}