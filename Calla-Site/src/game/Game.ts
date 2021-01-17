import type { InterpolatedPose } from "calla/audio/positions/InterpolatedPose";
import { arrayClear } from "kudzu/arrays/arrayClear";
import type { Emoji } from "kudzu/emoji/Emoji";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { id } from "kudzu/html/attrs";
import { resizeCanvas } from "kudzu/html/canvas";
import { Canvas } from "kudzu/html/tags";
import { EventedGamepad } from "kudzu/input/EventedGamepad";
import { IImageFetcher } from "kudzu/io/IImageFetcher";
import { clamp } from "kudzu/math/clamp";
import { lerp } from "kudzu/math/lerp";
import { project } from "kudzu/math/project";
import { unproject } from "kudzu/math/unproject";
import { isString } from "kudzu/typeChecks";
import { Emote, EmoteEvent } from "./Emote";
import { hide, show } from "./forms/ops";
import { ScreenPointerControls } from "./ScreenPointerControls";
import type { IInputBinding } from "./Settings";
import { TileMap } from "./TileMap";
import { User, UserJoinedEvent, UserMovedEvent } from "./User";

type withUserCallback = (user: User) => any;

const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_SHAPE = 2,
    MOVE_REPEAT = 0.125,
    gameStartedEvt = new TypedEvent("gameStarted"),
    gameEndedEvt = new TypedEvent("gameEnded"),
    zoomChangedEvt = new TypedEvent("zoomChanged"),
    emojiNeededEvt = new TypedEvent("emojiNeeded"),
    toggleAudioEvt = new TypedEvent("toggleAudio"),
    toggleVideoEvt = new TypedEvent("toggleVideo"),
    userJoinedEvt = new UserJoinedEvent(null),
    moveEvent = new UserMovedEvent(null),
    emoteEvt = new EmoteEvent(null);

interface GameEvents {
    gameStarted: TypedEvent<"gameStarted">;
    gameEnded: TypedEvent<"gameEnded">;
    zoomChanged: TypedEvent<"zoomChanged">;
    emojiNeeded: TypedEvent<"emojiNeeded">;
    toggleAudio: TypedEvent<"toggleAudio">;
    toggleVideo: TypedEvent<"toggleVideo">;
    userJoined: UserJoinedEvent;
    userMoved: UserMovedEvent;
    emote: EmoteEvent;
}

/** @type {Map<Game, EventedGamepad>} */
const gamepads = new Map();

export class Game extends TypedEventBase<GameEvents> {

    waypoints = new Array<{ x: number, y: number; }>();
    users = new Map<string, User>();
    emotes = new Array<Emote>();
    keys = new Map<string, KeyboardEvent>();

    lastMove = Number.MAX_VALUE;
    lastWalk = Number.MAX_VALUE;
    gridOffsetX = 0;
    gridOffsetY = 0;
    fontSize = 0;
    cameraX = 0;
    offsetCameraX = 0;
    targetOffsetCameraX = 0;
    cameraY = 0;
    offsetCameraY = 0;
    targetOffsetCameraY = 0;
    cameraZ = 1.5;
    targetCameraZ = 1.5;
    drawHearing = false;
    audioDistanceMin = 2;
    audioDistanceMax = 10;
    rolloff = 5;
    lastGamepadIndex = -1;
    gamepadIndex = -1;
    transitionSpeed = 0.125;
    keyboardEnabled = true;

    me: User = null;
    map: TileMap = null;
    currentRoomName: string = null;
    currentEmoji: Emoji = null;

    element: HTMLCanvasElement;
    gFront: CanvasRenderingContext2D;
    inputBinding: IInputBinding;
    screenControls: ScreenPointerControls;

