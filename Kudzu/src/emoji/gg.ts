import { Emoji } from "./Emoji";
import type { EmojiGroup } from "./EmojiGroup";
import { g } from "./EmojiGroup";

/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 */
export function gg(v: string, d: string, o: any, ...r: Emoji[]) {
    const emojis = Object.values(o)
        .filter(oo => oo instanceof Emoji)
        .map(oo => oo as Emoji)
        .concat(...r);
    return Object.assign(
        g(
            v,
            d,
            ...emojis),
        o) as EmojiGroup;
}
