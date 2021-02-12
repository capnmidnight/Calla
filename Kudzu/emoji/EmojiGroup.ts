import { Emoji } from "./Emoji";

/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 */
export function G(v: string, d: string, o: any, ...r: Emoji[]) {
    const emojis = Object.values(o)
        .filter(oo => oo instanceof Emoji)
        .map(oo => oo as Emoji)
        .concat(...r);
    return Object.assign(
        new EmojiGroup(
            v,
            d,
            ...emojis),
        o) as EmojiGroup;
}

export function C(a: any, b: any, altDesc: string | null = null): any {
    if (a instanceof Array) {
        return a.map(c => C(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = C(new Emoji(a.value, a.desc), b);
        return new EmojiGroup(value, desc, ...C(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => C(a, c));
    }
    else {
        return new Emoji(a.value + b.value, altDesc || (a.desc + ": " + b.desc));
    }
}

export function J(a: any, b: any, altDesc: string | null = null): any {
    if (a instanceof Array) {
        return a.map(c => J(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = J(new Emoji(a.value, a.desc), b);
        return new EmojiGroup(value, desc, ...J(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => J(a, c));
    }
    else {
        return new Emoji(a.value + "\u200D" + b.value, altDesc || (a.desc + ": " + b.desc));
    }
}

export class EmojiGroup extends Emoji {
    width: string | null = null;
    alts: (Emoji | EmojiGroup)[];

    /**
     * Groupings of Unicode-standardized pictograms.
     * @param value - a Unicode sequence.
     * @param desc - an English text description of the pictogram.
     * @param ...rest - Emojis in this group.
     */
    constructor(value: string, desc: string, ...alts: (Emoji | EmojiGroup)[]) {
        super(value, desc);

        this.alts = alts;
    }

    /**
     * Selects a random emoji out of the collection.
     **/
    random(): Emoji | null {
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

    contains(e: Emoji | string): boolean {
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