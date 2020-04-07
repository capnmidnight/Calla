import { clamp, project } from "./protos.js";

const POSITION_REQUEST_DEBOUNCE_TIME = 1000,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5;

export class User {
    constructor(id, displayName, isMe) {
        this.id = id;
        this.displayName = displayName || id;
        this.x = 0; this.y = 0;
        this.sx = 0; this.sy = 0;
        this.tx = 0; this.ty = 0;
        this.dx = 0; this.dy = 0;
        this.dist = 0;
        this.t = 0;
        this.distToMe = 0;
        this.isMe = isMe;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.hasPosition = isMe;
        this.lastPositionRequestTime = Date.now() - POSITION_REQUEST_DEBOUNCE_TIME;
        this.eventHandlers = {
            move: [],
            userPositionNeeded: [],
            changeUserVolume: []
        };
    }

    addEventListener(evtName, func) {
        if (!this.eventHandlers[evtName]) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        this.eventHandlers[evtName].push(func);
    }

    moveTo(x, y) {
        if (this.isMe) {
            if (x !== this.tx
                || y !== this.ty) {
                var evt = {
                    x: x,
                    y: y
                };
                for (let func of this.eventHandlers.move) {
                    func(evt);
                }
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
                for (let func of this.eventHandlers.userPositionNeeded) {
                    func(this);
                }
            }
        }
    }

    readUser(user, audioDistMin, audioDistMax) {
        if (this.isMe
            && !user.isMe) {
            const dx = user.tx - this.tx,
                dy = user.ty - this.ty,
                distSq = dx * dx + dy * dy,
                dist = clamp(Math.sqrt(distSq), audioDistMin, audioDistMax);

            if (dist !== user.distToMe) {
                user.distToMe = dist;
                const volume = 1 - project(dist, audioDistMin, audioDistMax),
                    evt = {
                        user: user.id,
                        volume: volume
                    };

                for (let func of this.eventHandlers.changeUserVolume) {
                    func(evt);
                }
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
                g.translate(this.tx * map.tileWidth + this.stackOffsetX, this.ty * map.tileHeight + this.stackOffsetY);

                g.fillStyle = this.isMe ? "red" : "blue";
                g.fillRect(
                    (this.x - this.tx) * map.tileWidth,
                    (this.y - this.ty) * map.tileHeight,
                    this.stackAvatarWidth,
                    this.stackAvatarHeight);

                g.strokeStyle = "grey";
                g.strokeRect(0, 0, this.stackAvatarWidth, this.stackAvatarHeight);
            }
            g.restore();
        }
    }

    drawName(g, map, cameraZ) {
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
                g.font = "regular 12pt 'Segoe UI'";
                g.fillText(this.displayName, 0, 0);
            }
            g.restore();
        }
    }
}