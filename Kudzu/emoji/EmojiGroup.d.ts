import { Emoji } from "./Emoji";
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
