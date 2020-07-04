import { BaseAvatar } from "./BaseAvatar.js";
import { isSurfer } from "../emoji/emoji.js";

const selfs = new Map();

export class EmojiAvatar extends BaseAvatar {
    constructor(emoji) {
        super();

        const self = {
            metrics: null,
            canSwim: isSurfer(emoji),
            height: 0
        }

        this.value = emoji.value;
        this.desc = emoji.desc;
        
        selfs.set(this, self);
    }

    get canSwim() {
        return selfs.get(this).canSwim;
    }

    update(stackAvatarHeight) {
        const self = selfs.get(this);
        if (stackAvatarHeight != self.height) {
            self.metrics = null;
            self.height = stackAvatarHeight;
        }
    }

    draw(g) {
        const self = selfs.get(this);
        g.font = 0.9 * self.height + "px sans-serif";
        if (!self.metrics) {
            self.metrics = g.measureText(this.value);
        }
        g.fillText(
            this.value,
            (self.metrics.width - self.height) / 2 + self.metrics.actualBoundingBoxLeft,
            self.metrics.actualBoundingBoxAscent);
    }
}