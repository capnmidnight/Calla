import { InterpolatedPosition } from "./audio/positions/InterpolatedPosition.js";
import { AvatarMode, BaseAvatar } from "./avatars/BaseAvatar.js";
import { EmojiAvatar } from "./avatars/EmojiAvatar.js";
import { PhotoAvatar } from "./avatars/PhotoAvatar.js";
import { VideoAvatar } from "./avatars/VideoAvatar.js";
import { allPeople as people, bust, mutedSpeaker, speakerMediumVolume, videoCamera } from "./emoji/emoji.js";
import { isString, isNumber } from "./typeChecks.js";
import { project } from "./math.js";
import "./protos.js";

const POSITION_REQUEST_DEBOUNCE_TIME = 1,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames = ["userMoved", "userPositionNeeded"];

export class User extends EventTarget {
    constructor(evt, isMe) {
        super();

        this.id = evt.id;
        this.displayName = evt.displayName;
        this.label = isMe ? "(Me)" : `(${this.id})`;

        this.moveEvent = new UserMoveEvent(this.id);
        this.position = new InterpolatedPosition();

        /** @type {AvatarMode} */
        this.setAvatarVideo(null);
        this.setAvatarImage(null);
        this.setAvatarEmoji(isMe ? people.random() : bust);

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
        this.isInitialized = isMe;
        this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
        this.visible = true;
    }

    deserialize(evt) {
        if (evt.displayName) {
            this.displayName = evt.displayName;
        }

        switch (evt.avatarMode) {
            case AvatarMode.emoji:
                this.setAvatarEmoji(evt.avatarID);
                break;
            case AvatarMode.photo:
                this.setAvatarImage(evt.avatarID);
                break;
            default:
                break;
        }

        if (isNumber(evt.x)
            && isNumber(evt.y)) {
            this.position.setTarget(evt.x, evt.y, performance.now() / 1000, 0);
            this.isInitialized = true;
        }
    }

    serialize() {
        return {
            id: this.id,
            x: this.position._tx,
            y: this.position._ty,
            displayName: this.displayName,
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
     * @param {Video}
     **/
    setAvatarVideo(video) {
        if (video instanceof HTMLVideoElement) {
            this._avatarVideo = new VideoAvatar(video);
        }
        else {
            this._avatarVideo = null;
        }
    }

    /**
     * An avatar using a photo
     * @type {PhotoAvatar}
     **/
    get avatarImage() {
        return this._avatarImage;
    }

    /**
     * Set the URL of the photo to use as an avatar.
     * @param {string} url
     */
    setAvatarImage(url) {
        if (isString(url)) {
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
    setAvatarEmoji(emoji) {
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
        if (this.avatarVideo) {
            return AvatarMode.video;
        }
        else if (this.avatarPhoto) {
            return AvatarMode.photo;
        }
        else if (this.avatarEmoji) {
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
                return this.avatarImage.url;
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
                return this.avatarEmoji;
            case AvatarMode.photo:
                return this.avatarImage;
            case AvatarMode.video:
                return this.avatarVideo;
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

    setDisplayName(name) {
        this.displayName = name;
    }

    moveTo(x, y, dt) {
        if (this.isInitialized) {
            if (this.isMe) {
                this.moveEvent.set(x, y);
                this.dispatchEvent(this.moveEvent);
            }

            this.position.setTarget(x, y, performance.now() / 1000, dt);
        }
    }

    update(map, users) {
        const t = performance.now() / 1000;

        if (!this.isInitialized) {
            const dt = t - this.lastPositionRequestTime;
            if (dt >= POSITION_REQUEST_DEBOUNCE_TIME) {
                this.lastPositionRequestTime = t;
                this.dispatchEvent(new UserPositionNeededEvent(this.id));
            }
        }

        this.position.update(t);

        this.stackUserCount = 0;
        this.stackIndex = 0;
        for (let user of users.values()) {
            if (user.position._tx === this.position._tx
                && user.position._ty === this.position._ty) {
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

    drawShadow(g, map, cameraZ) {
        const x = this.position.x * map.tileWidth,
            y = this.position.y * map.tileHeight,
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
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

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
                    const height = this.stackAvatarHeight / 2;
                    g.font = height + "px sans-serif";
                    const metrics = g.measureText(speakerMediumVolume.value);
                    g.fillText(
                        speakerMediumVolume.value,
                        this.stackAvatarWidth - metrics.width,
                        0);
                }
            }
            g.restore();
        }
    }

    innerDraw(g, map) {
        g.translate(
            this.position.x * map.tileWidth + this.stackOffsetX,
            this.position.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";

        if (this.avatar) {
            this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight, this.isMe);
        }

        if (this.audioMuted || !this.videoMuted) {
            const height = this.stackAvatarHeight / 2;
            g.font = height + "px sans-serif";
            if (this.audioMuted) {
                const metrics = g.measureText(mutedSpeaker.value);
                g.fillText(
                    mutedSpeaker.value,
                    this.stackAvatarWidth - metrics.width,
                    0);
            }
            if (!this.videoMuted && !(this.avatar instanceof VideoAvatar)) {
                const metrics = g.measureText(videoCamera.value);
                g.fillText(
                    videoCamera.value,
                    this.stackAvatarWidth - metrics.width,
                    height);
            }
        }
    }

    drawName(g, map, cameraZ, fontSize) {
        if (this.visible) {
            g.save();
            {
                g.translate(
                    this.position.x * map.tileWidth + this.stackOffsetX,
                    this.position.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize * devicePixelRatio}pt sans-serif`;
                g.fillText(this.displayName || this.label, 0, 0);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.position._tx + dx) * map.tileWidth,
                (this.position._ty + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, cameraZ, minDist, maxDist) {
        const tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * cameraZ))),
            th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * cameraZ)));

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


class UserMoveEvent extends Event {
    constructor(id) {
        super("userMoved");
        this.id = id;
        this.x = 0;
        this.y = 0;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class UserPositionNeededEvent extends Event {
    constructor(id) {
        super("userPositionNeeded");
        this.id = id;
    }
}