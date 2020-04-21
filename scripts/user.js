import "./protos.js";
import { clamp, project } from "./math.js";
import { mutedSpeaker, videoCamera, randomPerson, bust } from "./emoji.js";

const POSITION_REQUEST_DEBOUNCE_TIME = 1000,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames = ["moveTo", "userInitRequest", "changeUserVolume"];

export class User extends EventTarget {
    constructor(id, displayName, isMe) {
        super();

        this.id = id;

        this.x = 0;
        this.y = 0;
        this.avatarEmoji = (isMe ? randomPerson() : bust).value;
        this.avatarEmojiMetrics = null;

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
        this.volumeChangedEvents = {};
        this.visible = true;
    }

    init(evt) {
        this.x = evt.x;
        this.y = evt.y;
        this.displayName = evt.displayName;
        this.avatarEmoji = evt.avatarEmoji;
        this.avatarEmojiMetrics = null;
        this.isInitialized = true;
    }

    addEventListener(evtName, func) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func);
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
                    this.avatarImage = document.createElement("canvas");
                    this.avatarImage.width = img.width;
                    this.avatarImage.height = img.height;
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

    readUser(user, audioDistMin, audioDistMax) {
        if (this.isMe && !user.isMe) {
            const distX = user.tx - this.tx,
                distY = user.ty - this.ty,
                dist = Math.sqrt(distX * distX + distY * distY),
                distPrev = Math.sqrt(user.distXToMe * user.distXToMe + user.distYToMe * user.distYToMe),
                distCl = clamp(dist, audioDistMin, audioDistMax),
                moved = distX !== user.distXToMe || distY !== user.distYToMe,
                audible = dist < audioDistMax,
                audiblePrev = distPrev < audioDistMax;

            if (moved && (audiblePrev || audible)) {
                user.distXToMe = distX;
                user.distYToMe = distY;

                if (!this.volumeChangedEvents[user.id]) {
                    this.volumeChangedEvents[user.id] = new UserVolumeChangedEvent(user.id);
                }

                const volume = 1 - Math.sqrt(project(distCl, audioDistMin, audioDistMax)),
                    evt = this.volumeChangedEvents[user.id];

                evt.set(user.tx, user.ty, volume);
                this.dispatchEvent(evt);
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
                if (this.isActive) {
                    g.strokeStyle = "white";
                    g.strokeRect(0, 0, this.stackAvatarWidth, this.stackAvatarHeight);
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
        if (!this.avatarImage) {
            g.font = 0.9 * this.stackAvatarHeight + "px sans-serif";
            if (!this.avatarEmojiMetrics) {
                this.avatarEmojiMetrics = g.measureText(this.avatarEmoji);
            }
            g.fillText(
                this.avatarEmoji,
                (this.avatarEmojiMetrics.width - this.stackAvatarWidth) / 2 + this.avatarEmojiMetrics.actualBoundingBoxLeft,
                this.avatarEmojiMetrics.actualBoundingBoxAscent);
        }
        else {
            g.drawImage(
                this.avatarImage,
                0, 0,
                this.stackAvatarWidth,
                this.stackAvatarHeight);
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
    constructor(participantID) {
        super("moveTo");
        this.participantID = participantID;
        this.x = 0;
        this.y = 0;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class UserPositionNeededEvent extends Event {
    constructor(participantID) {
        super("userInitRequest");
        this.participantID = participantID;
    }
}

class UserVolumeChangedEvent extends Event {
    constructor(participantID) {
        super("changeUserVolume");
        this.participantID = participantID;
        this.x = 0;
        this.y = 0;
        this.volume = 0;
    }

    set(x, y, volume) {
        this.x = x;
        this.y = y;
        this.volume = volume;
    }
}