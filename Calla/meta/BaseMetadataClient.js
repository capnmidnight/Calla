import { TypedEventBase } from "kudzu/events/EventBase";
import { sleep } from "kudzu/events/sleep";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
export class BaseMetadataClient extends TypedEventBase {
    constructor(sleepTime) {
        super();
        this.sleepTime = sleepTime;
        this.tasks = new Map();
    }
    async getNext(evtName, userID) {
        return new Promise((resolve) => {
            const getter = (evt) => {
                if (evt instanceof CallaUserEvent
                    && evt.id === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };
            this.addEventListener(evtName, getter);
        });
    }
    get isConnected() {
        return this.metadataState === ConnectionState.Connected;
    }
    async callThrottled(key, command, ...args) {
        if (!this.tasks.has(key)) {
            const start = performance.now();
            const task = this.callInternal(command, ...args);
            this.tasks.set(key, task);
            await task;
            const delta = performance.now() - start;
            const sleepTime = this.sleepTime - delta;
            if (sleepTime > 0) {
                await sleep(this.sleepTime);
            }
            this.tasks.delete(key);
        }
    }
    async callImmediate(command, ...args) {
        await this.callInternal(command, ...args);
    }
    setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callThrottled("userPosed", "userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callImmediate("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callThrottled("userPointer" + name, "userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setAvatarEmoji(emoji) {
        this.callImmediate("setAvatarEmoji", emoji);
    }
    setAvatarURL(url) {
        this.callImmediate("avatarChanged", url);
    }
    emote(emoji) {
        this.callImmediate("emote", emoji);
    }
    chat(text) {
        this.callImmediate("chat", text);
    }
}
//# sourceMappingURL=BaseMetadataClient.js.map