import { AppGui } from "./appgui.js";
import { TileMap } from "./tilemap.js";
import { User } from "./user.js";
import { lerp, clamp, project, unproject } from "./math.js";

const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_MAX = 8,
    CAMERA_ZOOM_MIN = 0.1,
    CAMERA_ZOOM_SHAPE = 1 / 4,
    CAMERA_ZOOM_SPEED = 0.005;

export class Game {

    constructor(jitsiClient) {
        this.jitsiClient = jitsiClient;
        this.frontBuffer = document.querySelector("#frontBuffer");
        this.g = this.frontBuffer.getContext("2d");
        this.me = null
        this.gui = new AppGui(this);
        this.map = null;
        this.keys = [];
        this.userLookup = {};
        this.userList = [];

        this._loop = this.loop.bind(this);
        this.lastTime = 0;
        this.lastMove = Number.MAX_VALUE;
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraZ = this.targetCameraZ = 1.5;
        this.currentRoomName = null;
        this.fontSize = this.gui.fontSizeSpinner && this.gui.fontSizeSpinner.value || 10;

        this.cursor = null;

        addEventListener("resize", this.frontBuffer.resize.bind(this.frontBuffer));

        // ============= KEYBOARD =================

        addEventListener("keydown", (evt) => {
            const keyIndex = this.keys.indexOf(evt.key);
            if (keyIndex < 0) {
                this.keys.push(evt.key);
            }
        });

        addEventListener("keyup", (evt) => {
            const keyIndex = this.keys.indexOf(evt.key);
            if (keyIndex >= 0) {
                this.keys.splice(keyIndex, 1);
            }
        });

        // ============= KEYBOARD =================

        // ============= MOUSE =================

        this.frontBuffer.addEventListener("wheel", (evt) => {
            // Chrome and Firefox report scroll values in completely different ranges.
            const deltaZ = evt.deltaY * (isFirefox ? 1 : 0.02),
                a = project(this.targetCameraZ, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
                b = Math.pow(a, CAMERA_ZOOM_SHAPE),
                c = b - deltaZ * CAMERA_ZOOM_SPEED,
                d = clamp(c, 0, 1),
                e = Math.pow(d, 1 / CAMERA_ZOOM_SHAPE);

            this.targetCameraZ = unproject(e, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
        }, { passive: true });

        function readCursor(evt) {
            return {
                x: evt.offsetX * devicePixelRatio,
                y: evt.offsetY * devicePixelRatio
            }
        }

        this.frontBuffer.addEventListener("mousemove", (evt) => {
            this.cursor = readCursor(evt);
        });

        this.frontBuffer.addEventListener("click", (evt) => {
            const cursor = readCursor(evt);
            if (!!this.me) {
                const tile = this.cursorToTile(cursor),
                    dx = tile.x - this.me.tx,
                    dy = tile.y - this.me.ty,
                    clearTile = this.map.getClearTile(this.me.tx, this.me.ty, dx, dy);
                this.me.moveTo(clearTile.x, clearTile.y);
            }
        });

        // ============= MOUSE =================

        // ============= TOUCH =================
        // ============= TOUCH =================

        // ============= GAMEPAD =================
        // ============= GAMEPAD =================

        this.jitsiClient.addEventListener("moveTo", (evt) => {
            const user = this.userLookup[evt.participantID];
            if (!!user) {
                user.moveTo(evt.x, evt.y);
            }
        });

        this.jitsiClient.addEventListener("userInitResponse", (evt) => {
            this.jitsiClient.txGameData(evt.participantID, "moveTo", { x: this.me.x, y: this.me.y });
        });

        this.jitsiClient.addEventListener("muteStatusChanged", this.muteUser.bind(this));
    }

    cursorToTile(cursor) {
        const imageX = cursor.x - this.gridOffsetX,
            imageY = cursor.y - this.gridOffsetY,
            zoomX = imageX / this.cameraZ,
            zoomY = imageY / this.cameraZ,
            mapX = zoomX - this.cameraX,
            mapY = zoomY - this.cameraY,
            mapWidth = this.map.tileWidth,
            mapHeight = this.map.tileHeight,
            gridX = Math.floor(mapX / mapWidth),
            gridY = Math.floor(mapY / mapHeight),
            tile = { x: gridX, y: gridY };
        return tile;
    }

    registerGameListeners(api) {
        api.addEventListener("videoConferenceJoined", this.start.bind(this));
        api.addEventListener("videoConferenceLeft", this.end.bind(this));
        api.addEventListener("participantJoined", this.addUser.bind(this));
        api.addEventListener("participantLeft", this.removeUser.bind(this));
        api.addEventListener("avatarChanged", this.setAvatar.bind(this));
        api.addEventListener("endpointTextMessageReceived", this.jitsiClient.rxGameData);
        api.addEventListener("displayNameChange", this.changeUserName.bind(this));
        api.addEventListener("audioMuteStatusChanged", this.muteUser.bind(this));
    }

    addUser(evt) {
        //evt = {
        //    id: "string", // the id of the participant
        //    displayName: "string" // the display name of the participant
        //};
        if (this.userLookup[evt.id]) {
            removeUser(evt);
        }

        const user = new User(evt.id, evt.displayName, false);
        user.addEventListener("userPositionNeeded", (evt) => {
            this.jitsiClient.txGameData(evt.id, "userInitResponse");
        });
        this.userLookup[evt.id] = user;
        this.userList.unshift(user);
    }

    changeUserName(evt) {
        //evt = {
        //    id: string, // the id of the participant that changed his display name
        //    displayname: string // the new display name
        //};

        const user = this.userLookup[evt.id];
        if (!!user) {
            user.setDisplayName(evt.displayName);
        }
    }

    muteUser(evt) {
        if (evt.participantID) {
            const user = this.userLookup[evt.participantID];
            if (!!user) {
                user.muted = evt.muted;
            }
        }
        else if (!this.me) {
            setTimeout(this.muteUser.bind(this, evt), 1000);
        }
        else {
            this.me.muted = evt.muted;
            evt.participantID = this.me.id;
            for (let user of this.userList) {
                if (!user.isMe) {
                    this.jitsiClient.txGameData(user.id, "muteStatusChanged", evt);
                }
            }
        }
    }

    removeUser(evt) {
        //evt = {
        //    id: "string" // the id of the participant
        //};
        const user = this.userLookup[evt.id];
        if (!!user) {
            delete this.userLookup[evt.id];

            const userIndex = this.userList.indexOf(user);
            if (userIndex >= 0) {
                this.userList.splice(userIndex, 1);
            }
        }
    }

    setAvatar(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  avatarURL: string // the new avatar URL.
        //}
        const user = this.userLookup[evt.id];
        if (!!user) {
            user.setAvatar(evt.avatarURL);
        }
    }

    start(evt) {
        //evt = {
        //    roomName: "string", // the room name of the conference
        //    id: "string", // the id of the local participant
        //    displayName: "string", // the display name of the local participant
        //    avatarURL: "string" // the avatar URL of the local participant
        //};

        this.currentRoomName = evt.roomName;
        this.me = new User(evt.id, evt.displayName, true);
        this.me.setAvatar(evt.avatarURL);
        this.me.addEventListener("move", (evt) => {
            for (let user of this.userList) {
                if (!user.isMe) {
                    this.jitsiClient.txGameData(user.id, "moveTo", evt);
                }
            }
        });
        this.me.addEventListener("changeUserVolume", (evt) => {
            this.jitsiClient.txJitsiHax("setVolume", evt);
        });
        this.userList.push(this.me);

        this.map = new TileMap(this.currentRoomName);
        this.map.load()
            .catch(() => {
                this.map = new TileMap("default");
                return this.map.load();
            })
            .then(this.startLoop.bind(this));
    }

    startLoop() {
        this.frontBuffer.show();
        this.frontBuffer.resize();
        this.frontBuffer.focus();

        requestAnimationFrame((time) => {
            this.lastTime = time;
            requestAnimationFrame(this._loop);
        });
    }

    loop(time) {
        if (this.currentRoomName !== null) {
            requestAnimationFrame(this._loop);
        }
        const dt = time - this.lastTime;
        this.lastTime = time;
        this.update(dt / 1000);
        this.render();
    }

    end(evt) {
        //evt = {
        //    roomName: string // the room name of the conference
        //};

        if (evt.roomName === this.currentRoomName) {
            this.currentRoomName = null;
            this.gui.showLogin();
        }
    }

    update(dt) {
        this.gridOffsetX = Math.floor(0.5 * this.frontBuffer.width / this.map.tileWidth) * this.map.tileWidth;
        this.gridOffsetY = Math.floor(0.5 * this.frontBuffer.height / this.map.tileHeight) * this.map.tileHeight;


        this.lastMove += dt;
        if (this.lastMove >= MOVE_REPEAT) {
            let dx = 0,
                dy = 0;

            for (let key of this.keys) {
                switch (key) {
                    case "ArrowUp": dy--; break;
                    case "ArrowDown": dy++; break;
                    case "ArrowLeft": dx--; break;
                    case "ArrowRight": dx++; break;
                }
            }

            if (dx !== 0
                || dy !== 0) {
                const clearTile = this.map.getClearTile(this.me.tx, this.me.ty, dx, dy);
                this.me.moveTo(clearTile.x, clearTile.y);
            }

            this.lastMove = 0;
        }

        for (let user of this.userList) {
            user.update(dt, this.map, this.userList);
        }
        for (let user of this.userList) {
            this.me.readUser(user, AUDIO_DISTANCE_MIN, AUDIO_DISTANCE_MAX);
        }
    }

    render() {
        const targetCameraX = -this.me.x * this.map.tileWidth,
            targetCameraY = -this.me.y * this.map.tileHeight;

        this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, CAMERA_LERP * 10);
        this.cameraX = lerp(this.cameraX, targetCameraX, CAMERA_LERP * this.cameraZ);
        this.cameraY = lerp(this.cameraY, targetCameraY, CAMERA_LERP * this.cameraZ);

        this.g.resetTransform();
        this.g.clearRect(0, 0, this.frontBuffer.width, this.frontBuffer.height);
        this.g.translate(this.gridOffsetX, this.gridOffsetY);
        this.g.scale(this.cameraZ, this.cameraZ);
        this.g.translate(this.cameraX, this.cameraY);

        this.map.draw(this.g);

        for (let user of this.userList) {
            user.drawShadow(this.g, this.map, this.cameraZ);
        }
        for (let user of this.userList) {
            user.drawAvatar(this.g, this.map);
        }

        this.drawCursor();

        for (let user of this.userList) {
            user.drawName(this.g, this.map, this.cameraZ, this.fontSize);
        }

    }


    drawCursor() {
        if (!!this.cursor) {
            const tile = this.cursorToTile(this.cursor);
            this.g.strokeStyle = "red";
            this.g.strokeRect(
                tile.x * this.map.tileWidth,
                tile.y * this.map.tileHeight,
                this.map.tileWidth,
                this.map.tileHeight);
        }
    }
}