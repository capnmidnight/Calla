import { Pose } from "./audio/positions/Pose.js";
import { AvatarMode, BaseAvatar } from "./avatars/BaseAvatar.js";
import { EmojiAvatar } from "./avatars/EmojiAvatar.js";
import { PhotoAvatar } from "./avatars/PhotoAvatar.js";
import { VideoAvatar } from "./avatars/VideoAvatar.js";
import { bust, mutedSpeaker, speakerMediumVolume } from "./emoji/emojis.js";
import { TextImage } from "./graphics/TextImage.js";
import { project } from "./math.js";
import "./protos/index.js";
import { isString } from "./typeChecks.js";

const POSITION_REQUEST_DEBOUNCE_TIME = 1,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames = ["userMoved", "userPositionNeeded"],
    muteAudioIcon = new TextImage("sans-serif"),
    speakerActivityIcon = new TextImage("sans-serif");

muteAudioIcon.value = mutedSpeaker.value;
speakerActivityIcon.value = speakerMediumVolume.value;

export class User extends EventTarget {
    /**
     * 
     * @param {string} id
     * @param {string} displayName
     * @param {Pose} pose
     * @param {boolean} isMe
     */
    constructor(id, displayName, pose, isMe) {
        super();

        this.id = id;
        this.pose = pose;
        this.label = isMe ? "(Me)" : `(${this.id})`;

        /** @type {AvatarMode} */
        this.setAvatarVideo(null);
        this.avatarImage = null;
        this.avatarEmoji = bust;

        this.audioMuted = false;
        this.videoMuted = true;
        this.isMe = isMe;
        this.isActive = false;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
        this.visible = true;
        this.userNameText = new TextImage("sans-serif");
        this.userNameText.color = "white";
        this.userNameText.fontSize = 128;
        this._displayName = null;
        this.displayName = displayName;
        Object.seal(this);
    }

    get x() {
        return this.pose.current.p.x;
    }

    get y() {
        return this.pose.current.p.z;
    }

    get gridX() {
        return this.pose.end.p.x;
    }

    get gridY() {
        return this.pose.end.p.z;
    }

    deserialize(evt) {
        switch (evt.avatarMode) {
            case AvatarMode.emoji:
                this.avatarEmoji = evt.avatarID;
                break;
            case AvatarMode.photo:
                this.avatarImage = evt.avatarID;
                break;
            default:
                break;
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
     * @type {PhotoAvatar}
     **/
    get avatarVideo() {
        return this._avatarVideo;
    }

    /**
     * Set the current video element used as the avatar.
     * @param {MediaStream} stream
     **/
    setAvatarVideo(stream) {
        if (stream instanceof MediaStream) {
            this._avatarVideo = new VideoAvatar(stream);
        }
        else {
            this._avatarVideo = null;
        }
    }

    /**
     * An avatar using a photo
     * @type {string}
     **/
    get avatarImage() {
        return this._avatarImage
            && this._avatarImage.url
            || null;
    }

    /**
     * Set the URL of the photo to use as an avatar.
     * @param {string} url
     */
    set avatarImage(url) {
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
     * @type {EmojiAvatar}
     **/
    get avatarEmoji() {
        return this._avatarEmoji;
    }

    /**
     * Set the emoji to use as an avatar.
     * @param {Emoji} emoji
     */
    set avatarEmoji(emoji) {
        if (emoji
            && emoji.value
            && emoji.desc) {
            this._avatarEmoji = new EmojiAvatar(emoji);
        }
        else {
            this._avatarEmoji = null;
        }
    }

    /**
     * Returns the type of avatar that is currently active.
     * @returns {AvatarMode}
     **/
    get avatarMode() {
        if (this._avatarVideo) {
            return AvatarMode.video;
        }
        else if (this._avatarImage) {
            return AvatarMode.photo;
        }
        else if (this._avatarEmoji) {
            return AvatarMode.emoji;
        }
        else {
            return AvatarMode.none;
        }
    }

    /**
     * Returns a serialized representation of the current avatar,
     * if such a representation exists.
     * @returns {string}
     **/
    get avatarID() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return { value: this.avatarEmoji.value, desc: this.avatarEmoji.desc };
            case AvatarMode.photo:
                return this.avatarImage;
            default:
                return null;
        }
    }

    /**
     * Returns the current avatar
     * @returns {BaseAvatar}
     **/
    get avatar() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return this._avatarEmoji;
            case AvatarMode.photo:
                return this._avatarImage;
            case AvatarMode.video:
                return this._avatarVideo;
            default:
                return null;
        }
    }

    addEventListener(evtName, func, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
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
            this.moveEvent.x = x;
            this.moveEvent.y = y;
            this.dispatchEvent(this.moveEvent);
        }
    }

    update(map, users) {
        const t = performance.now() / 1000;

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
        const scale = g.getTransform().a,
            x = this.x * map.tileWidth,
            y = this.y * map.tileHeight,
            t = g.getTransform(),
            p = t.transformPoint({ x, y });

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
                    const height = this.stackAvatarHeight / 2,
                        scale = g.getTransform().a;
                    speakerActivityIcon.fontSize = height;
                    speakerActivityIcon.scale = scale;
                    speakerActivityIcon.draw(g, this.stackAvatarWidth - speakerActivityIcon.width, 0);
                }
            }
            g.restore();
        }
    }

    innerDraw(g, map) {
        g.translate(
            this.x * map.tileWidth + this.stackOffsetX,
            this.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";

        if (this.avatar) {
            this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight, this.isMe);
        }

        if (this.audioMuted || !this.videoMuted) {

            const height = this.stackAvatarHeight / 2,
                scale = g.getTransform().a;

            if (this.audioMuted) {
                muteAudioIcon.fontSize = height;
                muteAudioIcon.scale = scale;
                muteAudioIcon.draw(g, this.stackAvatarWidth - muteAudioIcon.width, 0);
            }
        }
    }

    drawName(g, map, fontSize) {
        if (this.visible) {
            const scale = g.getTransform().a;
            g.save();
            {
                g.translate(
                    this.x * map.tileWidth + this.stackOffsetX,
                    this.y * map.tileHeight + this.stackOffsetY);
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
            g.translate(
                (this.gridX + dx) * map.tileWidth,
                (this.gridY + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, minDist, maxDist) {
        const scale = g.getTransform().a,
            tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * scale))),
            th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * scale)));

        for (let dy = 0; dy < th; ++dy) {
            for (let dx = 0; dx < tw; ++dx) {
                const dist = Math.sqrt(dx * dx + dy * dy),
                    p = project(dist, minDist, maxDist);
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