    constructor(private fetcher: IImageFetcher, public zoomMin: number, public zoomMax: number) {
        super();

        this.element = Canvas(id("frontBuffer"));
        this.gFront = this.element.getContext("2d");

        this.audioDistanceMin = 2;
        this.audioDistanceMax = 10;
        this.rolloff = 5;

        this.currentEmoji = null;

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

        window.addEventListener("keydown", (evt: KeyboardEvent) => {
            this.keys.set(evt.key, evt);
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

        window.addEventListener("keyup", (evt: KeyboardEvent) => {
            if (this.keys.has(evt.key)) {
                this.keys.delete(evt.key);
            }
        });

        // ============= KEYBOARD =================

        // ============= POINTERS =================
        this.screenControls = new ScreenPointerControls(this.element);
        this.screenControls.addEventListener("move", (evt) => {
            if (Math.abs(evt.dz) > 0) {
                this.zoom += evt.dz;
                this.dispatchEvent(zoomChangedEvt);
            }
        });
        this.screenControls.addEventListener("drag", (evt) => {
            this.targetOffsetCameraX = this.offsetCameraX += evt.dx;
            this.targetOffsetCameraY = this.offsetCameraY += evt.dy;
        });

        this.screenControls.addEventListener("click", (evt) => {
            if (!!this.me) {
                const tile = this.getTileAt(evt),
                    dx = tile.x - this.me.gridX,
                    dy = tile.y - this.me.gridY;

                this.moveMeByPath(dx, dy);
            }
        });
        // ============= POINTERS =================

        // ============= ACTION ==================
    }

    get style() {
        return this.element.style;
    }

    updateAudioActivity(id: string, isActive: boolean) {
        this.withUser("update audio activity", id, (user) => {
            user.isActive = isActive;
        });
    }

    emote(id: string, emoji: Emoji) {
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

    getTileAt(cursor: { x: number, y: number; }) {
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

    moveMeTo(x: number, y: number) {
        if (this.map.isClear(x, y, this.me.avatar)) {
            this.targetOffsetCameraX = 0;
            this.targetOffsetCameraY = 0;
            moveEvent.x = x;
            moveEvent.y = y;
            this.dispatchEvent(moveEvent);
        }
    }

    moveMeBy(dx: number, dy: number) {
        const clearTile = this.map.getClearTile(this.me.gridX, this.me.gridY, dx, dy, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    moveMeByPath(dx: number, dy: number) {
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

    warpMeTo(x: number, y: number) {
        const clearTile = this.map.getClearTileNear(x, y, 3, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    visit(id: string) {
        this.withUser("visit", id, (user) => {
            this.warpMeTo(user.gridX, user.gridY);
        });
    }

    get zoom(): number {
        const a = project(this.targetCameraZ, this.zoomMin, this.zoomMax),
            b = Math.pow(a, 1 / CAMERA_ZOOM_SHAPE),
            c = unproject(b, this.zoomMin, this.zoomMax);
        return c;
    }

    set zoom(v: number) {
        v = clamp(v, this.zoomMin, this.zoomMax);

        const a = project(v, this.zoomMin, this.zoomMax),
            b = Math.pow(a, CAMERA_ZOOM_SHAPE),
            c = unproject(b, this.zoomMin, this.zoomMax);
        this.targetCameraZ = c;
    }

    addUser(id: string, displayName: string, pose: InterpolatedPose) {
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

    muteUserAudio(id: string, muted: boolean) {
        this.withUser("mute audio", id, (user) => {
            user.audioMuted = muted;
        });
    }

    muteUserVideo(id: string, muted: boolean) {
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
     */
    withUser(msg: string, id: string, callback: withUserCallback, timeout?: number) {
        if (timeout === undefined) {
            timeout = 5000;
        }
        if (id) {
            if (this.users.has(id)) {
                const user = this.users.get(id);
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

    changeUserName(id: string, displayName: string) {
        this.withUser("change user name", id, (user) => {
            user.displayName = displayName;
        });
    }

    removeUser(id: string) {
        if (this.users.has(id)) {
            this.users.delete(id);
        }
    }

    setAvatarVideo(id: string, stream: MediaStream) {
        this.withUser("set avatar video", id, (user) => {
            user.setAvatarVideo(stream);
        });
    }

    setAvatarURL(id: string, url: string) {
        this.withUser("set avatar image", id, (user) => {
            user.setAvatarImage(url);
        });
    }

    setAvatarEmoji(id: string, emoji: Emoji) {
        this.withUser("set avatar emoji", id, (user) => {
            user.setAvatarEmoji(emoji.value);
        });
    }

    async startAsync(id: string, displayName: string, pose: InterpolatedPose, avatarURL: string, roomName: string) {
        this.currentRoomName = roomName.toLowerCase();
        this.me = new User(id, displayName, pose, true);
        if (isString(avatarURL)) {
            this.me.setAvatarImage(avatarURL);
        }
        this.users.set(id, this.me);

        this.map = new TileMap(this.currentRoomName, this.fetcher);
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
                    this.map = new TileMap("default", this.fetcher);
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
        show(this.element);
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
        hide(this.element);
        this.dispatchEvent(gameEndedEvt);
    }

    update(dt: number) {
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
