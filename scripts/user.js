import { clamp, project } from "./math.js";
import { mutedSpeaker } from "./emoji.js";

const POSITION_REQUEST_DEBOUNCE_TIME = 1000,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames = ["moveTo", "userPositionNeeded", "changeUserVolume"];

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
        super("userPositionNeeded");
        this.participantID = participantID;
    }
}

class UserVolumeChangedEvent extends Event {
    constructor(participantID) {
        super("changeUserVolume");
        this.user = participantID;
        this.x = 0;
        this.y = 0;
        this.volume = 0;
        this.panning = 0;
    }

    set(x, y, volume, panning) {
        this.x = x;
        this.y = y;
        this.volume = volume;
        this.panning = panning;
    }
}

export class User extends EventTarget {
    constructor(id, displayName, isMe) {
        super();

        this.id = id;
        this.displayName = displayName || id;
        this.muted = false;
        this.x = 0; this.y = 0;
        this.sx = 0; this.sy = 0;
        this.tx = 0; this.ty = 0;
        this.dx = 0; this.dy = 0;
        this.dist = 0;
        this.t = 0;
        this.distXToMe = 0;
        this.distYToMe = 0;
        this.isMe = isMe;
        this.image = null;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.hasPosition = isMe;
        this.lastPositionRequestTime = Date.now() - POSITION_REQUEST_DEBOUNCE_TIME;
        this.moveEvent = new UserMoveEvent(this.id);
        this.volumeChangedEvents = {};
    }

    addEventListener(evtName, func) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func);
    }

    setAvatar(url) {
        const img = new Image();
        img.addEventListener("load", (evt) => {
            this.image = img;
        });
        img.src = url;
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
        else if (!this.hasPosition) {
            this.hasPosition = true;
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
        if (this.hasPosition) {
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
                if (user.hasPosition
                    && user.tx === this.tx
                    && user.ty === this.ty) {
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
        if (this.isMe
            && !user.isMe) {
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
                    panning = distX / (.1 + dist),
                    evt = this.volumeChangedEvents[user.id];

                evt.set(distX, distY, volume, panning);
                this.dispatchEvent(evt);
            }
        }
    }

    drawShadow(g, map, cameraZ) {
        if (this.hasPosition) {
            g.save();
            {
                g.translate(this.tx * map.tileWidth + this.stackOffsetX, this.ty * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "rgba(0, 0, 0, 0.5)";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "black";
                g.fillRect(
                    (this.x - this.tx) * map.tileWidth,
                    (this.y - this.ty) * map.tileHeight,
                    this.stackAvatarWidth,
                    this.stackAvatarHeight);
            }
            g.restore();
        }
    }

    drawAvatar(g, map) {
        if (this.hasPosition) {
            g.save();
            {
                g.translate(
                    this.tx * map.tileWidth + this.stackOffsetX,
                    this.ty * map.tileHeight + this.stackOffsetY);

                const x = (this.x - this.tx) * map.tileWidth,
                    y = (this.y - this.ty) * map.tileHeight;

                if (!this.image) {
                    g.fillStyle = this.isMe ? "red" : "blue";
                    g.fillRect(
                        x,
                        y,
                        this.stackAvatarWidth,
                        this.stackAvatarHeight);

                    g.strokeStyle = "grey";
                    g.strokeRect(0, 0, this.stackAvatarWidth, this.stackAvatarHeight);
                }
                else {
                    g.drawImage(this.image, x, y, this.stackAvatarWidth, this.stackAvatarHeight);
                }

                if (this.muted) {
                    g.fillStyle = "black";
                    g.font = this.stackAvatarHeight / 2 + "px sans-serif";
                    g.textBaseline = "top";
                    const metrics = g.measureText(mutedSpeaker.value);
                    g.fillText(
                        mutedSpeaker.value,
                        x + this.stackAvatarWidth - metrics.width,
                        y);
                }
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
        if (this.hasPosition) {
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

    drawName(g, map, cameraZ, fontSize) {
        if (this.hasPosition) {
            g.save();
            {
                g.translate(this.tx * map.tileWidth + this.stackOffsetX, this.ty * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize}pt sans-serif`;
                g.fillText(this.displayName, 0, 0);
            }
            g.restore();
        }
    }
}
