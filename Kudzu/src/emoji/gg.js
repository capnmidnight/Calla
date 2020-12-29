import { Emoji } from "./Emoji";
import { g } from "./EmojiGroup";
/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 */
export function gg(v, d, o, ...r) {
    const emojis = Object.values(o)
        .filter(oo => oo instanceof Emoji)
        .map(oo => oo)
        .concat(...r);
    return Object.assign(g(v, d, ...emojis), o);
}
//# sourceMappingURL=gg.js.map