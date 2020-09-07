import { arrayClear } from "../calla/arrays/arrayClear";
import { addEventListeners } from "../calla/events/addEventListeners";
import { EventBase } from "../calla/events/EventBase";
import { clamp } from "../calla/math/clamp";
import { lerp } from "../calla/math/lerp";
import { project } from "../calla/math/project";
import { unproject } from "../calla/math/unproject";
import { isString } from "../calla/typeChecks";
import { id } from "../html/attrs";
import { resizeCanvas } from "../html/canvas";
import { hide, show } from "../html/ops";
import { Canvas } from "../html/tags";
import { EventedGamepad } from "../input/EventedGamepad";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { Emote } from "./graphics/Emote";
import { TileMap } from "./graphics/TileMap";
import { User } from "./User";


const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_SHAPE = 2,
    MOVE_REPEAT = 0.125,
    gameStartedEvt = new Event("gameStarted"),
    gameEndedEvt = new Event("gameEnded"),
    zoomChangedEvt = new Event("zoomChanged"),
    emojiNeededEvt = new Event("emojiNeeded"),
    toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    moveEvent = Object.assign(new Event("userMoved"), {
        x: 0,
        y: 0
    }),
    emoteEvt = Object.assign(new Event("emote"), {
        emoji: null
    }),
    userJoinedEvt = Object.assign(new Event("userJoined", {
        user: null
    }));

/** @type {Map<Game, EventedGamepad>} */
const gamepads = new Map();

export class Game extends EventBase {

    constructor(zoomMin, zoomMax) {
        super();

        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;

        this.element = Canvas(id("frontBuffer"));
        this.gFront = this.element.getContext("2d");

        /** @type {User} */
        this.me = null;

        /** @type {TileMap} */
        this.map = null;

        this.waypoints = [];

        this.keys = {};

        /** @type {Map.<string, User>} */
        this.users = new Map();

        this.lastMove = Number.MAX_VALUE;
        this.lastWalk = Number.MAX_VALUE;
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        this.cameraX = this.offsetCameraX = this.targetOffsetCameraX = 0;
        this.cameraY = this.offsetCameraY = this.targetOffsetCameraY = 0;
        this.cameraZ = this.targetCameraZ = 1.5;
        this.currentRoomName = null;
        this.fontSize = 10;

        this.drawHearing = false;
        this.audioDistanceMin = 2;
        this.audioDistanceMax = 10;
        this.rolloff = 5;

        this.currentEmoji = null;

        /** @type {Emote[]} */
        this.emotes = [];

        this.inputBinding = {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",
            keyButtonZoomOut: "[",
            keyButtonZoomIn: "]",

            gpAxisLeftRight: 0,
            gpAxisUpDown: 1,

            gpButtonEmote: 0,
            gpButtonToggleAudio: 1,
            gpButtonZoomIn: 6,
            gpButtonZoomOut: 7,
            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15
        };

        this.lastGamepadIndex = -1;
        this.gamepadIndex = -1;
        this.transitionSpeed = 0.125;
        this.keyboardEnabled = true;


        // ============= KEYBOARD =================

        addEventListener("keydown", (evt) => {
            this.keys[evt.key] = evt;
            if (this.keyboardEnabled
                && !evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey
                && evt.key === this.inputBinding.keyButtonToggleAudio
                && !!this.me) {
                this.toggleMyAudio();
            }
        });

        addEventListener("keyup", (evt) => {
            if (this.keys[evt.key]) {
                delete this.keys[evt.key];
            }
        });

        // ============= KEYBOARD =================

        // ============= POINTERS =================
        this.screenControls = new ScreenPointerControls(this.element);
        addEventListeners(this.screenControls, {
            move: (evt) => {
                if (Math.abs(evt.dz) > 0) {
                    this.zoom += evt.dz;
                    this.dispatchEvent(zoomChangedEvt);
                }
            },
            drag: (evt) => {
                this.targetOffsetCameraX = this.offsetCameraX += evt.dx;
                this.targetOffsetCameraY = this.offsetCameraY += evt.dy;
            },
            click: (evt) => {
                if (!!this.me) {
                    const tile = this.getTileAt(evt),
                        dx = tile.x - this.me.gridX,
                        dy = tile.y - this.me.gridY;

                    this.moveMeByPath(dx, dy);
                }
            }
        });
        // ============= POINTERS =================

        // ============= ACTION ==================
    }

    get style() {
        return this.element.style;
    }

    initializeUser(id, evt) {
        this.withUser("initialize user", id, (user) => {
            user.deserialize(evt);
        });
    }

