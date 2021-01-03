import { Emoji } from "kudzu/emoji/Emoji";
import { TypedEvent } from "kudzu/events/EventBase";
import { FormDialog, FormDialogEvents } from "./FormDialog";
declare class EmojiSelectedEvent extends TypedEvent<"emojiSelected"> {
    emoji: Emoji;
    constructor(emoji: Emoji);
}
interface EmojiFormEvents extends FormDialogEvents {
    emojiCanceled: TypedEvent<"emojiCanceled">;
    emojiSelected: EmojiSelectedEvent;
}
export declare class EmojiForm extends FormDialog<EmojiFormEvents> {
    recent: HTMLParagraphElement;
    preview: HTMLElement;
    confirmButton: HTMLElement;
    selectAsync: () => Promise<Emoji>;
    constructor();
}
export {};
