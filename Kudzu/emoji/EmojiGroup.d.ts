import { Emoji } from "./Emoji";
/**
 * Shorthand for `new EmojiGroup`, which saves significantly on bundle size.
 * @param v - a Unicode sequence.
 * @param d - an English text description of the pictogram.
 * @param r - the emoji that are contained in this group.
 */
export declare function g(v: string, d: string, ...r: (Emoji | EmojiGroup)[]): EmojiGroup;
/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 */
export declare function G(v: string, d: string, o: any, ...r: Emoji[]): EmojiGroup;
export declare function C(a: any, b: any, altDesc?: string | null): any;
export declare function J(a: any, b: any, altDesc?: string | null): any;
export declare class EmojiGroup extends Emoji {
    width: string | null;
    alts: (Emoji | EmojiGroup)[];
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param value - a Unicode sequence.
     * @param desc - an English text description of the pictogram.
     * @param ...rest - Emojis in this group.
     */
    constructor(value: string, desc: string, ...alts: (Emoji | EmojiGroup)[]);
    /**
     * Selects a random emoji out of the collection.
     **/
    random(): Emoji | null;
    contains(e: Emoji | string): boolean;
}
