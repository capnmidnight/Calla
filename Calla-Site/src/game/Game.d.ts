import { EventBase } from "../lib/calla";
export declare class Game extends EventBase {
    constructor(zoomMin: any, zoomMax: any);
    get style(): any;
    initializeUser(id: any, evt: any): void;
    updateAudioActivity(id: any, isActive: any): void;
    emote(id: any, emoji: any): void;
    getTileAt(cursor: any): {
        x: number;
        y: number;
    };
    moveMeTo(x: any, y: any): void;
    moveMeBy(dx: any, dy: any): void;
    moveMeByPath(dx: any, dy: any): void;
    warpMeTo(x: any, y: any): void;
    visit(id: any): void;
    get zoom(): any;
    set zoom(v: any);
    /**
     *
     * @param {string} id
     * @param {string} displayName
     * @param {import("../calla").InterpolatedPose} pose
     */
    addUser(id: any, displayName: any, pose: any): void;
    toggleMyAudio(): void;
    toggleMyVideo(): void;
    muteUserAudio(id: any, muted: any): void;
    muteUserVideo(id: any, muted: any): void;
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
    withUser(msg: any, id: any, callback: any, timeout: any): void;
    changeUserName(id: any, displayName: any): void;
    removeUser(id: any): void;
    setAvatarVideo(id: any, stream: any): void;
    setAvatarURL(id: any, url: any): void;
    setAvatarEmoji(id: any, emoji: any): void;
    /**
     *
     * @param {string} id
     * @param {string} displayName
     * @param {import("../calla").InterpolatedPose} pose
     * @param {string} avatarURL
     * @param {string} roomName
     */
    startAsync(id: any, displayName: any, pose: any, avatarURL: any, roomName: any): Promise<void>;
    startLoop(): void;
    resize(): void;
    end(): void;
    update(dt: any): void;
    render(): void;
    drawCursor(): void;
}
