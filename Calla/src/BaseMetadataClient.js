import { HubConnectionState } from "@microsoft/signalr";
import { sleep, TypedEventBase } from "kudzu";
import { CallaMetadataEventType, CallaUserEvent } from "./CallaEvents";
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
        return this.metadataState === HubConnectionState.Connected;
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
        this.callThrottled(CallaMetadataEventType.UserPosed, CallaMetadataEventType.UserPosed, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callThrottled(CallaMetadataEventType.UserPointer + name, CallaMetadataEventType.UserPointer, name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setAvatarEmoji(emoji) {
        this.callImmediate(CallaMetadataEventType.SetAvatarEmoji, emoji);
    }
    setAvatarURL(url) {
        this.callImmediate(CallaMetadataEventType.AvatarChanged, url);
    }
    emote(emoji) {
        this.callImmediate(CallaMetadataEventType.Emote, emoji);
    }
    chat(text) {
        this.callImmediate(CallaMetadataEventType.Chat, text);
    }
}
//# sourceMappingURL=BaseMetadataClient.js.map