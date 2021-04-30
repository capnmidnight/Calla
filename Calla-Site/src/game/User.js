import { bustInSilhouette, mutedSpeaker, speakerMediumVolume } from "kudzu/emoji/emojis";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { getTransform } from "kudzu/graphics2d/getTransform";
import { TextImage } from "kudzu/graphics2d/TextImage";
import { project } from "kudzu/math/project";
import { assertNever, isString } from "kudzu/typeChecks";
import { AvatarMode } from "./avatars/AvatarMode";
import { EmojiAvatar } from "./avatars/EmojiAvatar";
import { PhotoAvatar } from "./avatars/PhotoAvatar";
import { VideoAvatar } from "./avatars/VideoAvatar";
export class UserMovedEvent extends TypedEvent {
    constructor(id) {
        super("userMoved");
        this.id = id;
        this.x = 0;
        this.y = 0;
    }
}
export class UserJoinedEvent extends TypedEvent {
    constructor(user) {
        super("userJoined");
        this.user = user;
    }
}
const POSITION_REQUEST_DEBOUNCE_TIME = 1, STACKED_USER_OFFSET_X = 5, STACKED_USER_OFFSET_Y = 5, muteAudioIcon = new TextImage(), speakerActivityIcon = new TextImage();
muteAudioIcon.fontFamily = "Noto Color Emoji";
muteAudioIcon.value = mutedSpeaker.value;
speakerActivityIcon.fontFamily = "Noto Color Emoji";
speakerActivityIcon.value = speakerMediumVolume.value;
export class User extends TypedEventBase {
    constructor(id, displayName, pose, isMe) {
        super();
        this.id = id;
        this.pose = pose;
        this.isMe = isMe;
        this.audioMuted = false;
        this.videoMuted = true;
        this.isActive = false;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.visible = true;
        this._displayName = null;
        this._avatarVideo = null;
        this._avatarImage = null;
        this._avatarEmoji = null;
        this.userMovedEvt = new UserMovedEvent(id);
        this.label = isMe ? "(Me)" : `(${this.id})`;
        this.setAvatarEmoji(bustInSilhouette.value);
        this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
        this.userNameText = new TextImage();
        this.userNameText.textFillColor = "white";
        this.userNameText.fontSize = 128;
        this.displayName = displayName;
        Object.seal(this);
    }
    get x() {
        return this.pose.current.p[0];
    }
    get y() {
        return this.pose.current.p[2];
    }
    get gridX() {
        return this.pose.end.p[0];
    }
    get gridY() {
        return this.pose.end.p[2];
    }
    setAvatar(evt) {
        switch (evt.mode) {
            case AvatarMode.Emoji:
                this.setAvatarEmoji(evt.avatar);
                break;
            case AvatarMode.Photo:
                this.setAvatarImage(evt.avatar);
                break;
            case AvatarMode.Video:
                this.setAvatarVideo(evt.avatar);
                break;
            default: assertNever(evt);
        }
    }
    serialize() {
        return {
            id: this.id,
            avatarMode: this.avatarMode,
            avatarID: this.avatarID
        };
    }
    /**
     * An avatar using a live video.
     **/
    get avatarVideo() {
        return this._avatarVideo;
    }
    /**
     * Set the current video element used as the avatar.
     **/
    setAvatarVideo(stream) {
        if (stream) {
            this._avatarVideo = new VideoAvatar(stream);
        }
        else {
            this._avatarVideo = null;
        }
    }
    /**
     * An avatar using a photo
     **/
    get avatarImage() {
        return this._avatarImage;
    }
    /**
     * Set the URL of the photo to use as an avatar.
     */
    setAvatarImage(url) {
        if (isString(url)
            && url.length > 0) {
            this._avatarImage = new PhotoAvatar(url);
        }
        else {
            this._avatarImage = null;
        }
    }
    /**
     * An avatar using a Unicode emoji.
     **/
    get avatarEmoji() {
        return this._avatarEmoji;
    }
    /**
     * Set the emoji to use as an avatar.
     */
    setAvatarEmoji(emoji) {
        if (emoji) {
            this._avatarEmoji = new EmojiAvatar(emoji);
        }
        else {
            this._avatarEmoji = null;
        }
    }
    /**
     * Returns the type of avatar that is currently active.
     **/
    get avatarMode() {
        if (this._avatarVideo) {
            return AvatarMode.Video;
        }
        else if (this._avatarImage) {
            return AvatarMode.Photo;
        }
        else if (this._avatarEmoji) {
            return AvatarMode.Emoji;
        }
        else {
            return AvatarMode.None;
        }
    }
    /**
     * Returns a serialized representation of the current avatar,
     * if such a representation exists.
     **/
    get avatarID() {
        switch (this.avatarMode) {
            case AvatarMode.Emoji:
                return this.avatarEmoji.value;
            case AvatarMode.Photo:
                return this.avatarImage.url;
            case AvatarMode.Video:
            case AvatarMode.None:
                return null;
            default: assertNever(this.avatarMode);
        }
    }
    /**
     * Returns the current avatar
     **/
    get avatar() {
        switch (this.avatarMode) {
            case AvatarMode.Emoji:
                return this._avatarEmoji;
            case AvatarMode.Photo:
                return this._avatarImage;
            case AvatarMode.Video:
                return this._avatarVideo;
            case AvatarMode.None:
                return null;
            default: assertNever(this.avatarMode);
        }
    }
    get displayName() {
        return this._displayName || this.label;
    }
    set displayName(name) {
        this._displayName = name;
        this.userNameText.value = this.displayName;
    }
    moveTo(x, y) {
        if (this.isMe) {
            this.userMovedEvt.x = x;
            this.userMovedEvt.y = y;
            this.dispatchEvent(this.userMovedEvt);
        }
    }
    update(map, users) {
        this.stackUserCount = 0;
        this.stackIndex = 0;
        for (let user of users.values()) {
            if (user.gridX === this.gridX
                && user.gridY === this.gridY) {
                if (user.id === this.id) {
                    this.stackIndex = this.stackUserCount;
                }
                ++this.stackUserCount;
            }
        }
        this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
        this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
        this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
        this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
    }
    drawShadow(g, map) {
        const scale = getTransform(g).a, x = this.x * map.tileWidth, y = this.y * map.tileHeight, t = getTransform(g), p = t.transformPoint({ x, y });
        this.visible = -map.tileWidth <= p.x
            && p.x < g.canvas.width
            && -map.tileHeight <= p.y
            && p.y < g.canvas.height;
        if (this.visible) {
            g.save();
            {
                g.shadowColor = "rgba(0, 0, 0, 0.5)";
                g.shadowOffsetX = 3 * scale;
                g.shadowOffsetY = 3 * scale;
                g.shadowBlur = 3 * scale;
                this.innerDraw(g, map);
            }
            g.restore();
        }
    }
    drawAvatar(g, map) {
        if (this.visible) {
            g.save();
            {
                this.innerDraw(g, map);
                if (this.isActive && !this.audioMuted) {
                    const height = this.stackAvatarHeight / 2, scale = getTransform(g).a;
                    speakerActivityIcon.fontSize = height;
                    speakerActivityIcon.scale = scale;
                    speakerActivityIcon.draw(g, this.stackAvatarWidth - speakerActivityIcon.width, 0);
                }
            }
            g.restore();
        }
    }
    innerDraw(g, map) {
        g.translate(this.x * map.tileWidth + this.stackOffsetX, this.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";
        if (this.avatar) {
            this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight, this.isMe);
        }
        if (this.audioMuted || !this.videoMuted) {
            const height = this.stackAvatarHeight / 2, scale = getTransform(g).a;
            if (this.audioMuted) {
                muteAudioIcon.fontSize = height;
                muteAudioIcon.scale = scale;
                muteAudioIcon.draw(g, this.stackAvatarWidth - muteAudioIcon.width, 0);
            }
        }
    }
    drawName(g, map, fontSize) {
        if (this.visible) {
            const scale = getTransform(g).a;
            g.save();
            {
                g.translate(this.x * map.tileWidth + this.stackOffsetX, this.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * scale;
                g.shadowOffsetY = 3 * scale;
                g.shadowBlur = 3 * scale;
                const textScale = fontSize / this.userNameText.fontSize;
                g.scale(textScale, textScale);
                this.userNameText.draw(g, 0, -this.userNameText.height);
            }
            g.restore();
        }
    }
    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate((this.gridX + dx) * map.tileWidth, (this.gridY + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }
    drawHearingRange(g, map, minDist, maxDist) {
        const scale = getTransform(g).a, tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * scale))), th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * scale)));
        for (let dy = 0; dy < th; ++dy) {
            for (let dx = 0; dx < tw; ++dx) {
                const dist = Math.sqrt(dx * dx + dy * dy), p = project(dist, minDist, maxDist);
                if (p <= 1) {
                    this.drawHearingTile(g, map, dx, dy, p);
                    if (dy != 0) {
                        this.drawHearingTile(g, map, dx, -dy, p);
                    }
                    if (dx != 0) {
                        this.drawHearingTile(g, map, -dx, dy, p);
                    }
                    if (dx != 0 && dy != 0) {
                        this.drawHearingTile(g, map, -dx, -dy, p);
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=User.js.map