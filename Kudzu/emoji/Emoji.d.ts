/**
 * Shorthand for `new Emoji`, which saves significantly on bundle size.
 * @param v - a Unicode sequence.
 * @param d - an English text description of the pictogram.
 * @param [o] - an optional set of properties to set on the Emoji object.
 */
export declare function e(v: string, d: string, o?: any): Emoji;
/**
 * Shorthand for `new Emoji`, which saves significantly on bundle size.
 * @param v - a Unicode sequence.
 * @param d - an English text description of the pictogram.
 * @param [o] - an optional set of properties to set on the Emoji object.
 */
export declare function E(v: string, d: string, o?: any): Emoji;
/**
 * Unicode-standardized pictograms.
 **/
export declare class Emoji {
    value: string;
    desc: string;
    props: any;
    /**
     * Creates a new Unicode-standardized pictograms.
     * @param value - a Unicode sequence.
     * @param desc - an English text description of the pictogram.
     * @param props - an optional set of properties to store with the emoji.
     */
    constructor(value: string, desc: string, props?: any);
    /**
     * Determines of the provided Emoji or EmojiGroup is a subset of
     * this emoji.
     */
    contains(e: Emoji | string): boolean;
}