    updateAudioActivity(id, isActive) {
        this.withUser("update audio activity", id, (user) => {
            user.isActive = isActive;
        });
    }

    emote(id, emoji) {
        if (this.users.has(id)) {
            const user = this.users.get(id);
            if (user.isMe) {

                emoji = emoji
                    || this.currentEmoji;

                if (!emoji) {
                    this.dispatchEvent(emojiNeededEvt);
                }
                else {
                    emoteEvt.emoji = this.currentEmoji = emoji;
                    this.dispatchEvent(emoteEvt);
                }
            }

            if (emoji) {
                this.emotes.push(new Emote(emoji, user.x, user.y));
            }
        }
    }

    getTileAt(cursor) {
        const imageX = cursor.x * devicePixelRatio - this.gridOffsetX - this.offsetCameraX,
            imageY = cursor.y * devicePixelRatio - this.gridOffsetY - this.offsetCameraY,
            zoomX = imageX / this.cameraZ,
            zoomY = imageY / this.cameraZ,
            mapX = zoomX - this.cameraX,
            mapY = zoomY - this.cameraY,
            gridX = mapX / this.map.tileWidth,
            gridY = mapY / this.map.tileHeight,
            tile = { x: gridX - 0.5, y: gridY - 0.5 };
        return tile;
    }

    moveMeTo(x, y) {
        if (this.map.isClear(x, y, this.me.avatar)) {
            this.targetOffsetCameraX = 0;
            this.targetOffsetCameraY = 0;
            moveEvent.x = x;
            moveEvent.y = y;
            this.dispatchEvent(moveEvent);
        }
    }

