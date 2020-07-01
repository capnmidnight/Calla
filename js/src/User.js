import { bust, mutedSpeaker, randomPerson, speakerMediumVolume, videoCamera } from "./emoji/emoji.js";
import { height, width } from "./html/attrs.js";
import { Canvas } from "./html/tags.js";
import { project } from "./math.js";
import "./protos.js";

const POSITION_REQUEST_DEBOUNCE_TIME = 1000,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    MOVE_TRANSITION_TIME = 0.5,
    eventNames = ["userMoved", "userPositionNeeded"];

export class User extends EventTarget {
    constructor(id, displayName, isMe) {
        super();

        this.id = id;

        this.x = 0;
        this.y = 0;
        this.avatarEmoji = (isMe ? randomPerson() : bust);

        this.displayName = displayName || id;
        this.audioMuted = false;
        this.videoMuted = true;
        this.sx = 0;
        this.sy = 0;
        this.tx = 0;
        this.ty = 0;
        this.dx = 0;
        this.dy = 0;
        this.dist = 0;
        this.t = 0;
        this.distXToMe = 0;
        this.distYToMe = 0;
        this.isMe = isMe;
        this.isActive = false;
        this.avatarImage = null;
        this.avatarURL = null;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.isInitialized = isMe;
        this.lastPositionRequestTime = Date.now() - POSITION_REQUEST_DEBOUNCE_TIME;
        this.moveEvent = new UserMoveEvent(this.id);
        this.visible = true;
    }

    init(evt) {
        this.sx
            = this.tx
            = this.x
            = evt.x;
        this.sy
            = this.ty
            = this.y
            = evt.y;
        this.displayName = evt.displayName;
        this.avatarURL = evt.avatarURL;
        if (!this.avatarURL && !!this.avatarImage) {
            this.avatarImage = null;
        }

        this.avatarEmoji = evt._avatarEmoji;
        this.isInitialized = true;
    }

    get avatarEmoji() {
        return this._avatarEmoji;
    }

    set avatarEmoji(emoji) {
        this._avatarEmoji = emoji;
        this.avatarEmojiMetrics = null;
        if (!!emoji) {
            this.setAvatarURL("");
        }
    }


    addEventListener(evtName, func, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
    }

    setAvatarURL(url) {
        if (url !== null
            && url !== undefined) {

            if (url.length === 0) {
                this.avatarURL = null;
                this.avatarImage = null;
            }
            else {
                this.avatarURL = url;
                const img = new Image();
                img.addEventListener("load", (evt) => {
                    this.avatarImage = Canvas(
                        width(img.width),
                        height(img.height));
                    const g = this.avatarImage.getContext("2d");
                    g.clearRect(0, 0, img.width, img.height);
                    g.imageSmoothingEnabled = false;
                    g.drawImage(img, 0, 0);
                });
                img.src = url;
            }
        }
    }

    setDisplayName(name) {
        this.displayName = name || this.id;
    }

    moveTo(x, y) {
        if (this.isMe) {
            if (x !== this.tx
                || y !== this.ty) {
                this.moveEvent.set(x, y);
                this.dispatchEvent(this.moveEvent);
            }
        }
        else if (!this.isInitialized) {
            this.isInitialized = true;
            this.x = x;
            this.y = y;
        }

        this.sx = this.x;
        this.sy = this.y;
        this.tx = x;
        this.ty = y;

        if (this.tx !== this.sx
            || this.ty !== this.sy) {
            this.dx = this.tx - this.sx;
            this.dy = this.ty - this.sy;
            this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this.t = 0;
        }
    }

    update(dt, map, userList) {
        if (this.isInitialized) {
            if (this.dist > 0) {
                this.t += dt;
                if (this.t >= MOVE_TRANSITION_TIME) {
                    this.x = this.sx = this.tx;
                    this.y = this.sy = this.ty;
                    this.t = this.dx = this.dy = this.dist = 0;
                }
                else {
                    const p = this.t / MOVE_TRANSITION_TIME,
                        s = Math.sin(Math.PI * p / 2);
                    this.x = this.sx + s * this.dx;
                    this.y = this.sy + s * this.dy;
                }
            }

            this.stackUserCount = 0;
            this.stackIndex = 0;
            for (let user of userList) {
                if (user.isInitialized
                    && user.tx === this.tx
                    && user.ty === this.ty) {
                    if (user.id === this.id) {
                        this.stackIndex = this.stackUserCount;
                    }
                    ++this.stackUserCount;
                }
            }

            this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
            const oldHeight = this.stackAvatarHeight;
            this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
            if (this.stackAvatarHeight != oldHeight) {
                this.avatarEmojiMetrics = null;
            }
            this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
            this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
        }
        else {
            const now = Date.now(),
                dt = now - this.lastPositionRequestTime;
            if (dt >= POSITION_REQUEST_DEBOUNCE_TIME) {
                this.lastPositionRequestTime = now;
                this.dispatchEvent(new UserPositionNeededEvent(this.id));
            }
        }
    }

    drawShadow(g, map, cameraZ) {
        const x = this.x * map.tileWidth,
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
            this.x * map.tileWidth + this.stackOffsetX,
            this.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";
        if (this.avatarImage) {
            g.drawImage(
                this.avatarImage,
                0, 0,
                this.stackAvatarWidth,
                this.stackAvatarHeight);
        }
        else if(this.avatarEmoji) {
            g.font = 0.9 * this.stackAvatarHeight + "px sans-serif";
            if (!this.avatarEmojiMetrics) {
                this.avatarEmojiMetrics = g.measureText(this.avatarEmoji.value);
            }
            g.fillText(
                this.avatarEmoji.value,
                (this.avatarEmojiMetrics.width - this.stackAvatarWidth) / 2 + this.avatarEmojiMetrics.actualBoundingBoxLeft,
                this.avatarEmojiMetrics.actualBoundingBoxAscent);
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
            if (!this.videoMuted) {
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
                    this.x * map.tileWidth + this.stackOffsetX,
                    this.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize * devicePixelRatio}pt sans-serif`;
                g.fillText(this.displayName, 0, 0);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.tx + dx) * map.tileWidth,
                (this.ty + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, cameraZ, minDist, maxDist) {
        if (this.isInitialized) {
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