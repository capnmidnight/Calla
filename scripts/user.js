"use strict";

class User {
    constructor(id, displayName, isMe) {
        this.id = id;
        this.displayName = displayName;
        this.x = 0; this.y = 0;
        this.sx = 0; this.sy = 0;
        this.tx = 0; this.ty = 0;
        this.dx = 0; this.dy = 0;
        this.dist = 0;
        this.t = 0;
        this.distSqToMe = 0;
        this.isMe = isMe;
        this.lastMove = MOVE_REPEAT;
        this.keys = [];

        if (isMe) {
            addEventListener("keydown", (evt) => {
                var keyIndex = this.keys.indexOf(evt.key);
                if (keyIndex < 0) {
                    this.keys.push(evt.key);
                }
            });

            addEventListener("keyup", (evt) => {
                var keyIndex = this.keys.indexOf(evt.key);
                if (keyIndex >= 0) {
                    this.keys.splice(keyIndex, 1);
                }
            });

            frontBuffer.addEventListener("click", (evt) => {
                var tileX = Math.floor(evt.offsetX * devicePixelRatio / TILE_WIDTH),
                    tileY = Math.floor(evt.offsetY * devicePixelRatio / TILE_HEIGHT),
                    dx = tileX - TILE_COUNT_X_HALF,
                    dy = tileY - TILE_COUNT_Y_HALF;

                this.moveBy(dx, dy);
            });
        }
    }

    moveBy(dx, dy) {
        this.moveTo(this.tx + dx, this.ty + dy);
    }

    moveTo(x, y) {
        if (this.isMe) {
            for (var i = 0; i < userList.length; ++i) {
                var user = userList[i];
                jitsiClient.txGameData(user.id, "moveTo", {
                    x: x,
                    y: y
                });
            }
        }

        this.sx = this.x;
        this.sy = this.y;
        this.tx = x;
        this.ty = y;
        this.dx = this.tx - this.sx;
        this.dy = this.ty - this.sy;
        this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.t = 0;
    }

    read(user) {
        var dx = user.tx - this.tx,
            dy = user.ty - this.ty,
            distSq = Math.max(AUDIO_DISTANCE_MIN_SQ, Math.min(AUDIO_DISTANCE_MAX_SQ, dx * dx + dy * dy));

        if (distSq != user.distSqToMe) {
            user.distSqToMe = distSq;
            var volume = 1 - ((Math.sqrt(distSq) - AUDIO_DISTANCE_MIN) / AUDIO_DISTANCE_DELTA);

            jitsiClient.txJitsiHax("setVolume", {
                user: user.id,
                volume: volume
            });

            console.log("Setting volume of user " + user.id + " to " + volume);
        }
    }

    update(dt) {
        if (this.isMe) {
            this.lastMove += dt;
            if (this.lastMove >= MOVE_REPEAT) {
                var dx = 0,
                    dy = 0;

                for (var i = 0; i < this.keys.length; ++i) {
                    var key = this.keys[i];
                    switch (key) {
                        case "ArrowUp": dy--; break;
                        case "ArrowDown": dy++; break;
                        case "ArrowLeft": dx--; break;
                        case "ArrowRight": dx++; break;
                    }
                }

                if (dx != 0 || dy != 0) {
                    this.moveBy(dx, dy);
                }

                this.lastMove = 0;
            }
        }

        if (this.dist > 0) {
            this.t += dt;
            if (this.t >= MOVE_TRANSITION_TIME) {
                this.x = this.sx = this.tx;
                this.y = this.sy = this.ty;
                this.t = this.dx = this.dy = this.dist = 0;
            }
            else {
                var p = this.t / MOVE_TRANSITION_TIME,
                    s = Math.sin(Math.PI * p / 2);
                this.x = this.sx + s * this.dx;
                this.y = this.sy + s * this.dy;
            }
        }
    }

    draw(g) {
        g.save();
        g.translate(this.tx * TILE_WIDTH, this.ty * TILE_HEIGHT);
        if (this.isMe && this.dist > 0) {
            g.strokeStyle = "green";
            g.strokeRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
        }
        g.fillStyle = this.isMe ? "red" : "blue";
        g.fillRect(
            (this.x - this.tx) * TILE_WIDTH,
            (this.y - this.ty) * TILE_HEIGHT,
            TILE_WIDTH,
            TILE_HEIGHT);
        g.fillStyle = "black";
        g.textBaseline = "bottom";
        g.fillText(this.displayName || this.id, TILE_WIDTH / 2, 0);
        g.restore();
    }

    requestPosition() {
        jitsiClient.txGameData(this.id, "requestPosition");
    }
}