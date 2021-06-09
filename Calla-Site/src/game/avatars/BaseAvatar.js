import { createUtilityCanvas } from "kudzu/html/canvas";
export class BaseAvatarChangedEvent extends Event {
    mode;
    avatar;
    constructor(mode, avatar) {
        super(mode);
        this.mode = mode;
        this.avatar = avatar;
    }
}
/**
 * A base class for different types of avatars.
 **/
export class BaseAvatar {
    mode;
    canSwim;
    element;
    g;
    /**
     * Encapsulates a resource to use as an avatar.
     */
    constructor(mode, canSwim) {
        this.mode = mode;
        this.canSwim = canSwim;
        this.element = createUtilityCanvas(128, 128);
        this.g = this.element.getContext("2d");
    }
    /**
     * Render the avatar at a certain size.
     * @param g - the context to render to
     * @param width - the width the avatar should be rendered at
     * @param height - the height the avatar should be rendered at.
     * @param isMe - whether the avatar is the local user
     */
    draw(g, width, height, _isMe) {
        const aspectRatio = this.element.width / this.element.height, w = aspectRatio > 1 ? width : aspectRatio * height, h = aspectRatio > 1 ? width / aspectRatio : height, dx = (width - w) / 2, dy = (height - h) / 2;
        g.drawImage(this.element, dx, dy, w, h);
    }
}
//# sourceMappingURL=BaseAvatar.js.map