    moveMeBy(dx, dy) {
        const clearTile = this.map.getClearTile(this.me.gridX, this.me.gridY, dx, dy, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    moveMeByPath(dx, dy) {
        arrayClear(this.waypoints);

        const x = this.me.gridX,
            y = this.me.gridY,
            start = this.map.getGridNode(x, y),
            tx = x + dx,
            ty = y + dy,
            gx = Math.round(tx),
            gy = Math.round(ty),
            ox = tx - gx,
            oy = ty - gy,
            end = this.map.getGridNode(tx, ty);

        if (!start || !end) {
            this.moveMeTo(tx, ty);
        }
        else {
            const result = this.map.searchPath(start, end);
            if (result.length === 0) {
                this.moveMeTo(tx, ty);
            }
            else {
                for (let point of result) {
                    point.x += ox;
                    point.y += oy;
                }
                this.waypoints.push(...result);
            }
        }
    }

    warpMeTo(x, y) {
        const clearTile = this.map.getClearTileNear(x, y, 3, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    visit(id) {
        this.withUser("visit", id, (user) => {
            this.warpMeTo(user.gridX, user.gridY);
        });
    }

    get zoom() {
        const a = project(this.targetCameraZ, this.zoomMin, this.zoomMax),
            b = Math.pow(a, 1 / CAMERA_ZOOM_SHAPE),
            c = unproject(b, this.zoomMin, this.zoomMax);
        return c;
    }

    set zoom(v) {
        v = clamp(v, this.zoomMin, this.zoomMax);

        const a = project(v, this.zoomMin, this.zoomMax),
            b = Math.pow(a, CAMERA_ZOOM_SHAPE),
            c = unproject(b, this.zoomMin, this.zoomMax);
        this.targetCameraZ = c;
    }

    /**
     * 
     * @param {string} id
     * @param {string} displayName
     * @param {import("../calla").InterpolatedPose} pose
     */
    addUser(id, displayName, pose) {
        if (this.users.has(id)) {
            this.removeUser(id);
        }

        const user = new User(id, displayName, pose, false);
        this.users.set(id, user);

        userJoinedEvt.user = user;
        this.dispatchEvent(userJoinedEvt);
    }

    toggleMyAudio() {
        this.dispatchEvent(toggleAudioEvt);
    }

    toggleMyVideo() {
        this.dispatchEvent(toggleVideoEvt);
    }

    muteUserAudio(id, muted) {
        this.withUser("mute audio", id, (user) => {
            user.audioMuted = muted;
        });
    }

    muteUserVideo(id, muted) {
        this.withUser("mute video", id, (user) => {
            user.videoMuted = muted;
        });
    }

    /**
    * Used to perform on operation when a valid user object is found.
    * @callback withUserCallback
    * @param {User} user
    * @returns {void}
    */

    /**
     * Find a user by id, then perform an operation on it.
     * @param {string} msg
     * @param {string} id
     * @param {withUserCallback} callback
     * @param {number} timeout
     */
    withUser(msg, id, callback, timeout) {
        if (timeout === undefined) {
            timeout = 5000;
        }
        if (id) {
            if (this.users.has(id)) {
                const user = this.users.get(id)
                callback(user);
            }
            else {
                console.warn(`No user "${id}" found to ${msg}. Trying again in a quarter second.`);
                if (timeout > 0) {
                    setTimeout(this.withUser.bind(this, msg, id, callback, timeout - 250), 250);
                }
            }
        }
    }

    changeUserName(id, displayName) {
        this.withUser("change user name", id, (user) => {
            user.displayName = displayName;
        });
    }

    removeUser(id) {
        if (this.users.has(id)) {
            this.users.delete(id);
        }
    }

    setAvatarVideo(id, stream) {
        this.withUser("set avatar video", id, (user) => {
            user.setAvatarVideo(stream);
        });
    }

    setAvatarURL(id, url) {
        this.withUser("set avatar image", id, (user) => {
            user.avatarImage = url;
        });
    }

    setAvatarEmoji(id, emoji) {
        this.withUser("set avatar emoji", id, (user) => {
            user.avatarEmoji = emoji;
        });
    }

    /**
     * 
     * @param {string} id
     * @param {string} displayName
     * @param {import("../calla").InterpolatedPose} pose
     * @param {string} avatarURL
     * @param {string} roomName
     */
    async startAsync(id, displayName, pose, avatarURL, roomName) {
        this.currentRoomName = roomName.toLowerCase();
        this.me = new User(id, displayName, pose, true);
        if (isString(avatarURL)) {
            this.me.avatarImage = avatarURL;
        }
        this.users.set(id, this.me);

        this.map = new TileMap(this.currentRoomName);
        let success = false;
        for (let retryCount = 0; retryCount < 2; ++retryCount) {
            try {
                await this.map.load();
                success = true;
            }
            catch (exp) {
                if (retryCount === 0) {
                    console.warn(exp);
                    console.warn("Retrying with default map.");
                    this.map = new TileMap("default");
                }
                else {
                    console.error(exp);
                }
            }
        }

        if (!success) {
            console.error("Couldn't load any maps!");
        }

        this.startLoop();
        this.dispatchEvent(zoomChangedEvt);
        this.dispatchEvent(gameStartedEvt);
    }

    startLoop() {
        show(this);
        this.resize();
        this.element.focus();
    }

    resize() {
        resizeCanvas(this.element, window.devicePixelRatio);
    }

    end() {
        this.currentRoomName = null;
        this.map = null;
        this.users.clear();
        this.me = null;
        hide(this);
        this.dispatchEvent(gameEndedEvt);
    }

    update(dt) {
        if (this.currentRoomName !== null) {
            dt /= 1000;
            this.gridOffsetX = Math.floor(0.5 * this.element.width / this.map.tileWidth) * this.map.tileWidth;
            this.gridOffsetY = Math.floor(0.5 * this.element.height / this.map.tileHeight) * this.map.tileHeight;

            this.lastMove += dt;
            if (this.lastMove >= MOVE_REPEAT) {
                let dx = 0,
                    dy = 0,
                    dz = 0;

                if (this.keyboardEnabled) {
                    for (let evt of Object.values(this.keys)) {
                        if (!evt.altKey
                            && !evt.shiftKey
                            && !evt.ctrlKey
                            && !evt.metaKey) {
                            switch (evt.key) {
                                case this.inputBinding.keyButtonUp: dy--; break;
                                case this.inputBinding.keyButtonDown: dy++; break;
                                case this.inputBinding.keyButtonLeft: dx--; break;
                                case this.inputBinding.keyButtonRight: dx++; break;
                                case this.inputBinding.keyButtonZoomIn: dz++; break;
                                case this.inputBinding.keyButtonZoomOut: dz--; break;
                                case this.inputBinding.keyButtonEmote: this.emote(this.me.id, this.currentEmoji); break;
                            }
                        }
                    }
                }

                const gp = navigator.getGamepads()[this.gamepadIndex];
                if (gp) {
                    if (!gamepads.has(this)) {
                        gamepads.set(this, new EventedGamepad(gp));
                    }

                    const pad = gamepads.get(this);
                    pad.update(gp);

                    if (pad.buttons[this.inputBinding.gpButtonEmote].pressed) {
                        this.emote(this.me.id, this.currentEmoji);
                    }

                    if (!pad.lastButtons[this.inputBinding.gpButtonToggleAudio].pressed
                        && pad.buttons[this.inputBinding.gpButtonToggleAudio].pressed) {
                        this.toggleMyAudio();
                    }

                    if (pad.buttons[this.inputBinding.gpButtonUp].pressed) {
                        --dy;
                    }
                    else if (pad.buttons[this.inputBinding.gpButtonDown].pressed) {
                        ++dy;
                    }

                    if (pad.buttons[this.inputBinding.gpButtonLeft].pressed) {
                        --dx;
                    }
                    else if (pad.buttons[this.inputBinding.gpButtonRight].pressed) {
                        ++dx;
                    }

                    dx += Math.round(pad.axes[this.inputBinding.gpAxisLeftRight]);
                    dy += Math.round(pad.axes[this.inputBinding.gpAxisUpDown]);
                    dz += 2 * (pad.buttons[this.inputBinding.gpButtonZoomIn].value - pad.buttons[this.inputBinding.gpButtonZoomOut].value);

                    this.targetOffsetCameraX += -50 * Math.round(2 * pad.axes[2]);
                    this.targetOffsetCameraY += -50 * Math.round(2 * pad.axes[3]);
                    this.dispatchEvent(zoomChangedEvt);
                }

                dx = clamp(dx, -1, 1);
                dy = clamp(dy, -1, 1);

                if (dx !== 0
                    || dy !== 0) {
                    this.moveMeBy(dx, dy);
                    arrayClear(this.waypoints);
                }

                if (dz !== 0) {
                    this.zoom += dz;
                    this.dispatchEvent(zoomChangedEvt);
                }

                this.lastMove = 0;
            }

            this.lastWalk += dt;
            if (this.lastWalk >= this.transitionSpeed) {
                if (this.waypoints.length > 0) {
                    const waypoint = this.waypoints.shift();
                    this.moveMeTo(waypoint.x, waypoint.y);
                }

                this.lastWalk = 0;
            }

            for (let emote of this.emotes) {
                emote.update(dt);
            }

            this.emotes = this.emotes.filter(e => !e.isDead());

            for (let user of this.users.values()) {
                user.update(this.map, this.users);
            }

            this.render();
        }
    }

    render() {
        const targetCameraX = -this.me.x * this.map.tileWidth,
            targetCameraY = -this.me.y * this.map.tileHeight;

        this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, CAMERA_LERP * this.cameraZ);
        this.cameraX = lerp(this.cameraX, targetCameraX, CAMERA_LERP * this.cameraZ);
        this.cameraY = lerp(this.cameraY, targetCameraY, CAMERA_LERP * this.cameraZ);

        this.offsetCameraX = lerp(this.offsetCameraX, this.targetOffsetCameraX, CAMERA_LERP);
        this.offsetCameraY = lerp(this.offsetCameraY, this.targetOffsetCameraY, CAMERA_LERP);

        this.gFront.resetTransform();
        this.gFront.imageSmoothingEnabled = false;
        this.gFront.clearRect(0, 0, this.element.width, this.element.height);

        this.gFront.save();
        {
            this.gFront.translate(
                this.gridOffsetX + this.offsetCameraX,
                this.gridOffsetY + this.offsetCameraY);
            this.gFront.scale(this.cameraZ, this.cameraZ);
            this.gFront.translate(this.cameraX, this.cameraY);

            this.map.draw(this.gFront);

            for (let user of this.users.values()) {
                user.drawShadow(this.gFront, this.map);
            }

            for (let emote of this.emotes) {
                emote.drawShadow(this.gFront, this.map);
            }

            for (let user of this.users.values()) {
                user.drawAvatar(this.gFront, this.map);
            }

            this.drawCursor();

            for (let user of this.users.values()) {
                user.drawName(this.gFront, this.map, this.fontSize);
            }

            if (this.drawHearing) {
                this.me.drawHearingRange(
                    this.gFront,
                    this.map,
                    this.audioDistanceMin,
                    this.audioDistanceMax);
            }

            for (let emote of this.emotes) {
                emote.drawEmote(this.gFront, this.map);
            }

        }
        this.gFront.restore();
    }


    drawCursor() {
        const pointer = this.screenControls.primaryPointer;
        if (pointer) {
            const tile = this.getTileAt(pointer);
            this.gFront.strokeStyle = this.map.isClear(tile.x, tile.y, this.me.avatar)
                ? "green"
                : "red";
            this.gFront.strokeRect(
                tile.x * this.map.tileWidth,
                tile.y * this.map.tileHeight,
                this.map.tileWidth,
                this.map.tileHeight);
        }
    }
}
