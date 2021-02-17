import type { InterpolatedPose } from "calla/audio/positions/InterpolatedPose";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { TextImage } from "kudzu/graphics2d/TextImage";
import type { Context2D } from "kudzu/html/canvas";
import { AvatarMode } from "./avatars/AvatarMode";
import { AvatarChangedEvent } from "./avatars/BaseAvatar";
import { EmojiAvatar } from "./avatars/EmojiAvatar";
import { PhotoAvatar } from "./avatars/PhotoAvatar";
import { VideoAvatar } from "./avatars/VideoAvatar";
import type { TileMap } from "./TileMap";
export declare class UserMovedEvent extends TypedEvent<"userMoved"> {
    id: string;
    x: number;
    y: number;
    constructor(id: string);
}
export declare class UserJoinedEvent extends TypedEvent<"userJoined"> {
    user: User;
    constructor(user: User);
}
interface UserEvents {
    userMoved: UserMovedEvent;
}
export declare class User extends TypedEventBase<UserEvents> {
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
    private userMovedEvt;
    constructor(id: string, displayName: string, pose: InterpolatedPose, isMe: boolean);
    get x(): number;
    get y(): number;
    get gridX(): number;
    get gridY(): number;
    setAvatar(evt: AvatarChangedEvent): void;
    serialize(): {
        id: string;
        avatarMode: AvatarMode;
        avatarID: string;
    };
    /**
     * An avatar using a live video.
     **/
    get avatarVideo(): VideoAvatar;
    /**
     * Set the current video element used as the avatar.
     **/
    setAvatarVideo(stream: MediaStream): void;
    /**
     * An avatar using a photo
     **/
    get avatarImage(): PhotoAvatar;
    /**
     * Set the URL of the photo to use as an avatar.
     */
    setAvatarImage(url: string): void;
    /**
     * An avatar using a Unicode emoji.
     **/
    get avatarEmoji(): EmojiAvatar;
    /**
     * Set the emoji to use as an avatar.
     */
    setAvatarEmoji(emoji: string): void;
    /**
     * Returns the type of avatar that is currently active.
     **/
    get avatarMode(): AvatarMode;
    /**
     * Returns a serialized representation of the current avatar,
     * if such a representation exists.
     **/
    get avatarID(): string;
    /**
     * Returns the current avatar
     **/
    get avatar(): VideoAvatar | EmojiAvatar | PhotoAvatar;
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
export {};
