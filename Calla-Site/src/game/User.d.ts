import { EventBase } from "../lib/calla";
export declare class User extends EventBase {
    /**
     *
     * @param {string} id
     * @param {string} displayName
     * @param {import("../calla").InterpolatedPose} pose
     * @param {boolean} isMe
     */
    constructor(id: any, displayName: any, pose: any, isMe: any);
    get x(): any;
    get y(): any;
    get gridX(): any;
    get gridY(): any;
    deserialize(evt: any): void;
    serialize(): {
        id: any;
        avatarMode: any;
        avatarID: any;
    };
    /**
     * An avatar using a live video.
     * @type {VideoAvatar}
     **/
    get avatarVideo(): any;
    /**
     * Set the current video element used as the avatar.
     * @param {MediaStream} stream
     **/
    setAvatarVideo(stream: any): void;
    /**
     * An avatar using a photo
     * @type {string}
     **/
    get avatarImage(): any;
    /**
     * Set the URL of the photo to use as an avatar.
     * @param {string} url
     */
    set avatarImage(url: any);
    /**
     * An avatar using a Unicode emoji.
     * @type {EmojiAvatar}
     **/
    get avatarEmoji(): any;
    /**
     * Set the emoji to use as an avatar.
     * @param {import("../emoji/Emoji").Emoji} emoji
     */
    set avatarEmoji(emoji: any);
    /**
     * Returns the type of avatar that is currently active.
     * @returns {AvatarMode}
     **/
    get avatarMode(): any;
    /**
     * Returns a serialized representation of the current avatar,
     * if such a representation exists.
     * @returns {string}
     **/
    get avatarID(): any;
    /**
     * Returns the current avatar
     * @returns {import("./avatars/BaseAvatar").BaseAvatar}
     **/
    get avatar(): any;
    addEventListener(evtName: any, func: any, opts: any): void;
    get displayName(): any;
    set displayName(name: any);
    moveTo(x: any, y: any): void;
    update(map: any, users: any): void;
    drawShadow(g: any, map: any): void;
    drawAvatar(g: any, map: any): void;
    innerDraw(g: any, map: any): void;
    drawName(g: any, map: any, fontSize: any): void;
    drawHearingTile(g: any, map: any, dx: any, dy: any, p: any): void;
    drawHearingRange(g: any, map: any, minDist: any, maxDist: any): void;
}
