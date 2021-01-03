import { Emoji } from "./Emoji";
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
