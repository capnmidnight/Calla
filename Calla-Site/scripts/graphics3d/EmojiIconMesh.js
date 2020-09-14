import { FrontSide } from "three/src/constants";
import { TextMesh } from "./TextMesh";

export class EmojiIconMesh extends TextMesh {
    /**
     * @param {string} name
     * @param {import("../emoji/Emoji").Emoji} emoji
     */
    constructor(name, emoji) {
        super(name, {
            lit: false,
            side: FrontSide
        });

        if (emoji) {
            this.textBgColor = "transparent";
            this.textColor = "#000000";
            this.fontFamily = "Segoe UI Emoji";
            this.fontSize = 100;

            this.value = emoji;
        }
    }
}
