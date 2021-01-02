import type { InterpolatedPose } from "calla/audio/positions/InterpolatedPose";
import type { Emoji } from "kudzu/emoji/Emoji";
import { EventBase } from "kudzu/events/EventBase";
import { TextImage } from "kudzu/graphics2d/TextImage";
import type { Context2D } from "kudzu/html/canvas";
import { EmojiAvatar } from "./avatars/EmojiAvatar";
import { PhotoAvatar } from "./avatars/PhotoAvatar";
import { VideoAvatar } from "./avatars/VideoAvatar";
import type { TileMap } from "./TileMap";
export declare class User extends EventBase {
    id: string;
    private pose;
    isMe: boolean;
    label: string;
    audioMuted: boolean;
    videoMuted: boolean;
    isActive: boolean;
    stackUserCount: number;
    stackIndex: number;
    stackAvatarHeight: number;
    stackAvatarWidth: number;
    stackOffsetX: number;
    stackOffsetY: number;
    lastPositionRequestTime: number;
    visible: boolean;
    userNameText: TextImage;
    private _displayName;
    private _avatarVideo;
    private _avatarImage;
    private _avatarEmoji;
    constructor(id: string, displayName: string, pose: InterpolatedPose, isMe: boolean);
    get x(): number;
    get y(): number;
    get gridX(): number;
    get gridY(): number;
    deserialize(evt: any): void;
    serialize(): {
        id: string;
        avatarMode: any;
        avatarID: string | {
            value: string;
            desc: string;
        };
    };
    /**
     * An avatar using a live video.
     * @type {VideoAvatar}
     **/
    get avatarVideo(): VideoAvatar;
    /**
     * Set the current video element used as the avatar.
     * @param stream
     **/
    setAvatarVideo(stream: MediaStream): void;
    /**
     * An avatar using a photo
     * @type {string}
     **/
    get avatarImage(): string;
    /**
     * Set the URL of the photo to use as an avatar.
     * @param {string} url
     */
    set avatarImage(url: string);
    /**
     * An avatar using a Unicode emoji.
     **/
    get avatarEmoji(): EmojiAvatar;
    /**
     * Set the emoji to use as an avatar.
     */
    setAvatarEmoji(emoji: Emoji): void;
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
    get avatarID(): string | {
        value: string;
        desc: string;
    };
    /**
     * Returns the current avatar
     * @returns {import("./avatars/BaseAvatar").BaseAvatar}
     **/
    get avatar(): EmojiAvatar | PhotoAvatar | VideoAvatar;
    addEventListener(evtName: string, func: (evt: Event) => any, opts: AddEventListenerOptions): void;
    get displayName(): string;
    set displayName(name: string);
    moveTo(x: number, y: number): void;
    update(map: TileMap, users: Map<string, User>): void;
    drawShadow(g: Context2D, map: TileMap): void;
    drawAvatar(g: Context2D, map: TileMap): void;
    innerDraw(g: Context2D, map: TileMap): void;
    drawName(g: Context2D, map: TileMap, fontSize: number): void;
    drawHearingTile(g: Context2D, map: TileMap, dx: number, dy: number, p: number): void;
    drawHearingRange(g: Context2D, map: TileMap, minDist: number, maxDist: number): void;
}
